'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/UI/auth.form';
import { loginSchema } from '@/lib/validations/auth';
import { z } from 'zod';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = loginSchema.parse(formData);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        setIsSubmitting(false);
        return;
      }

      setSuccess('¡Login exitoso! Redirigiendo...');
      setTimeout(() => router.push('/home'), 1500);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const flattened = err.flatten();
        const errors: Record<string, string> = {};

        const fieldErrors = flattened.fieldErrors as Record<string, string[]>; // ✅ cast

        for (const key in fieldErrors) {
          if (fieldErrors[key] && fieldErrors[key].length > 0) {
            errors[key] = fieldErrors[key][0];
          }
        }

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
      title="Iniciar sesión"
      buttonText={isSubmitting ? 'Ingresando...' : 'Ingresar'}
      footerText="¿No tienes cuenta?"
      footerLinkText="Regístrate"
      footerLinkTo="/register"
      formData={formData}
      fieldErrors={fieldErrors}
      error={error}
      success={success}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isRegister={false}
    />
  );
}