import { Link } from 'react-router-dom'

// Orden = el camino del estudiante: ¿qué estudiar? → aprende → investiga → entérate
const PLATAFORMAS = [
  {
    id: 'orientacion',
    icon: '🧭',
    nombre: 'Orientación',
    pregunta: '¿Qué estudiar?',
    descripcion: 'Descubre qué carreras encajan contigo según las áreas que te gustan y las que prefieres evitar.',
    cta: 'Hacer el test',
    to: '/orientacion',
  },
  {
    id: 'campus',
    icon: '🎓',
    nombre: 'Campus',
    pregunta: 'Aprende y certifícate',
    descripcion: 'Cursos con video, ejercicios y certificado HALL. Aprende a tu ritmo y demuestra lo que sabes.',
    cta: 'Ir a Campus',
    href: 'https://campus.digitalhall.com.mx',
    destacado: true,
  },
  {
    id: 'biblioteca',
    icon: '📚',
    nombre: 'Biblioteca',
    pregunta: 'Consulta e investiga',
    descripcion: 'Artículos, tesis, revistas y documentos académicos de acceso abierto.',
    cta: 'Entrar a la biblioteca',
    to: '/biblioteca',
  },
  {
    id: 'noticias',
    icon: '📰',
    nombre: 'Noticias',
    pregunta: 'NotiWeb',
    descripcion: 'Noticias y actualidad del ecosistema HALL.',
    cta: 'Leer noticias',
    href: 'https://donaxis.github.io/NotiWeb/',
  },
]

const Tarjeta = ({ p }) => {
  const base = p.destacado
    ? 'bg-hall-gold text-hall-navy border-hall-gold shadow-xl md:-translate-y-2'
    : 'bg-white text-hall-navy border-gray-200 hover:border-hall-gold hover:shadow-lg'

  const contenido = (
    <>
      {p.destacado && (
        <span className="absolute -top-3 left-6 bg-hall-navy text-hall-gold text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          Nuevo
        </span>
      )}
      <span className="text-4xl block mb-4">{p.icon}</span>
      <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${p.destacado ? 'text-hall-navy/70' : 'text-hall-gold'}`}>
        {p.pregunta}
      </p>
      <h3 className="text-2xl font-serif font-bold mb-3">{p.nombre}</h3>
      <p className={`text-sm leading-relaxed mb-6 flex-1 ${p.destacado ? 'text-hall-navy/80' : 'text-gray-500'}`}>
        {p.descripcion}
      </p>
      <span className={`text-sm font-semibold ${p.destacado ? '' : 'group-hover:text-hall-gold transition-colors'}`}>
        {p.cta} {p.href ? '↗' : '→'}
      </span>
    </>
  )

  const clases = `group relative flex flex-col border rounded-2xl p-7 transition-all ${base}`

  return p.href ? (
    <a href={p.href} target="_blank" rel="noopener noreferrer" className={clases}>{contenido}</a>
  ) : (
    <Link to={p.to} className={clases}>{contenido}</Link>
  )
}

export const Home = () => (
  <div className="bg-white">

    {/* Hero — la puerta */}
    <section className="bg-hall-navy py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <img src="/logoHall.png" alt="HALL" className="h-24 w-auto mx-auto mb-6" />
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4 tracking-wide">
          HALL
        </h1>
        <p className="text-hall-gold text-lg md:text-xl font-serif italic">
          Tu sala de estudio digital
        </p>
        <p className="text-gray-300 text-base mt-6 leading-relaxed max-w-xl mx-auto">
          Descubre qué estudiar, aprende con cursos certificados y consulta
          documentos académicos, todo en un mismo lugar.
        </p>
      </div>
    </section>

    <div className="h-1 bg-hall-gold" />

    {/* Las 4 plataformas */}
    <section className="bg-hall-cream py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLATAFORMAS.map(p => <Tarjeta key={p.id} p={p} />)}
      </div>
    </section>

  </div>
)
