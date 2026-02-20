import { IoClose } from 'react-icons/io5';
import { LuSparkles, LuMessageCircle, LuUser, LuBrain } from 'react-icons/lu';

interface PremiumPopupProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export default function PremiumPopup({ onClose, onUpgrade }: PremiumPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4 select-none">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex">
        
        {/* LADO IZQUIERDO - Imagen/Mensaje */}
        <div 
          className="hidden md:flex md:w-1/2 p-8 flex-col justify-between relative overflow-hidden" 
          style={{ background: 'linear-gradient(135deg, var(--blue) 0%, #4299e1 50%, #3182ce 100%)' }}
        >
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
              <LuSparkles className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-4xl font-bold text-white mb-8">Lumen Premium</h3>
            
            <h2 className="text-3xl font-bold text-white mb-6 leading-relaxed max-w-md">
              Desbloquea todo el potencial de tu bienestar
            </h2>
            
            <p className="text-white/90 text-lg max-w-sm">
              Lleva tu experiencia al siguiente nivel con acceso ilimitado y funciones exclusivas.
            </p>
          </div>
        </div>

        {/* LADO DERECHO - Contenido del plan */}
        <div className="w-full md:w-1/2 flex flex-col">
          {/* Header */}
          <div 
            className="px-6 py-4 text-white rounded-t-3xl" 
            style={{ backgroundColor: 'var(--blue)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <LuSparkles className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold">¡Has alcanzado tu límite! ✨</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-200 transition-colors cursor-pointer"
                aria-label="Cerrar"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs mt-1">
              Actualiza a Premium y disfruta de una experiencia sin límites.
            </p>
          </div>

          {/* Contenido */}
          <div className="px-6 py-5 flex-1 flex flex-col">
            {/* Badge del plan */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 self-start"
              style={{ backgroundColor: 'var(--lavender)', opacity: 0.15 }}
            >
              <LuSparkles className="w-4 h-4" style={{ color: 'var(--lavender)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--lavender)' }}>
                Plan Premium
              </span>
            </div>

            {/* Precio */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">S/ 19</span>
                <span className="text-gray-500 text-sm">/mes</span>
              </div>
            </div>

            {/* Beneficios */}
            <div className="space-y-4 mb-6 flex-1">
              <div className="flex items-start gap-3">
                <div 
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: 'var(--blue)', opacity: 0.7 }}
                >
                  <LuMessageCircle className="w-5 h-5" style={{ color: 'white' }} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Mensajes ilimitados</h4>
                  <p className="text-xs text-gray-600 mt-0.5">Conversa con Lumen sin restricciones</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div 
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: 'var(--blue)', opacity: 0.7 }}
                >
                  <LuUser className="w-5 h-5" style={{ color: 'white' }} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Trato personalizado</h4>
                  <p className="text-xs text-gray-600 mt-0.5">Respuestas adaptadas a tu información personal</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div 
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: 'var(--blue)', opacity: 0.7 }}
                >
                  <LuBrain className="w-5 h-5" style={{ color: 'white' }} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Memoria de conversaciones</h4>
                  <p className="text-xs text-gray-600 mt-0.5">Lumen recordará tus conversaciones pasadas</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div 
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: 'var(--blue)', opacity: 0.7 }}
                >
                  <LuBrain className="w-5 h-5" style={{ color: 'white' }} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Acceso a un modelo más inteligente</h4>
                  <p className="text-xs text-gray-600 mt-0.5">Lumen recordará tus conversaciones pasadas</p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="space-y-3">
              <button
                onClick={onUpgrade}
                className="w-full text-white py-2.5 rounded-lg text-sm font-medium 
                transition-all duration-200 cursor-pointer"
                style={{ backgroundColor: 'var(--blue)' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Actualizar a Premium
              </button>
              
              <button
                onClick={onClose}
                className="w-full text-gray-600 font-medium py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-sm cursor-pointer"
              >
                Tal vez después
              </button>
            </div>

            {/* Nota pequeña */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Cancela cuando quieras. Sin compromisos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}