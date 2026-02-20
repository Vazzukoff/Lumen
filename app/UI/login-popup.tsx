"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LuSparkles, LuMail, LuLock, LuHeart, LuMessageCircle, LuShield } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { loginSchema } from "@/lib/validations/auth";
import { Button } from "@/UI/button";
import RegistrationPopup from "@/UI/registration-popup"; // ajusta la ruta según tu estructura

interface LoginPopupProps {
  onClose: () => void;
  redirectTo?: string;
}

export default function LoginPopup({ onClose, redirectTo = "/chat" }: LoginPopupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const router = useRouter();
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const zodErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as "email" | "password";
        zodErrors[field] = err.message;
      });
      setErrors(zodErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await signIn("credentials", {
        email: result.data.email,
        password: result.data.password,
        redirect: false,
      });

      if (response?.error) {
        setErrors({ general: "Email o contraseña incorrectos. Intenta nuevamente." });
        setIsSubmitting(false);
        return;
      }

      if (response?.ok) {
        onClose();
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      console.error("Error en login:", err);
      setErrors({ general: "Hubo un error al iniciar sesión. Intenta nuevamente." });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* POPUP DE LOGIN */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4 select-none">
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col md:flex-row">
          
          {/* MÓDULO IZQUIERDO - Imagen/Mensaje */}
          <div className="md:w-1/2 bg-[var(--blue)] p-8 md:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 text-center space-y-6">
              {/* Logo/Icono principal */}
              <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                <LuSparkles className="w-10 h-10" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold">
                Bienvenido a Lumen
              </h1>
              
              <p className="text-lg text-purple-100 max-w-md">
                Tu compañero de apoyo emocional y bienestar mental, siempre disponible para ti.
              </p>
              
              {/* Características */}
              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <LuHeart className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Apoyo emocional 24/7</p>
                    <p className="text-sm text-purple-100">Siempre aquí cuando nos necesites</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <LuMessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Consejos personalizados</p>
                    <p className="text-sm text-purple-100">Orientación psicológica adaptada a ti</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <LuShield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Privado y seguro</p>
                    <p className="text-sm text-purple-100">Tus conversaciones son confidenciales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MÓDULO DERECHO - Formulario */}
          <div className="md:w-1/2 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <LuSparkles className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold">¡Bienvenido de nuevo! ✨</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-purple-200 transition-colors cursor-pointer"
                  aria-label="Cerrar"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs mt-1">
                Inicia sesión para continuar con tu experiencia en Lumen.
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="px-6 py-5 flex-1 flex flex-col justify-center">
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <LuMail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                      }}
                      placeholder="tu@email.com"
                      className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contraseña</label>
                  <div className="relative">
                    <LuLock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                      }}
                      placeholder="Tu contraseña"
                      className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
              </div>

              {/* Error general */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs mt-4">
                  {errors.general}
                </div>
              )}

              {/* Link */}
              <div className="mt-3 text-right">
                <button
                  type="button"
                  onClick={() => alert("Funcionalidad de recuperación de contraseña próximamente")}
                  className="text-xs text-purple-600"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium 
                hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>

              {/* Link de registro */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-600">
                  ¿No tienes una cuenta?{" "}
                  <a
                    onClick={() => setShowRegistrationPopup(true)}
                    className="text-purple-600 font-medium hover:underline cursor-pointer"
                  >
                    Regístrate gratis
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showRegistrationPopup && (
              <RegistrationPopup 
                onClose={() => setShowRegistrationPopup(false)}
              />
            )}
    </>
  );
}