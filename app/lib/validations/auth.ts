import { z } from "zod";

// Lista de países de habla hispana
export const HISPANIC_COUNTRIES = [
  { code: "AR", name: "Argentina" },
  { code: "BO", name: "Bolivia" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "CR", name: "Costa Rica" },
  { code: "CU", name: "Cuba" },
  { code: "DO", name: "República Dominicana" },
  { code: "EC", name: "Ecuador" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Guinea Ecuatorial" },
  { code: "GT", name: "Guatemala" },
  { code: "HN", name: "Honduras" },
  { code: "MX", name: "México" },
  { code: "NI", name: "Nicaragua" },
  { code: "PA", name: "Panamá" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Perú" },
  { code: "PR", name: "Puerto Rico" },
  { code: "ES", name: "España" },
  { code: "UY", name: "Uruguay" },
  { code: "VE", name: "Venezuela" },
] as const;

// Códigos de países válidos
const VALID_COUNTRY_CODES = HISPANIC_COUNTRIES.map(c => c.code);

// Helper para calcular edad
const calculateAge = (birthdate: string): number => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  return monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
    ? age - 1 
    : age;
};

// Schema de registro
export const registrationSchema = z.object({
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo")
    .trim(),
  
  email: z.string()
    .email("Por favor ingresa un email válido")
    .toLowerCase()
    .trim(),
  
  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña es demasiado larga"),
  
  birthdate: z.string()
    .min(1, "La fecha de nacimiento es requerida")
    .refine((date) => {
      const birthDate = new Date(date);
      return !isNaN(birthDate.getTime());
    }, "Fecha de nacimiento inválida")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, "La fecha de nacimiento no puede ser en el futuro")
    .refine((date) => {
      const age = calculateAge(date);
      return age >= 13;
    }, "Debes tener al menos 13 años para registrarte")
    .refine((date) => {
      const age = calculateAge(date);
      return age <= 100;
    }, "Por favor ingresa una fecha de nacimiento válida"),
  
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    errorMap: () => ({ message: "Por favor selecciona un género válido" })
  }),
  
  country: z.string()
    .length(2, "Por favor selecciona un país")
    .refine(
      (code) => VALID_COUNTRY_CODES.includes(code as any),
      "Por favor selecciona un país válido"
    ),
});

// Schema de login
export const loginSchema = z.object({
  email: z.string()
    .email("Por favor ingresa un email válido")
    .toLowerCase()
    .trim(),
  
  password: z.string()
    .min(1, "La contraseña es requerida"),
});

// Tipos inferidos
export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

// Tipos para países
export type CountryCode = typeof HISPANIC_COUNTRIES[number]["code"];
export type Country = typeof HISPANIC_COUNTRIES[number];