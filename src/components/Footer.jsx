export const Footer = () => (
  <footer className="bg-hall-dark text-gray-400 py-10 mt-auto">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="font-serif text-hall-gold font-bold text-xl tracking-widest">HALL</p>
          <p className="text-xs text-gray-500 italic mt-1">Tu sala de estudio digital</p>
        </div>
        <div className="text-center text-xs text-gray-600 space-y-1">
          <p>Orientación · Campus · Biblioteca · Noticias</p>
          <p>© {new Date().getFullYear()} HALL. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  </footer>
)
