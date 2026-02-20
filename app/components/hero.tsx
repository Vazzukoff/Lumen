"use client";
import { Button } from "@/UI/button";
import { FaHeart } from "react-icons/fa";
import { ImageWithFallback } from "@/utils/image-fallback";
import { useRouter } from "next/navigation";
import { FlickeringGrid } from "@/lib/utils/flickering-grid";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative pt-40 pb-24 px-6 select-none overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* 🟣 Fondo animado */}
      <div className="absolute inset-0 -z-10 opacity-60">
        <FlickeringGrid
          squareSize={4}
          gridGap={6}
          flickerChance={0.3}
          color="(--blue)" // puedes cambiar el color base del efecto
          maxOpacity={0.3}
          className="w-full h-full"
        />
      </div>

      {/* 🟢 Contenido principal */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl leading-tight font-bold text-foreground">
            Lumen,{" "}
            <span className="text-(--blue)">tu lugar seguro.</span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-xl">
            Cuando necesites hablar, Lumen te escucha. Desahógate, reflexiona y
            encuentra orientación emocional en un espacio confidencial,
            disponible para ti a toda hora.
          </p>

          <div className="pt-4">
            <Button
              onClick={() => router.push("/chat")}
              className="bg-(--blue) hover:bg-(--blue)/90 text-primary-foreground px-8 py-6 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 text-lg font-medium"
            >
              <FaHeart className="mr-2 h-5 w-5" />
              Comenzar conversación
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--mint)]"></div>
              <span className="font-light">Disponible 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--mint)]"></div>
              <span className="font-light">Anónimo</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--mint)]"></div>
              <span className="font-light">Privado</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--lavender)]/10 via-[var(--mint)]/10 to-transparent rounded-3xl blur-3xl"></div>
          <div className="absolute -inset-4 bg-gradient-to-br from-[var(--lavender)]/5 to-[var(--mint)]/5 rounded-3xl"></div>
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070"
            alt="Calma y serenidad"
            className="relative rounded-3xl shadow-2xl shadow-primary/10 w-full h-auto object-cover border border-border/50"
          />
        </div>
      </div>
    </section>
  );
}