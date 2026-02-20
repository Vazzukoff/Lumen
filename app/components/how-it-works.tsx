import { FaRegMessage, FaHandshake,  } from "react-icons/fa6";
import { IoSparklesOutline } from "react-icons/io5";

const steps = [
  {
    icon: FaRegMessage,
    step: '1',
    title: 'Inicia la conversación',
    description: 'Haz clic en el botón y comienza a escribir. No necesitas registrarte ni dar información personal.',
  },
  {
    icon: FaHandshake,
    step: '2',
    title: 'Cuenta cómo te sientes',
    description: 'Comparte lo que está pasando por tu mente. Sin prisa, sin presión, sin juicios.',
  },
  {
    icon: IoSparklesOutline,
    step: '3',
    title: 'Recibe apoyo empático',
    description: 'Obtén respuestas comprensivas, técnicas de calma y herramientas para gestionar tus emociones.',
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 px-6 bg-white select-none">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--foreground)', fontWeight: '700' }}>
            ¿Cómo funciona?
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--muted-foreground)' }}>
            Hablar con Lumen es fácil, rápido y confidencial”
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Línea conectora (solo visible en desktop) */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-[var(--lavender)] via-[var(--mint)] to-[var(--lavender)]" style={{ top: '4rem' }}></div>
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative flex flex-col items-center text-center space-y-4 p-6"
              >
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center bg-white shadow-lg border-4 z-10 relative"
                    style={{ borderColor: 'var(--lavender)' }}
                  >
                    <Icon className="w-9 h-9" style={{ color: 'var(--lavender)' }} />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white z-20"
                    style={{ backgroundColor: 'var(--lavender)', fontSize: '0.875rem', fontWeight: '700' }}
                  >
                    {step.step}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--foreground)' }}>
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
