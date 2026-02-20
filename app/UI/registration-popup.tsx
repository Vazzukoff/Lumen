"use client";

import { useState } from "react";
import { LuSparkles, LuMail, LuUser, LuLock, LuCalendar, LuGlobe } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import {
  registrationSchema,
  type RegistrationFormData,
  HISPANIC_COUNTRIES
} from "@/lib/validations/auth";

interface RegistrationPopupProps {
  onRegister: (userData: any) => void;
  onClose: () => void;
}

export default function RegistrationPopup({ onRegister, onClose }: RegistrationPopupProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    email: "",
    password: "",
    birthdate: "",
    gender: "" as any,
    country: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationFormData, string>>>({});

  const handleChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validar con Zod
    const result = registrationSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const formattedErrors = Object.fromEntries(
        Object.entries(fieldErrors).map(([key, val]) => [key, val?.[0] || ""])
      ) as Partial<Record<keyof RegistrationFormData, string>>;
      setErrors(formattedErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Llamar al endpoint de registro
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores del servidor
        if (data.error) {
          setErrors({ email: data.error });
        } else {
          setErrors({ email: "Hubo un error al registrarte. Intenta nuevamente." });
        }
        setIsSubmitting(false);
        return;
      }

      // Registro exitoso
      if (data.success) {
        // Llamar al callback con los datos del usuario
        onRegister(data);
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setErrors({ email: "Error de conexión. Intenta nuevamente." });
      setIsSubmitting(false);
    }
  };

  const getMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 13);
    return date.toISOString().split("T")[0];
  };

  const getMinDate = () => "1900-01-01";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full relative overflow-hidden border border-gray-200">
        {/* Header profesional */}
        <div className="bg-blue-600 px-8 py-5 text-white border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <LuSparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">Crear cuenta</h2>
                <p className="text-white/85 text-sm leading-snug max-w-lg">
                  Has alcanzado el límite de mensajes gratuitos. Regístrate para continuar usando Lumen.
                </p>
              </div>
            </div>

            {/* Botón de cierre profesional */}
            <button
              onClick={onClose}
              type="button"
              className="text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer p-1.5 rounded-md"
              aria-label="Cerrar"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido dividido en dos columnas */}
        <div className="grid grid-cols-3">
          {/* Columna izquierda - Formulario */}
          <div className="col-span-2 px-8 py-7 border-r border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo</label>
                <div className="relative">
                  <LuUser className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Tu nombre"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      errors.name ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.name && <p className="text-red-600 text-xs mt-1.5">{errors.name}</p>}
              </div>

              {/* Campo Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <LuMail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="tu@email.com"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      errors.email ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && <p className="text-red-600 text-xs mt-1.5">{errors.email}</p>}
              </div>

              {/* Campo Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
                <div className="relative">
                  <LuLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      errors.password ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.password && <p className="text-red-600 text-xs mt-1.5">{errors.password}</p>}
              </div>

              {/* Campos en dos columnas */}
              <div className="grid grid-cols-2 gap-5">
                {/* Campo Fecha de nacimiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de nacimiento</label>
                  <div className="relative">
                    <LuCalendar className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      value={formData.birthdate}
                      onChange={(e) => handleChange("birthdate", e.target.value)}
                      max={getMaxDate()}
                      min={getMinDate()}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                        errors.birthdate ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.birthdate && <p className="text-red-600 text-xs mt-1.5">{errors.birthdate}</p>}
                </div>

                {/* Campo Género */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Género</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className={`w-full px-4 py-2.5 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      errors.gender ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Selecciona tu género</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                    <option value="prefer_not_to_say">Prefiero no decirlo</option>
                  </select>
                  {errors.gender && <p className="text-red-600 text-xs mt-1.5">{errors.gender}</p>}
                </div>
              </div>

              {/* Campo País */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">País</label>
                <div className="relative">
                  <LuGlobe className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  <select
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      errors.country ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Selecciona tu país</option>
                    {HISPANIC_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.country && <p className="text-red-600 text-xs mt-1.5">{errors.country}</p>}
              </div>

              {/* Botón de registro */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-md text-sm font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSubmitting ? "Registrando..." : "Crear cuenta"}
                </button>
              </div>
            </form>
          </div>

          {/* Columna derecha - Beneficios */}
          <div className="col-span-1 bg-gradient-to-br from-blue-50 to-blue-100/30 px-6 py-7">
            <div className="flex flex-col h-full">
              <div className="mb-6">
                <h3 className="text-base font-semibold text-blue-600 mb-2">¿Qué incluye tu cuenta?</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Al registrarte obtienes acceso completo a todas estas funcionalidades de forma gratuita.
                </p>
              </div>

              <div className="space-y-5 flex-1">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center text-xl">
                    ✨
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-600 mb-1">50 mensajes diarios</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Interactúa con Lumen sin límites durante todo el día
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center text-xl">
                    💾
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-600 mb-1">Historial guardado</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Todas tus conversaciones se guardan para que puedas consultarlas cuando quieras
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center text-xl">
                    🔒
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-600 mb-1">Privacidad total</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Tus datos están protegidos y tus conversaciones son privadas
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-blue-200/50">
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Sin costos ocultos. Cuenta gratuita para siempre.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}