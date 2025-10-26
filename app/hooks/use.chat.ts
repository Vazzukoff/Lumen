"use client";

import { useState, useEffect } from 'react';
import { chatService, type Message } from '../services/chat.service';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionId = 'user-session';

  useEffect(() => {
    const welcomeMessage: Message = {
      role: 'model',
      parts: '¡Hola! 👋 Soy MentorAI, tu asistente personal de estudio. ¿En qué puedo ayudarte hoy?'
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      role: 'user',
      parts: text
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await chatService.sendMessageWithHistory(text, messages, sessionId);
      
      const modelMessage: Message = {
        role: 'model',
        parts: response
      };
      
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      setError('Error al obtener respuesta. Intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    const welcomeMessage: Message = {
      role: 'model',
      parts: '¡Hola! 👋 Soy MentorAI, tu asistente personal de estudio. ¿En qué puedo ayudarte hoy?'
    };
    setMessages([welcomeMessage]);
    setError(null);
    chatService.clearSession(sessionId);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat
  };
};