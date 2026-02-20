import { FaLock, FaEye, FaShield } from "react-icons/fa6";

export default function Privacy() {
  return (
    <section id="privacidad" className="py-20 px-6 bg-gradient-to-br from-white to-[var(--lavender-light)] select-none">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="flex items-center justify-center mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--lavender)' }}
            >
              <FaLock className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-center mb-6" style={{ fontSize: '2.5rem', color: 'var(--foreground)', fontWeight: '700' }}>
            Tu privacidad es nuestra prioridad
          </h2>
          
          <p className="text-center mb-12" style={{ fontSize: '1.125rem', color: 'var(--muted-foreground)' }}>
            Tus datos son confidenciales. Tus conversaciones no se comparten.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--lavender-light)' }}
              >
                <FaShield className="w-7 h-7" style={{ color: 'var(--lavender)' }} />
              </div>
              <h4 style={{ fontWeight: '600', color: 'var(--foreground)' }}>
                Encriptación segura
              </h4>
              <p className="text-sm text-muted-foreground">
                Todas las conversaciones están protegidas con cifrado de extremo a extremo.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--mint)20' }}
              >
                <FaEye className="w-7 h-7" style={{ color: 'var(--mint)' }} />
              </div>
              <h4 style={{ fontWeight: '600', color: 'var(--foreground)' }}>
                Anonimato total
              </h4>
              <p className="text-sm text-muted-foreground">
                No necesitas registrarte ni proporcionar datos personales.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--sky-blue)20' }}
              >
                <FaLock className="w-7 h-7" style={{ color: 'var(--sky-blue)' }} />
              </div>
              <h4 style={{ fontWeight: '600', color: 'var(--foreground)' }}>
                Sin compartir datos
              </h4>
              <p className="text-sm text-muted-foreground">
                Tu información nunca se vende ni se comparte con terceros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
