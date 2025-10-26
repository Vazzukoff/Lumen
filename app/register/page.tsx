"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/UI/auth.form';
import { registerSchema } from '@/lib/validations/auth';
import { z } from 'zod';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    country: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      // Validar con Zod
      const validatedData = registerSchema.parse(formData);

      // Llamar a la API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al registrar usuario');
        setIsSubmitting(false);
        return;
      }

      setSuccess('¡Registro exitoso! Redirigiendo al login...');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Mapear errores de Zod a fieldErrors
        const errors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            errors[error.path[0] as string] = error.message;
          }
        });
        setFieldErrors(errors);
      } else {
        setError('Error de conexión. Intenta de nuevo.');
        console.error(err);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      title="Crear cuenta"
      buttonText={isSubmitting ? "Registrando..." : "Registrarse"}
      footerText="¿Ya tienes cuenta?"
      footerLinkText="Inicia sesión"
      footerLinkTo="/"
      formData={formData}
      fieldErrors={fieldErrors}
      error={error}
      success={success}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isRegister={true}
    />
  );
}