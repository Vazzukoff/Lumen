// app/api/messages/check-limit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getMessageLimitStatus } from "@/services/limits.service";

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

    // Obtener el estado del límite
    const status = await getMessageLimitStatus(anonymousIdentifier);

    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    console.error("Error checking message limit:", error);
    return NextResponse.json(
      { 
        error: "Error al verificar límite de mensajes",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}