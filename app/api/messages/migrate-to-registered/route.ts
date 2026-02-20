// app/api/messages/migrate-to-registered/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { 
  migrateAnonymousToRegistered, 
  getMessageLimitStatus 
} from "@/services/limits.service";

/**
 * Esta ruta se llama inmediatamente después del registro exitoso
 * para migrar el contador anónimo al usuario registrado
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar que el usuario esté autenticado
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { anonymousIdentifier } = body;

    if (!anonymousIdentifier) {
      return NextResponse.json(
        { error: "Se requiere anonymousIdentifier" },
        { status: 400 }
      );
    }

    // Migrar de anónimo a registrado
    await migrateAnonymousToRegistered(
      session.user.id,
      anonymousIdentifier
    );

    // Obtener el nuevo estado (ya no necesita anonymousIdentifier porque es usuario registrado)
    const status = await getMessageLimitStatus();

    return NextResponse.json(
      { 
        success: true,
        message: "Migración completada",
        status 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error migrating anonymous to registered:", error);
    return NextResponse.json(
      { 
        error: "Error al migrar contador",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}