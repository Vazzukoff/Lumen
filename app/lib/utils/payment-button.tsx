"use client";

import { useEffect } from "react";
import { Button } from "@/UI/button";


export default function PaymentButton() {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.culqi.com/js/v4";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;

      // Configuración inicial
      // @ts-ignore
      Culqi.settings({
        title: "Mi Negocio",
        currency: "PEN",
        amount: 15000 // S/150.00
      });
    };
  }, []);

  const abrirPago = () => {
    // @ts-ignore
    Culqi.open();
  };

  useEffect(() => {
    const handler = async () => {
      // @ts-ignore
      if (Culqi.token) {
        const token = Culqi.token.id;

        const res = await fetch("/api/culqi/pago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });

        const data = await res.json();
        console.log("Resultado del pago:", data);
      }
    };

    document.addEventListener("payment_event", handler);
    return () => document.removeEventListener("payment_event", handler);
  }, []);

  return (
    <Button
      variant="default"
      size="default"
    >
      Pagar
    </Button>
  )
}