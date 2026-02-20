// app/api/auth/register/route.ts (o donde tengas tu ruta actual)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registrationSchema } from "@/lib/validations/auth";

// ✅ Agregar constante para el límite de mensajes de usuarios registrados
const DEFAULT_REGISTERED_MESSAGE_LIMIT = 50;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // ✅ Validar con el mismo schema de Zod
    const result = registrationSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: "Datos inválidos", 
          details: result.error.errors 
        }, 
        { status: 400 }
      );
    }

    const { name, email, password, birthdate, gender, country } = result.data;

    // Verificar si el email ya existe
    const existing = await prisma.user.findUnique({ where: { email } });
    
    if (existing) {
      return NextResponse.json(
        { error: "Este email ya está registrado" }, 
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con perfil (solo si hay al menos un dato personal)
    const shouldCreateProfile = birthdate || gender || country;

    // ✅ CAMBIO PRINCIPAL: Usar transacción para crear usuario + perfil + MessageUsage
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Crear perfil si hay datos personales
        ...(shouldCreateProfile && {
          profile: {
            create: {
              birthDate: birthdate ? new Date(birthdate) : null,
              gender: gender || null,
              country: country || null,
            }
          }
        }),
        // ✅ NUEVO: Crear MessageUsage automáticamente al registrarse
        messageUsage: {
          create: {
            messagesSent: 0, // Empieza en 0 (beneficio por registrarse)
            maxMessages: DEFAULT_REGISTERED_MESSAGE_LIMIT,
          }
        }
      },
      select: { 
        id: true, 
        name: true, 
        email: true,
        created_at: true,
        profile: {
          select: {
            birthDate: true,
            gender: true,
            country: true
          }
        },
        // ✅ NUEVO: Incluir messageUsage en la respuesta
        messageUsage: {
          select: {
            messagesSent: true,
            maxMessages: true,
          }
        }
      },
    });

    return NextResponse.json({ 
      success: true, 
      user,
      message: "Usuario registrado exitosamente",
      // ✅ NUEVO: Información útil para el frontend
      messageLimit: {
        messagesAvailable: user.messageUsage?.maxMessages || 0,
        phase: "registered"
      }
    });

  } catch (error) {
    console.error("❌ Error en registro:", error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: "Este email ya está registrado" }, 
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Error al registrar usuario" }, 
      { status: 500 }
    );
  }
}