// lib/services/message-limit.service.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";

// ======================================================
// TIPOS
// ======================================================
export type UserPhase = "anonymous" | "registered" | "subscribed";

export interface MessageLimitStatus {
  allowed: boolean;
  phase: UserPhase;
  messagesSent: number;
  maxMessages: number;
  remaining: number;
  unlimited: boolean;
  showRegistrationPopup: boolean;
  showSubscriptionPopup: boolean;
}

// ======================================================
// CONSTANTES (ahora como defaults, override por DB)
// ======================================================
const DEFAULT_ANONYMOUS_LIMIT = 1;

// ======================================================
// FUNCIONES DEL SERVICIO
// ======================================================

/**
 * 🔍 Obtener estado completo del límite de mensajes
 * @param anonymousIdentifier - Fingerprint/sessionId para usuarios anónimos
 */
export async function getMessageLimitStatus(
  anonymousIdentifier?: string
): Promise<MessageLimitStatus> {
  const session = await getServerSession(authOptions);

  // FASE 3: Usuario con suscripción activa
  if (session?.user?.id) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (subscription?.status === "active") {
      return {
        allowed: true,
        phase: "subscribed",
        messagesSent: 0,
        maxMessages: Infinity,
        remaining: Infinity,
        unlimited: true,
        showRegistrationPopup: false,
        showSubscriptionPopup: false,
      };
    }

    // FASE 2: Usuario registrado sin suscripción
    const usage = await prisma.messageUsage.findUnique({
      where: { userId: session.user.id },
    });

    if (usage) {
      const remaining = usage.maxMessages - usage.messagesSent;
      const allowed = remaining > 0;

      return {
        allowed,
        phase: "registered",
        messagesSent: usage.messagesSent,
        maxMessages: usage.maxMessages,
        remaining: Math.max(0, remaining),
        unlimited: false,
        showRegistrationPopup: false,
        showSubscriptionPopup: !allowed,
      };
    }

    // Usuario registrado pero sin MessageUsage (crear uno)
    const newUsage = await prisma.messageUsage.create({
      data: {
        userId: session.user.id,
      },
    });

    return {
      allowed: true,
      phase: "registered",
      messagesSent: 0,
      maxMessages: newUsage.maxMessages,
      remaining: newUsage.maxMessages,
      unlimited: false,
      showRegistrationPopup: false,
      showSubscriptionPopup: false,
    };
  }

  // FASE 1: Usuario anónimo (sin sesión)
  if (!anonymousIdentifier) {
    throw new Error("Se requiere identifier para usuarios anónimos");
  }

  let trial = await prisma.anonymousTrial.findUnique({
    where: { identifier: anonymousIdentifier },
  });

  if (!trial) {
    trial = await prisma.anonymousTrial.create({
      data: {
        identifier: anonymousIdentifier,
        maxMessages: DEFAULT_ANONYMOUS_LIMIT,
      },
    });
  }

  const remaining = trial.maxMessages - trial.messagesSent;
  const allowed = remaining > 0;

  return {
    allowed,
    phase: "anonymous",
    messagesSent: trial.messagesSent,
    maxMessages: trial.maxMessages,
    remaining: Math.max(0, remaining),
    unlimited: false,
    showRegistrationPopup: !allowed,
    showSubscriptionPopup: false,
  };
}

/**
 * ➕ Incrementar contador de mensajes
 * @param anonymousIdentifier - Fingerprint/sessionId para usuarios anónimos
 */
export async function incrementMessageCount(
  anonymousIdentifier?: string
): Promise<MessageLimitStatus> {
  const session = await getServerSession(authOptions);

  // Usuario con suscripción activa (no incrementar, es ilimitado)
  if (session?.user?.id) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (subscription?.status === "active") {
      return getMessageLimitStatus(anonymousIdentifier);
    }

    // Usuario registrado sin suscripción
    await prisma.messageUsage.update({
      where: { userId: session.user.id },
      data: {
        messagesSent: { increment: 1 },
        lastMessageAt: new Date(),
      },
    });

    return getMessageLimitStatus(anonymousIdentifier);
  }

  // Usuario anónimo
  if (!anonymousIdentifier) {
    throw new Error("Se requiere identifier para usuarios anónimos");
  }

  await prisma.anonymousTrial.upsert({
    where: { identifier: anonymousIdentifier },
    update: {
      messagesSent: { increment: 1 },
      lastMessageAt: new Date(),
    },
    create: {
      identifier: anonymousIdentifier,
      messagesSent: 1,
      maxMessages: DEFAULT_ANONYMOUS_LIMIT,
      lastMessageAt: new Date(),
    },
  });

  return getMessageLimitStatus(anonymousIdentifier);
}

/**
 * 🔄 Migrar contador de anónimo a usuario registrado
 * Se llama después del registro para transferir el conteo
 */
export async function migrateAnonymousToRegistered(
  userId: string,
  anonymousIdentifier: string
): Promise<void> {
  const trial = await prisma.anonymousTrial.findUnique({
    where: { identifier: anonymousIdentifier },
  });

  // Crear MessageUsage con contador en 0 (beneficio por registrarse)
  await prisma.messageUsage.create({
    data: {
      userId,
      messagesSent: 0, // Reset al registrarse
    },
  });

  // Opcional: borrar el trial anónimo
  if (trial) {
    await prisma.anonymousTrial.delete({
      where: { identifier: anonymousIdentifier },
    });
  }
}

/**
 * 🧹 Limpiar trials anónimos antiguos (cronjob recomendado)
 * Ejecutar diariamente para limpiar registros >30 días
 */
export async function cleanupOldAnonymousTrials(
  daysOld: number = 30
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await prisma.anonymousTrial.deleteMany({
    where: {
      trialStartedAt: {
        lt: cutoffDate,
      },
    },
  });

  return result.count;
}