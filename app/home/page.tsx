'use client';

import { useState } from 'react';
import Header from '@/components/header';
import Chat from '@/components/chat';
import Input from '@/components/input';
import { chatService, type Message } from '@/services/chat.service';

export default function LumenChat() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'lumen',
      text: 'Hola, bienvenido/a a Lumen. 🌙\n\nEste es tu espacio seguro. Aquí puedes expresar lo que sientes sin ser juzgado.\n\n¿Cómo te sientes hoy?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (text: string) => {
    const userMessage = {
      id: `${Date.now()}`,
      type: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const history: Message[] = messages
        .filter(msg => msg.type !== 'lumen' || msg.id !== 1)
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'model',
          parts: msg.text
        }));

      // 👇 Usa un ID de usuario real
      const response = await chatService.sendMessageWithHistory(
        text,
        history,
        1, // 👈 el ID del usuario (ej. 1 o el actual)
        "lumen-session"
      );

      const lumenMessage = {
        id: `${Date.now()}`,
        type: 'lumen',
        text: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, lumenMessage]);
    } catch (error) {
      console.error('Error al obtener respuesta:', error);

      const errorMessage = {
        id: `${Date.now()}`,
        type: 'lumen',
        text: 'Lo siento, estoy teniendo dificultades para responder en este momento. ¿Podrías intentarlo de nuevo?',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      <Chat messages={messages} isTyping={isTyping} />
      <Input onSend={handleSendMessage} />
    </div>
  );
}