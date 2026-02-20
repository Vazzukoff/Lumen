import { FaHeart } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border py-12 px-6 select-none">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--lavender)] to-[var(--mint)] flex items-center justify-center">
              <FaHeart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-[var(--lavender)]" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              Lumen
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Acerca de
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacidad
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Términos
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contacto
            </a>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2025 Lumen. Hecho con{' '}
            <FaHeart className="inline w-4 h-4 mx-1" style={{ color: 'var(--lavender)' }} fill="var(--lavender)" />
            para ti.
          </p>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            <strong>Aviso importante:</strong> Lumen es una herramienta de apoyo emocional y no sustituye la atención de un profesional de la salud mental. Si estás experimentando una crisis o pensamientos de autolesión, por favor contacta inmediatamente con servicios de emergencia o líneas de ayuda profesional.
          </p>
        </div>
      </div>
    </footer>
  );
}
