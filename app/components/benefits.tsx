import { FaClock, FaShieldAlt, FaHeart, FaDollarSign } from "react-icons/fa";

const benefits = [
  {
    icon: FaClock,
    title: 'Disponible 24/7',
    description: 'Siempre aquí cuando lo necesites, día y noche.',
    color: 'var(--lavender)',
  },
  {
    icon: FaShieldAlt,
    title: 'Anónimo y confidencial',
    description: 'Tus conversaciones son privadas y seguras. Nadie más tiene acceso a lo que compartes.',
    color: 'var(--sky-blue)',
  },
  {
    icon: FaHeart,
    title: 'Empatía real',
    description: 'Diseñado para comprenderte y apoyarte',
    color: 'var(--mint)',
  },
  {
    icon: FaDollarSign,
    title: 'Gratis y accesible',
    description: 'Ayuda emocional al alcance de todos, sin barreras.',
    color: 'var(--lavender)',
  },
];

export default function Benefits() {
  return (
    <section id="beneficios" className="py-24 px-6 bg-gradient-to-b from-background via-secondary/20 to-background select-none">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-foreground font-bold">
            ¿Qué es Lumen?
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed font-light">
            Lumen es un chatbot con inteligencia artificial diseñado para ofrecer apoyo emocional. 
            Queremos brindarte un espacio confidencial y disponible siempre, 
            donde puedas expresarte libremente, procesar tus emociones y sentirte comprendido.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-5 p-8 rounded-3xl hover:bg-(--light-blue) transition-all duration-300 border-2 border-(--blue) hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 group"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300"
                  style={{ backgroundColor: `${benefit.color}20` }}
                >
                  <Icon className="w-7 h-7" style={{ color: benefit.color }} />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-light">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}