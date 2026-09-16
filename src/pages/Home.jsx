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
  { name: 'Universidades Bravo', logo: '/logo.png' },
  { name: 'Instituto Leonardo Bravo', logo: '/ilblogo.png' },
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
            HALL Educación Digital
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

      {/* Plataformas HALL */}
      <section className="bg-hall-navy py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-hall-gold text-xs font-semibold uppercase tracking-widest mb-2">
            Ecosistema HALL Educación Digital
          </p>
          <h2 className="text-white font-serif text-xl font-bold mb-8">
            Más plataformas disponibles
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 border border-hall-gold/30 rounded-xl p-6 w-64 text-left hover:bg-white/15 transition-all">
              <p className="text-hall-gold font-bold text-lg mb-1">📚 Biblioteca Digital</p>
              <p className="text-gray-300 text-sm mb-3">
                Repositorio científico — artículos, tesis, revistas y documentos académicos.
              </p>
              <span className="text-xs text-hall-gold/70">Estás aquí</span>
            </div>
            <a
              href="https://donaxis.github.io/NotiWeb/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 border border-white/20 rounded-xl p-6 w-64 text-left hover:bg-white/15 hover:border-hall-gold/30 transition-all group"
            >
              <p className="text-white font-bold text-lg mb-1 group-hover:text-hall-gold transition-colors">📰 NotiWeb</p>
              <p className="text-gray-300 text-sm mb-3">
                Portal de noticias y actualidad del ecosistema HALL.
              </p>
              <span className="text-xs text-hall-gold flex items-center gap-1">
                Visitar →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Instituciones colaboradoras — estilo europepmc */}
      <section className="border-t border-gray-200 bg-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gray-200" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
              Instituciones colaboradoras
            </p>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {COLLABORATORS.map(inst => (
              <div
                key={inst.name}
                className="flex flex-col items-center gap-2 group cursor-default"
                title={inst.name}
              >
                <img
                  src={inst.logo}
                  alt={inst.name}
                  className="h-14 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
                <p className="text-[11px] text-gray-400 group-hover:text-gray-600 transition-colors font-medium">
                  {inst.name}
                </p>
              </div>
            ))}
            {/* Placeholder para más instituciones */}
            <div className="flex flex-col items-center gap-2 opacity-30">
              <div className="h-14 w-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <span className="text-gray-400 text-xs">+ Próxima</span>
              </div>
            </div>
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
