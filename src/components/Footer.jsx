export const Footer = () => (
  <footer className="bg-primary-900 text-gray-300 py-8 mt-auto">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p className="font-serif text-lg font-semibold text-white mb-1">
        Biblioteca Digital Universitaria
      </p>
      <p className="text-sm">
        Acceso a recursos científicos y académicos para la comunidad universitaria.
      </p>
      <p className="text-xs text-gray-500 mt-4">
        © {new Date().getFullYear()} Universidad. Todos los derechos reservados.
      </p>
    </div>
  </footer>
)
