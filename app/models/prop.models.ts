export interface AuthFormProps {
  title: string;
  buttonText: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
  formData: {
    email: string;
    password: string;
    name?: string;        // Para registro
    age?: string;         // Para registro (opcional)
    gender?: string;      // Para registro (opcional)
    country?: string;     // Para registro (opcional)
  };
  fieldErrors: {
    email?: string;
    password?: string;
    name?: string;
    age?: string;
    gender?: string;
    country?: string;
  };
  error?: string;
  success?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isRegister?: boolean;
}