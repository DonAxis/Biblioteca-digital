export const Footer = () => (
  <footer className="bg-hall-dark text-gray-400 py-10 mt-auto">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="font-serif text-hall-gold font-bold text-xl">HALL Educación Digital</p>
          <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">Biblioteca Digital</p>
        </div>
        <div className="text-center text-xs text-gray-600 space-y-1">
          <p>Plataforma de acceso abierto a recursos científicos y académicos.</p>
          <p>© {new Date().getFullYear()} HALL Educación Digital. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  </footer>
)
