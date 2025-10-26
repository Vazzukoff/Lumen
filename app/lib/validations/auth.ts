import { z } from 'zod';

// Schema para registro
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres'),
  age: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Si es opcional y está vacío, es válido
      const num = parseInt(val);
      return !isNaN(num) && num >= 10 && num <= 100;
    }, 'La edad debe estar entre 10 y 100 años'),
  gender: z
    .string()
    .optional(),
  country: z
    .string()
    .optional(),
});

// Schema para login
export const loginSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'La contraseña es requerida'),
});

// Tipos TypeScript derivados de los schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;