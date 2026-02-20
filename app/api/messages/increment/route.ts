// app/api/messages/increment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { 
  getMessageLimitStatus, 
  incrementMessageCount 
} from "@/services/limits.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { anonymousIdentifier } = body;

    // Validar que se envíe el identifier para usuarios anónimos
    if (!anonymousIdentifier) {
      return NextResponse.json(
        { error: "Se requiere anonymousIdentifier" },
        { status: 400 }
      );
    }

    // Primero verificar si puede enviar mensajes
    const currentStatus = await getMessageLimitStatus(anonymousIdentifier);

    if (!currentStatus.allowed) {
      return NextResponse.json(
        { 
          error: "Límite de mensajes alcanzado",
          status: currentStatus
        },
        { status: 403 }
      );
    }

    // Incrementar el contador
    const updatedStatus = await incrementMessageCount(anonymousIdentifier);

    return NextResponse.json(updatedStatus, { status: 200 });
  } catch (error) {
    console.error("Error incrementing message count:", error);
    return NextResponse.json(
      { 
        error: "Error al incrementar contador de mensajes",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}