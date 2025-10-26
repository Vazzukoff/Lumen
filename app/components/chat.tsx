"use client";

import { useEffect, useRef } from "react";
import { LuSparkles } from "react-icons/lu";

// Tipo de cada mensaje
type Message = {
  id: string;
  text: string;
  type: "user" | "lumen"; // ajusta según los tipos que uses
};

// Tipo de las props del componente
type ChatProps = {
  messages: Message[];
  isTyping: boolean;
};

export default function Chat({ messages, isTyping }: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8">
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
                  ? "bg-linear-to-br from-purple-400 to-indigo-400 text-white"
                  : "bg-white text-gray-800"
              } rounded-3xl px-6 py-4 shadow-sm`}
            >
              {message.type === "lumen" && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-purple-300 to-indigo-300 flex items-center justify-center">
                    <LuSparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-purple-600">
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

        {isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-white rounded-3xl px-6 py-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-purple-300 to-indigo-300 flex items-center justify-center">
                  <LuSparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium text-purple-600">
                  Lumen
                </span>
              </div>
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}