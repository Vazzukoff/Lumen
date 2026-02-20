import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { systemPrompt } from "@/services/system.prompt";
import { GoogleGenAI } from "@google/genai";

/**
 * POST /api/chat
 * Maneja mensajes del chat, tanto para usuarios logueados como invitados.
 * Soporta respuesta en streaming (modo typing) o completa.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history, userId, stream } = body;

    // 🧠 Obtener información del usuario (si está logueado)
    let user = null;

    if (userId) {
      try {
        // ✅ userId ahora es string (cuid), no necesita conversión
        user = await prisma.user.findUnique({
          where: {
            id: userId, // String directo
          },
          select: {
            name: true,
            profile: { // ✅ Incluir perfil relacionado
              select: {
                birthDate: true,
                gender: true,
                country: true,
              }
            }
          },
        });

        if (!user) {
          console.warn(`⚠️ Usuario con id=${userId} no encontrado. Continuando como invitado.`);
        } else {
          if (process.env.NODE_ENV === "development") {
            console.log("👤 Usuario encontrado:", {
              name: user.name,
              hasProfile: !!user.profile,
            });
          }
        }
      } catch (err) {
        console.error("❌ Error al buscar usuario en Prisma:", err);
        // Continuar como invitado en caso de error
        user = null;
      }
    } else {
    }

    // 🧩 Crear cliente de Google Gemini
    const apiKey =
      process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    
    if (!apiKey) {
      throw new Error("Falta la API key de Gemini. Configura GEMINI_API_KEY en tu archivo .env");
    }

    const ai = new GoogleGenAI({ apiKey });

    // 🧠 Construir contexto del sistema (prompt personalizado)
    const systemText = systemPrompt(user);

    // 🪄 Crear sesión de chat con el historial
    const chat = ai.chats.create({
      model: "gemini-2.5-flash-lite",
      history: (history || []).map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.parts }],
      })),
      config: {
        systemInstruction: {
          role: "system",
          parts: [{ text: systemText }],
        },
      },
    });

    // ⚡ STREAMING MODE
    if (stream) {
      const encoder = new TextEncoder();

      const customReadable = new ReadableStream({
        async start(controller) {
          try {
            const response = await chat.sendMessage({ message });
            const fullText = response.text;

            // Dividir texto en chunks de 6 palabras aprox.
            const words = fullText.split(" ");
            const chunks: string[] = [];
            
            for (let i = 0; i < words.length; i += 6) {
              // Añadir espacio al final de cada chunk (excepto el último)
              const chunk = words.slice(i, i + 6).join(" ");
              chunks.push(i + 6 < words.length ? chunk + " " : chunk);
            }

            // Enviar chunks con efecto typing
            for (const chunk of chunks) {
              const data = `data: ${JSON.stringify({ chunk })}\n\n`;
              controller.enqueue(encoder.encode(data));
              await new Promise((r) => setTimeout(r, 60)); // 60ms entre chunks
            }

            // Señal de finalización
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (error: any) {
            console.error("❌ Error en streaming:", error);
            
            // Enviar error al cliente
            const errorData = `data: ${JSON.stringify({
              error: error.message || "Error al procesar la respuesta",
            })}\n\n`;
            controller.enqueue(encoder.encode(errorData));
            controller.close();
          }
        },
      });

      return new Response(customReadable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // 💬 MODO NORMAL (sin streaming)
    const response = await chat.sendMessage({ message });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error("❌ Error en /api/chat:", error);
    
    // Mensaje de error más descriptivo
    const errorMessage = error.message || "Error interno del servidor";
    
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(process.env.NODE_ENV === "development" && { 
          stack: error.stack,
          details: error 
        })
      },
      { status: 500 }
    );
  }
}