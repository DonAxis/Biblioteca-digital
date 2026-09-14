export const Footer = () => (
  <footer className="bg-ub-navy text-gray-300 py-10 mt-auto">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="flex justify-center mb-4">
        <img src="/Biblioteca-digital/logo.png" alt="Universidades Bravo" className="h-14 w-auto opacity-90" />
      </div>
      <p className="font-serif text-lg font-semibold text-white mb-1">
        Biblioteca Digital — Universidades Bravo
      </p>
      <p className="text-sm text-ub-light">
        Acceso a recursos científicos y académicos para la comunidad universitaria.
      </p>
      <div className="border-t border-white/10 mt-6 pt-4">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Universidades Bravo. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
)
