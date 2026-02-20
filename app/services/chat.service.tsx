"use client";

export interface Message {
  id: string;
  type: "user" | "lumen";
  text: string;
  timestamp: Date;
  role?: "user" | "model";
  parts?: string;
}

class ChatService {
  /**
   * 🔥 Envía un mensaje con historial y recibe respuesta por streaming (chunks de texto).
   * Si no hay userId, se considerará una sesión anónima (no se llama a personalización).
   */
  async sendMessageWithHistoryStreaming(
    message: string,
    history: Message[],
    userId?: string | null, // 👈 ahora opcional y tipo string
    sessionId: string = "default",
    onChunk?: (chunk: string) => void // callback para cada pedazo de texto
  ): Promise<void> {
    try {
      const bodyPayload = {
        message,
        history,
        userId: userId ?? null, // null si no hay usuario autenticado
        sessionId,
        stream: true,
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        let errorMessage = "Error en la respuesta del servidor";
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch {
          /* respuesta no JSON, ignorar */
        }
        throw new Error(errorMessage);
      }

      // 📡 Procesar stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No se pudo obtener el stream del servidor");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6); // remueve "data: "

          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.chunk && onChunk) {
              onChunk(parsed.chunk);
            }
          } catch {
            // Ignorar chunks incompletos o no parseables
          }
        }
      }
    } catch (error) {
      console.error("❌ Error al enviar mensaje con streaming:", error);
      throw error;
    }
  }

  /**
   * 🧠 Envía un mensaje sin streaming (respuesta completa)
   */
  async sendMessageWithHistory(
    message: string,
    history: Message[],
    userId?: string | null, // 👈 también opcional
    sessionId: string = "default"
  ): Promise<string> {
    try {
      const bodyPayload = {
        message,
        history,
        userId: userId ?? null,
        sessionId,
        stream: false,
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en la respuesta del servidor");
      }

      return data.reply;
    } catch (error) {
      console.error("❌ Error al enviar mensaje con historial:", error);
      throw error;
    }
  }

  /**
   * 🧹 Limpia datos de sesión local (si los usas)
   */
  clearSession(sessionId: string = "default") {
    // Por ahora vacío, pero podrías limpiar historial local o cache
  }
}

export const chatService = new ChatService();