'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Header from '@/components/chat/chat-header';
import Chat from '@/components/chat/chat';
import Input from '@/components/chat/input';
import RegistrationPopup from '@/UI/registration-popup';
import PremiumPopup from '@/UI/plans-popup';
import { chatService, type Message } from '@/services/chat.service';
import { useMessageLimit } from '@/hooks/use-message-limit';

export default function LumenChat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const currentStreamingIdRef = useRef<string | null>(null);

  // ✅ Hook personalizado para manejar límites desde DB
  const { status: limitStatus, loading: limitLoading, checkLimit, incrementCount } = useMessageLimit();

  // ✅ Verificar límites al montar el componente
  useEffect(() => {
    checkLimit();
  }, [session]); // Re-verificar cuando cambie la sesión

  const handleSendMessage = async (text: string) => {
    // ⏳ Esperar a que se cargue el estado del límite
    if (limitLoading || !limitStatus) {
      console.log('Cargando límites...');
      return;
    }

    // 🚫 Verificar si puede enviar mensajes
    if (!limitStatus.allowed) {
      if (limitStatus.showRegistrationPopup) {
        setShowRegistrationPopup(true);
      } else if (limitStatus.showSubscriptionPopup) {
        setShowPaymentPopup(true);
      }
      return;
    }

    // 🧠 Agregar mensaje del usuario al chat
    const userMessage: Message = {
      id: `${Date.now()}`,
      type: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    try {
      // 🪄 Preparar historial (excluye el mensaje de bienvenida)
      const history: Message[] = messages
        .filter((msg) => !(msg.type === 'lumen' && msg.id === '1'))
        .map((msg) => ({
          ...msg,
          role: msg.type === 'user' ? 'user' : 'model',
          parts: msg.text,
        }));

      const userId = session?.user?.id || null;
      let isFirstChunk = true;

      // 🤖 Enviar mensaje con streaming
      await chatService.sendMessageWithHistoryStreaming(
        text,
        history,
        userId,
        'lumen-session',
        (chunk: string) => {
          if (isFirstChunk) {
            setIsTyping(false);
            const lumenMessageId = `lumen-${Date.now()}`;
            currentStreamingIdRef.current = lumenMessageId;

            const lumenMessage: Message = {
              id: lumenMessageId,
              type: 'lumen',
              text: chunk,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, lumenMessage]);
            isFirstChunk = false;
          } else {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === currentStreamingIdRef.current
                  ? { ...msg, text: msg.text + chunk }
                  : msg
              )
            );
          }
        }
      );

      currentStreamingIdRef.current = null;

      // ✅ Incrementar contador en DB después de respuesta exitosa
      const updatedStatus = await incrementCount();

      // 💡 Verificar si debe mostrar popups después de incrementar
      if (updatedStatus) {
        if (updatedStatus.showRegistrationPopup) {
          setShowRegistrationPopup(true);
        } else if (updatedStatus.showSubscriptionPopup) {
          setShowPaymentPopup(true);
        }

        // ⚠️ Mostrar advertencia si quedan pocos mensajes
        if (updatedStatus.shouldShowWarning && updatedStatus.remaining > 0) {
          const warningMessage: Message = {
            id: `warning-${Date.now()}`,
            type: 'lumen',
            text: `⚠️ Te quedan ${updatedStatus.remaining} mensaje${updatedStatus.remaining === 1 ? '' : 's'} gratis. ${
              updatedStatus.phase === 'anonymous' 
                ? '¡Regístrate para obtener más mensajes!' 
                : '¡Suscríbete para mensajes ilimitados!'
            }`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, warningMessage]);
        }
      }

    } catch (error) {
      console.error('Error al obtener respuesta:', error);
      setIsTyping(false);
      currentStreamingIdRef.current = null;

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'lumen',
        text: 'Lo siento, estoy teniendo dificultades para responder en este momento. ¿Podrías intentarlo de nuevo?',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleRegister = async (
    email: string,
    name: string,
    password: string,
    birthdate: string,
    gender: string,
    country: string
  ) => {
    try {
      // 1️⃣ Registrar usuario en la base de datos
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          password,
          birthdate,
          gender,
          country,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar');
      }

      // 2️⃣ Iniciar sesión automáticamente con NextAuth
      const signInResult = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error) {
        throw new Error(
          'Usuario creado, pero no se pudo iniciar sesión automáticamente. Por favor, inicia sesión manualmente.'
        );
      }

      // 3️⃣ Migrar contador de anónimo a registrado
      const anonymousId = localStorage.getItem('lumen_anonymous_id');
      if (anonymousId) {
        await fetch('/api/messages/migrate-to-registered', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ anonymousIdentifier: anonymousId }),
        });
      }

      // 4️⃣ Cerrar popup y actualizar límites
      setShowRegistrationPopup(false);
      await checkLimit(); // Re-verificar límites como usuario registrado

      // 5️⃣ Mensaje de bienvenida con info de mensajes disponibles
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        type: 'lumen',
        text: `¡Bienvenido/a, ${name}! 🎉\n\nGracias por registrarte. Ahora tienes ${data.messageLimit?.messagesAvailable || 50} mensajes adicionales de prueba.\n\n¿En qué más puedo ayudarte?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, welcomeMessage]);

    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  // Handler para upgrade
  const handleUpgrade = () => {
    console.log('Usuario eligió actualizar: redirigir a checkout o iniciar flujo de pago');
    // Ejemplo: router.push('/checkout')
  };

  return (
    <section className="flex flex-col h-screen bg-(--light-blue)">
      <Header 
        // ✅ OPCIONAL: Pasar info de límites al header para mostrar contador
        remainingMessages={limitStatus?.remaining}
        unlimited={limitStatus?.unlimited}
      />
      <Chat messages={messages} isTyping={isTyping} />
      <Input 
        onSend={handleSendMessage}
        // ✅ OPCIONAL: Deshabilitar input si no puede enviar mensajes
        disabled={limitLoading || !limitStatus?.allowed}
      />

      {/* Popup de registro */}
      {showRegistrationPopup && (
        <RegistrationPopup
          onClose={() => setShowRegistrationPopup(false)}
          onRegister={handleRegister}
        />
      )}

      {/* Popup de pago / premium */}
      {showPaymentPopup && (
        <PremiumPopup
          onClose={() => setShowPaymentPopup(false)}
          onUpgrade={handleUpgrade}
        />
      )}
    </section>
  );
}