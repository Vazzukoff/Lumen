"use client";

import { useEffect, useRef } from "react";
import { LuSparkles } from "react-icons/lu";

type Message = {
  id: string;
  text: string;
  type: "user" | "lumen";
};

type ChatProps = {
  messages: Message[];
  isTyping: boolean;
};

export default function Chat({ messages, isTyping }: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const lastMessageLengthRef = useRef<number>(0);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Scroll cuando cambian los mensajes o el typing
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    
    // Si el último mensaje está siendo escrito (streaming)
    if (lastMessage && lastMessage.type === "lumen") {
      const currentLength = lastMessage.text.length;
      
      // Solo hacer scroll si el texto está creciendo (streaming activo)
      if (currentLength > lastMessageLengthRef.current) {
        // Scroll suave mientras se escribe
        scrollToBottom("smooth");
      }
      
      lastMessageLengthRef.current = currentLength;
    } else {
      // Para mensajes del usuario, scroll inmediato
      scrollToBottom("auto");
      lastMessageLengthRef.current = 0;
    }
  }, [messages]);

  // Scroll cuando aparece el indicador de typing
  useEffect(() => {
    if (isTyping) {
      scrollToBottom("smooth");
    }
  }, [isTyping]);

  return (
    <section 
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto px-4 py-8"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            } animate-fadeIn`}
          >
            <div
              className={`max-w-[75%] ${
                message.type === "user"
                  ? "bg-(--blue) text-white"
                  : "bg-white text-gray-800"
              } rounded-3xl px-6 py-4 shadow-sm`}
            >
              {message.type === "lumen" && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-(--blue) flex items-center justify-center">
                    <LuSparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-(--blue)">
                    Lumen
                  </span>
                </div>
              )}
              <p className="text-[15px] leading-relaxed whitespace-pre-line">
                {message.text}
              </p>
            </div>
          </div>
        ))}
        
        {/* Indicador de typing */}
        {isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-white rounded-3xl px-6 py-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-(--blue) flex items-center justify-center">
                  <LuSparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium text-(--blue)">
                  Lumen
                </span>
              </div>
              <p className="italic text-gray-500">pensando...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </section>
  );
}