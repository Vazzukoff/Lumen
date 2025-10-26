"use client";

export interface Message {
  role: "user" | "model";
  parts: string;
}

class ChatService {
  // 🧠 Llama al endpoint del servidor que sí usa Prisma y Gemini
  async sendMessageWithHistory(
    message: string,
    history: Message[],
    userId: number,
    sessionId: string = "default"
  ): Promise<string> {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history,
          userId,
          sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en la respuesta del servidor");
      }

      return data.reply;
    } catch (error) {
      console.error("Error al enviar mensaje con historial:", error);
      throw error;
    }
  }

  // (Opcional) método para limpiar sesión si lo manejas localmente
  clearSession(sessionId: string = "default") {
    // Aquí podrías limpiar memoria local si fuera necesario
  }
}

export const chatService = new ChatService();