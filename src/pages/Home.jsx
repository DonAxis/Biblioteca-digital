import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

const COLLABORATORS = [
  { name: 'Universidades Bravo', logo: '/Biblioteca-digital/logo.png' },
  // Agrega más instituciones aquí
]

export const Home = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/browse?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="bg-white">

      {/* Hero — estilo europepmc/redalyc */}
      <section className="bg-hall-navy py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-hall-gold text-sm font-medium tracking-widest uppercase mb-3">
            Repositorio Científico Universitario
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
            HALL
          </h1>
          <p className="text-gray-300 text-base mb-10 leading-relaxed max-w-xl mx-auto">
            Acceso abierto a artículos científicos, tesis, revistas y documentos académicos
            de múltiples instituciones universitarias.
          </p>

          {/* Barra de búsqueda prominente */}
          <form onSubmit={handleSearch} className="flex gap-0 max-w-2xl mx-auto shadow-xl rounded-lg overflow-hidden">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar por título, autor, palabras clave..."
              className="flex-1 px-5 py-4 text-gray-800 text-base focus:outline-none"
            />
            <button
              type="submit"
              className="bg-hall-gold text-hall-navy px-7 py-4 font-bold text-base hover:brightness-110 transition-all whitespace-nowrap"
            >
              Buscar
            </button>
          </form>

          <p className="text-gray-500 text-xs mt-4">
            También puedes{' '}
            <button
              onClick={() => navigate('/browse')}
              className="text-hall-gold hover:underline"
            >
              explorar todos los documentos
            </button>
          </p>
        </div>
      </section>

      {/* Franja dorada separadora */}
      <div className="h-1 bg-hall-gold" />

      {/* Áreas del conocimiento */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-xl font-serif font-bold text-hall-navy mb-1 text-center">
          Explorar por área del conocimiento
        </h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          Selecciona una disciplina para ver todos los documentos disponibles
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {SECTIONS.map(sec => (
            <button
              key={sec.id}
              onClick={() => navigate(`/browse?section=${sec.id}`)}
              className="group border border-gray-200 rounded-lg p-5 text-left hover:border-hall-gold hover:shadow-md transition-all bg-white"
            >
              <span className="text-2xl mb-2 block">{SECTION_ICONS[sec.id] ?? '📁'}</span>
              <p className="text-sm font-semibold text-hall-navy group-hover:text-hall-gold transition-colors leading-snug">
                {sec.label}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Instituciones colaboradoras */}
      <section className="border-t border-gray-100 bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-8">
            Instituciones colaboradoras
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {COLLABORATORS.map(inst => (
              <div key={inst.name} className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                <img src={inst.logo} alt={inst.name} className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
                <p className="text-xs text-gray-500 font-medium">{inst.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pie informativo */}
      <section className="bg-hall-cream border-t border-gray-200 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-serif font-bold text-hall-navy">∞</p>
            <p className="text-sm text-gray-500 mt-1">Acceso abierto</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-hall-navy">8</p>
            <p className="text-sm text-gray-500 mt-1">Áreas del conocimiento</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-hall-navy">UB</p>
            <p className="text-sm text-gray-500 mt-1">Institución fundadora</p>
          </div>
        </div>
      </section>

    </div>
  )
}
