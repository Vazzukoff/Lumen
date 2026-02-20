import { Button } from '@/UI/button';
import { FaHeart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoginPopup from '@/UI/login-popup';
import { useState } from 'react';
import RegistrationPopup from "@/UI/registration-popup"
import PaymentButton from '@/lib/utils/payment-button';

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  
  return (
    <>
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-xl z-50 border-b border-border shadow-lg shadow-primary/5">
        <div className="max-w-7xl mx-auto px-3 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => router.push('/')}
          >
            <div className="relative w-12 h-12 rounded-2xl bg-(--blue) flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <FaHeart className="w-5 h-5 text-white drop-shadow-lg" fill="white" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-transparent bg-clip-text bg-(--blue) text-2xl font-bold tracking-tight group-hover:opacity-90 transition-opacity duration-300">
              Lumen
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <a 
              href="#beneficios" 
              className="px-5 py-2.5 text-muted-foreground hover:text-foreground font-medium transition-all duration-200 rounded-xl hover:bg-secondary/50 relative group"
            >
              Beneficios
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[var(--lavender)] to-[var(--mint)] group-hover:w-4/5 transition-all duration-300 rounded-full"></span>
            </a>
            <a 
              href="#como-funciona" 
              className="px-5 py-2.5 text-muted-foreground hover:text-foreground font-medium transition-all duration-200 rounded-xl hover:bg-secondary/50 relative group"
            >
              Cómo funciona
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[var(--lavender)] to-[var(--mint)] group-hover:w-4/5 transition-all duration-300 rounded-full"></span>
            </a>
            <a 
              href="#privacidad" 
              className="px-5 py-2.5 text-muted-foreground hover:text-foreground font-medium transition-all duration-200 rounded-xl hover:bg-secondary/50 relative group"
            >
              Privacidad
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[var(--lavender)] to-[var(--mint)] group-hover:w-4/5 transition-all duration-300 rounded-full"></span>
            </a>

            <div className="ml-6 flex items-center gap-3 pl-6 border-l border-border">
              {session?.user ? (
                <>
                  <span className="text-sm text-muted-foreground font-medium px-3 py-1.5 rounded-lg">
                    Hola, <span className="text-primary font-semibold">{session.user.name}</span>
                  </span>
                  <Button 
                    size="default"
                    onClick={() => router.push('/chat')}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 font-semibold hover:scale-105 rounded-lg"
                  >
                    Ir al chat
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="default"
                    onClick={() => setShowLoginPopup(true)}
                    className="font-semibold border-2 border-primary/30 text-foreground hover:bg-secondary hover:border-primary/50 rounded-lg"
                  >
                    Inicia sesión
                  </Button>

                  <PaymentButton/>

                  <Button 
                    size="default"
                    onClick={() => router.push('/chat')}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 font-semibold hover:scale-105 rounded-lg"
                  >
                    Pruébalo gratis
                  </Button>

                  <Button 
                    variant="outline" 
                    size="default"
                    onClick={() => setShowRegistrationPopup(true)}
                    className="font-semibold border-2 border-primary/30 text-foreground hover:bg-secondary hover:border-primary/50 rounded-lg"
                  >
                    Regístrate
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {showLoginPopup && (
        <LoginPopup 
          onClose={() => setShowLoginPopup(false)}
          redirectTo="/chat"
        />
      )}
      {showRegistrationPopup && (
        <RegistrationPopup 
          onClose={() => setShowRegistrationPopup(false)}
        />
      )}
    </>
  );
}