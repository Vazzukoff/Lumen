'use client';

import { useState } from 'react';
import { LuSparkles, LuLogOut } from "react-icons/lu";
import { useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import { Button } from '@/UI/button';
import LoginPopup from '@/UI/login-popup';

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  return (
    <>
      <header className="bg-white backdrop-blur-md border-b border-purple-100 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => router.push('/')}
          >
            <div className="w-10 h-10 rounded-full bg-(--blue) flex items-center justify-center shadow-md hover:scale-105 transition-transform">
              <LuSparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-light text-gray-800">Lumen</h1>
              <p className="text-xs text-gray-500">Tu lugar seguro 🔒</p>
            </div>
          </div>  

          {/* Sección de usuario */}
          <div className="flex items-center gap-3">
            {session?.user ? (
              // ✅ Usuario logueado
              <>
                <span className="text-sm text-gray-600">
                  Hola de nuevo, <span className="font-semibold text-gray-800">{session.user.name}</span>
                </span>
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="font-semibold flex items-center gap-2"
                >
                  <LuLogOut className="w-4 h-4" />
                  Cerrar sesión
                </Button>
              </>
            ) : (
              // ✅ Usuario no logueado
              <Button 
                variant="outline" 
                size="default"
                onClick={() => setShowLoginPopup(true)}
                className="font-semibold"
              >
                Inicia sesión
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ✅ Popup de login */}
      {showLoginPopup && (
        <LoginPopup 
          onClose={() => setShowLoginPopup(false)}
          redirectTo="/chat"
        />
      )}
    </>
  );
}