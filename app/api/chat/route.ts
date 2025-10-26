import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { systemPrompt } from "@/services/system.prompt";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history, userId, sessionId } = body;

    console.log("📥 Datos recibidos del cliente:", { message, userId, sessionId });

    if (!userId) {
      return NextResponse.json({ error: "Falta el userId" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, age: true, gender: true, country: true },
    });

    console.log("👤 Usuario encontrado:", user);

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
    });

    if (!process.env.GEMINI_API_KEY && !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error("Falta la API key de Gemini");
    }

    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history: (history || []).map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.parts }],
      })),
      config: {
        systemInstruction: {
          role: "system",
          parts: [{ text: systemPrompt(user) }],
        },
      },
    });

    const response = await chat.sendMessage({ message });

    console.log("🤖 Respuesta del modelo:", response.text);

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error("❌ Error en /api/chat:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}