'use client';

import { useState, useEffect } from 'react';

// Declarar Culqi como global
declare global {
  interface Window {
    Culqi: any;
  }
}

interface PaymentFormProps {
  amount: number; // Monto en centavos (ej: 5000 = 50.00 soles)
  description: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export default function CulqiPaymentForm({ 
  amount, 
  description,
  onSuccess,
  onError 
}: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expirationMonth, setExpirationMonth] = useState('');
  const [expirationYear, setExpirationYear] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Cargar el script de Culqi
    const script = document.createElement('script');
    script.src = 'https://checkout.culqi.com/js/v4';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Configurar Culqi con tu llave pública
      window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY || 'TU_LLAVE_PUBLICA';
      
      // Configurar opciones
      window.Culqi.options({
        lang: 'es',
        modal: false, // Usaremos nuestro propio formulario
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Función que se ejecuta cuando Culqi genera el token
  useEffect(() => {
    window.culqi = function() {
      if (window.Culqi.token) {
        const token = window.Culqi.token.id;
        // Enviar el token al backend
        processPayment(token);
      } else if (window.Culqi.error) {
        setLoading(false);
        console.error('Error de Culqi:', window.Culqi.error);
        onError?.(window.Culqi.error);
        alert('Error al procesar la tarjeta: ' + window.Culqi.error.user_message);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones básicas
    if (!cardNumber || !cvv || !expirationMonth || !expirationYear || !email) {
      alert('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    // Configurar los datos para Culqi
    const settings = {
      title: 'Tienda Demo',
      currency: 'PEN',
      amount: amount,
      order: 'ord-' + Date.now(), // ID único de orden
    };

    window.Culqi.settings(settings);

    // Crear el token con los datos de la tarjeta
    window.Culqi.createToken();
  };

  const processPayment = async (token: string) => {
    try {
      const response = await fetch('/api/culqi/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          amount,
          email,
          description,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('¡Pago exitoso!');
        onSuccess?.(data);
        // Limpiar formulario
        setCardNumber('');
        setCvv('');
        setExpirationMonth('');
        setExpirationYear('');
        setEmail('');
      } else {
        alert('Error al procesar el pago: ' + (data.error || 'Error desconocido'));
        onError?.(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Pago Seguro</h2>
      
      <div className="mb-4 p-4 bg-blue-50 rounded">
        <p className="text-gray-700">
          <strong>Monto a pagar:</strong> S/ {(amount / 100).toFixed(2)}
        </p>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tu@email.com"
            required
            data-culqi="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de tarjeta
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="4111 1111 1111 1111"
            maxLength={16}
            required
            data-culqi="card[number]"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mes
            </label>
            <input
              type="text"
              value={expirationMonth}
              onChange={(e) => setExpirationMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12"
              maxLength={2}
              required
              data-culqi="card[exp_month]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año
            </label>
            <input
              type="text"
              value={expirationYear}
              onChange={(e) => setExpirationYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2025"
              maxLength={4}
              required
              data-culqi="card[exp_year]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123"
              maxLength={4}
              required
              data-culqi="card[cvv]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Procesando...' : `Pagar S/ ${(amount / 100).toFixed(2)}`}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔒 Pago seguro procesado por Culqi
        </p>
      </div>
    </div>
  );
}