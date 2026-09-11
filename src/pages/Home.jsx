import { useNavigate } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar'
import { SECTIONS } from '../constants'

const SECTION_ICONS = {
  'ciencias-basicas':      '⚗️',
  'ingenieria-tecnologia': '⚙️',
  'ciencias-salud':        '🩺',
  'ciencias-sociales':     '🌐',
  'humanidades':           '📜',
  'computacion-ti':        '💻',
  'tesis-grado':           '🎓',
  'revistas-articulos':    '📄',
}

export const Home = () => {
  const navigate = useNavigate()

  const handleSearch = (query) => {
    if (query) navigate(`/browse?q=${encodeURIComponent(query)}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
            Repositorio Científico Universitario
          </h1>
          <p className="text-lg text-blue-200 mb-10 leading-relaxed">
            Accede a artículos, tesis, revistas y documentos académicos de todas las áreas del conocimiento.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Sections grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2 text-center">
          Explorar por área del conocimiento
        </h2>
        <p className="text-gray-500 text-center mb-10 text-sm">
          Selecciona una disciplina para ver todos los documentos disponibles
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECTIONS.map(sec => (
            <button
              key={sec.id}
              onClick={() => navigate(`/browse?section=${sec.id}`)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 hover:bg-primary-50 transition-all group p-6 text-left"
            >
              <span className="text-3xl mb-3 block">{SECTION_ICONS[sec.id] ?? '📁'}</span>
              <h3 className="font-semibold text-gray-800 group-hover:text-primary-700 transition-colors text-sm leading-snug">
                {sec.label}
              </h3>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 border-t border-gray-200 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-serif font-semibold text-gray-800 mb-3">
            ¿Buscas algo específico?
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Usa nuestro explorador avanzado para filtrar por área, año o palabras clave.
          </p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-primary-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-800 transition-colors"
          >
            Ver todos los documentos
          </button>
        </div>
      </section>
    </div>
  )
}
