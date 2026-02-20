// app/api/messages/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { messageLimitService } from "@/services/limits.service";

/**
 * Esta es tu ruta principal del chatbot
 * Valida límites ANTES de procesar el mensaje con IA
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, anonymousIdentifier } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Mensaje inválido" },
        { status: 400 }
      );
    }

    if (!anonymousIdentifier) {
      return NextResponse.json(
        { error: "Se requiere anonymousIdentifier" },
        { status: 400 }
      );
    }

    // 🚦 PASO 1: Verificar límite ANTES de procesar
    const limitStatus = await messageLimitService.getMessageLimitStatus(
      anonymousIdentifier
    );

    if (!limitStatus.allowed) {
      return NextResponse.json(
        { 
          error: "Límite de mensajes alcanzado",
          limitStatus,
          shouldShowRegistrationPopup: limitStatus.showRegistrationPopup,
          shouldShowSubscriptionPopup: limitStatus.showSubscriptionPopup,
        },
        { status: 403 }
      );
    }

    // 🤖 PASO 2: Procesar mensaje con tu IA (aquí va tu lógica actual del chatbot)
    const aiResponse = await processMessageWithAI(message);

    // ✅ PASO 3: Solo incrementar si el mensaje se procesó exitosamente
    const updatedStatus = await messageLimitService.incrementMessageCount(
      anonymousIdentifier
    );

    return NextResponse.json(
      {
        success: true,
        response: aiResponse,
        limitStatus: updatedStatus,
        // Información útil para el frontend
        remaining: updatedStatus.remaining,
        shouldShowWarning: updatedStatus.remaining <= 2 && updatedStatus.remaining > 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { 
        error: "Error al procesar mensaje",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * 🤖 Función placeholder - reemplazar con tu lógica de IA actual
 */
async function processMessageWithAI(message: string): Promise<string> {
  // TODO: Aquí va tu integración actual con OpenAI, Anthropic, etc.
  // Ejemplo:
  // const response = await openai.chat.completions.create({...});
  // return response.choices[0].message.content;
  
  return `Respuesta de ejemplo a: ${message}`;
}