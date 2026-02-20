"use client";
import { Button } from '@/UI/button';
import { LuMessageCircleHeart, LuArrowRight } from "react-icons/lu";
import { useRouter } from 'next/navigation';

export default function FinalCTA() {
  const router = useRouter();
  
  return (
    <section className="py-32 px-6 bg-(--blue) text-white select-none relative overflow-hidden">
      {/* Elementos decorativos sutiles */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--mint)]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Un mensaje puede ser el primer paso para sentirte mejor.
        </h2>
        
        <p className="text-xl md:text-2xl text-white/95 leading-relaxed font-light max-w-3xl mx-auto">
          No tienes que guardar lo que sientes. Lumen te escucha, sin juicios, a cualquier hora. A veces, solo hablar es el comienzo del alivio.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button
            onClick={() => router.push('/chat')}
            className="bg-white text-(--blue) hover:bg-white/95 px-10 py-7 rounded-2xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300 text-lg font-semibold"
          >
            <LuMessageCircleHeart className="mr-2 h-6 w-6" />
            Comenzar ahora
            <LuArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-6 pt-6">
          <div className="flex items-center gap-2 text-sm text-white/90">
            <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
            <span className="font-light">Disponible 24/7</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/90">
            <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
            <span className="font-light">Anónimo</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/90">
            <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
            <span className="font-light">Sin juicios</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/90">
            <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
            <span className="font-light">Sin citas</span>
          </div>
        </div>
      </div>
    </section>
  );
}