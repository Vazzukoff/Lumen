// hooks/use-message-limit.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import type { MessageLimitStatus } from "@/services/limits.service";

export function useMessageLimit() {
  const [status, setStatus] = useState<MessageLimitStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener o generar identificador anónimo
  const getAnonymousIdentifier = useCallback((): string => {
    if (typeof window === 'undefined') return '';
    
    const stored = localStorage.getItem("lumen_anonymous_id");
    if (stored) return stored;

    // Generar ID único para usuarios anónimos
    const newId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("lumen_anonymous_id", newId);
    return newId;
  }, []);

  // Verificar límite actual
  const checkLimit = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const identifier = getAnonymousIdentifier();
      console.log("🔍 Checking limit with identifier:", identifier);
      
      const response = await fetch("/api/messages/check-limit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anonymousIdentifier: identifier }),
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error response:", errorData);
        throw new Error(errorData.error || "Error al verificar límite");
      }

      const data: MessageLimitStatus = await response.json();
      console.log("✅ Limit status received:", data);
      
      // Agregar lógica de advertencia (mostrar cuando quedan 3 o menos mensajes)
      const shouldShowWarning = !data.unlimited && data.remaining <= 3 && data.remaining > 0;
      
      setStatus({ ...data, shouldShowWarning });
    } catch (err) {
      console.error("💥 Error checking message limit:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [getAnonymousIdentifier]);

  // Incrementar contador
  const incrementCount = useCallback(async (): Promise<MessageLimitStatus | null> => {
    try {
      const identifier = getAnonymousIdentifier();
      console.log("➕ Incrementing count with identifier:", identifier);
      
      const response = await fetch("/api/messages/increment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anonymousIdentifier: identifier }),
      });

      console.log("📡 Increment response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Increment error:", errorData);
        throw new Error(errorData.error || "Error al incrementar contador");
      }

      const data: MessageLimitStatus = await response.json();
      console.log("✅ Updated status:", data);
      
      // Agregar lógica de advertencia
      const shouldShowWarning = !data.unlimited && data.remaining <= 3 && data.remaining > 0;
      
      const updatedData = { ...data, shouldShowWarning };
      setStatus(updatedData);
      return updatedData;
    } catch (err) {
      console.error("💥 Error incrementing message count:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      return null;
    }
  }, [getAnonymousIdentifier]);

  // Verificar límite al montar el componente
  useEffect(() => {
    checkLimit();
  }, [checkLimit]);

  return {
    status,
    loading,
    error,
    checkLimit,
    incrementCount,
  };
}