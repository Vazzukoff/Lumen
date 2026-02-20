import { FaCheckCircle, FaInfoCircle } from "react-icons/fa";

const sharedFeatures = [
  'Exploración profunda de emociones',
  'Tratamiento personalizado',
  'Acompañamiento emocional',
  'Espacio confidencial y seguro',
];

const lumenExclusiveFeatures = [
  'Disponible 24/7',
  'Respuesta inmediata',
  'Sin citas ni esperas',
  'Accesible desde cualquier lugar',
  'Completamente gratuito',
];

export default function Comparison() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background via-secondary/20 to-background select-none">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20 space-y-6 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-foreground font-bold">
            Terapia tradicional y Lumen
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed font-light">
            Dos formas distintas, un mismo propósito: cuidar de ti
          </p>
        </div>

        {/* Tabla comparativa */}
        <div className="bg-white rounded-3xl shadow-xl shadow-primary/5 border border-(--blue) overflow-hidden mb-8">
          {/* Header */}
          <div className="grid grid-cols-3 bg-secondary/30 border-b border-border">
            <div className="p-6"></div>
            <div className="p-6 text-center border-x border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Terapia tradicional
              </h3>
            </div>
            <div className="p-6 text-center bg-gradient-to-br from-(--blue)/10 to-[var(--mint)]/10">
              <h3 className="text-lg font-semibold text-(--blue)">
                Lumen
              </h3>
            </div>
          </div>

          {/* Beneficios compartidos */}
          {sharedFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="grid grid-cols-3 border-b border-border/50 hover:bg-secondary/20 transition-colors duration-200"
            >
              <div className="p-5 flex items-center">
                <span className="text-foreground font-medium">{feature}</span>
              </div>
              <div className="p-5 flex items-center justify-center border-x border-border/50">
                <FaCheckCircle className="w-6 h-6 text-(--blue)" />
              </div>
              <div className="p-5 flex items-center justify-center bg-gradient-to-br from-(--blue)/5 to-[var(--mint)]/5">
                <FaCheckCircle className="w-6 h-6 text-(--blue)" />
              </div>
            </div>
          ))}

          {/* Beneficios exclusivos de Lumen */}
          {lumenExclusiveFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="grid grid-cols-3 border-b border-border/50 last:border-b-0 hover:bg-secondary/20 transition-colors duration-200"
            >
              <div className="p-5 flex items-center">
                <span className="text-foreground font-medium">{feature}</span>
              </div>
              <div className="p-5 flex items-center justify-center border-x border-border/50">
                <span className="text-muted-foreground text-sm">—</span>
              </div>
              <div className="p-5 flex items-center justify-center bg-gradient-to-br from-(--blue)/5 to-[var(--mint)]/5">
                <FaCheckCircle className="w-6 h-6 text-(--blue)" />
              </div>
            </div>
          ))}
        </div>

        {/* Nota importante */}
        <div className="bg-white border-2 border-primary/30 rounded-2xl p-6 flex items-start gap-4 shadow-md">
          <FaInfoCircle className="w-6 h-6 flex-shrink-0 mt-0.5 text-[var(--lavender)]" />
          <div className="space-y-2">
            <p className="font-semibold text-foreground text-lg">
              Importante:
            </p>
            <p className="text-muted-foreground leading-relaxed font-light">
              Lumen no reemplaza la terapia profesional. Es un punto de apoyo inmediato, gratuito y confidencial para quienes necesitan contención emocional mientras inician o complementan un proceso terapéutico.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}