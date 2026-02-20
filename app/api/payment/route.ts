// app/api/culqi/charge/route.ts
import { NextRequest, NextResponse } from 'next/server';

const CULQI_SECRET_KEY = process.env.CULQI_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, amount, email, description } = body;

    // Validaciones
    if (!token || !amount || !email) {
      return NextResponse.json(
        { success: false, error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    // Crear el cargo en Culqi
    const chargeResponse = await fetch('https://api.culqi.com/v2/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CULQI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency_code: 'PEN',
        email: email,
        source_id: token,
        description: description || 'Pago mensual',
        metadata: {
          order_id: 'ord-' + Date.now(),
          payment_date: new Date().toISOString(),
        }
      }),
    });

    const chargeData = await chargeResponse.json();

    if (chargeResponse.ok && chargeData.object === 'charge') {
      // Pago exitoso
      console.log('Pago exitoso:', chargeData.id);

      // Aquí puedes:
      // 1. Guardar el pago en tu base de datos
      // 2. Activar el servicio del usuario
      // 3. Enviar email de confirmación
      // 4. Registrar en logs

      return NextResponse.json({
        success: true,
        charge_id: chargeData.id,
        amount: chargeData.amount,
        email: chargeData.email,
        status: chargeData.outcome.type,
        message: 'Pago procesado exitosamente'
      });

    } else {
      // Error en el pago
      console.error('Error en Culqi:', chargeData);
      
      return NextResponse.json({
        success: false,
        error: chargeData.user_message || chargeData.merchant_message || 'Error al procesar el pago'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error en el servidor:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Si estás usando Pages Router en lugar de App Router, usa este formato:
// 
// import type { NextApiRequest, NextApiResponse } from 'next';
//
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Método no permitido' });
//   }
//
//   // ... resto del código igual
// }