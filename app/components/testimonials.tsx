import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "María L.",
    testimonial: "Lumen me ayudó en momentos donde sentía que no tenía a nadie con quien hablar. Poder expresarme sin miedo al juicio fue liberador. Es como tener un amigo que siempre está ahí.",
  },
  {
    name: "Carlos R.",
    testimonial: "Antes de comenzar terapia, Lumen fue mi primer paso. Me ayudó a organizar mis pensamientos y sentirme menos solo. Ahora lo uso cuando necesito desahogarme fuera de mis sesiones.",
  },
  {
    name: "Ana S.",
    testimonial: "No esperaba sentirme tan comprendida por una IA. Lumen me escucha a cualquier hora, me hace las preguntas correctas y me ayuda a reflexionar. Es un apoyo invaluable.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background via-secondary/20 to-background select-none">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-foreground font-bold">
            Únete a ellos
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed font-light">
            Miles de personas han encontrado en Lumen un espacio seguro para expresarse y sentirse acompañadas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg shadow-primary/5 border border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 space-y-6 relative"
            >
              {/* Icono de comillas */}
              <div className="absolute top-6 right-6 opacity-40">
                <FaQuoteLeft className="w-12 h-12 text-(--blue)" />
              </div>

              {/* Testimonio */}
              <p className="text-foreground leading-relaxed font-light text-lg relative z-10">
                "{testimonial.testimonial}"
              </p>

              {/* Separador decorativo */}
              <div className="w-12 h-1 bg-(--mint) rounded-full"></div>

              {/* Nombre */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-(--blue) flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <p className="text-foreground font-semibold">
                  {testimonial.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}