import { Link } from 'react-router-dom'

// Orden = el camino del estudiante: ¿qué estudiar? → aprende → investiga → entérate
// `span` define el ancho en la rejilla de 12 columnas (escritorio).
const PLATAFORMAS = [
  {
    id: 'orientacion',
    num: '01',
    nombre: 'Orientación',
    pregunta: '¿Qué estudiar?',
    descripcion: 'Descubre qué carreras encajan contigo según las áreas que te gustan y las que prefieres evitar.',
    cta: 'Hacer el test',
    to: '/orientacion',
    span: 'lg:col-span-4',
  },
  {
    id: 'campus',
    num: '02',
    nombre: 'Campus',
    pregunta: 'Aprende y certifícate',
    descripcion: 'Cursos con video, ejercicios y certificado HALL. Aprende a tu ritmo y demuestra lo que sabes.',
    cta: 'Ir a Campus',
    href: 'https://campus.digitalhall.com.mx',
    span: 'lg:col-span-8',
    destacado: true,
  },
  {
    id: 'biblioteca',
    num: '03',
    nombre: 'Biblioteca',
    pregunta: 'Consulta e investiga',
    descripcion: 'Artículos, tesis, revistas y documentos académicos de acceso abierto.',
    cta: 'Entrar a la biblioteca',
    to: '/biblioteca',
    span: 'lg:col-span-6',
  },
  {
    id: 'noticias',
    num: '04',
    nombre: 'Noticias',
    pregunta: 'NotiWeb',
    descripcion: 'Noticias y actualidad del ecosistema HALL.',
    cta: 'Leer noticias',
    href: 'https://donaxis.github.io/NotiWeb/',
    span: 'lg:col-span-6',
  },
]

const Celda = ({ p }) => {
  const contenido = (
    <>
      <div className="flex items-start justify-between mb-10">
        <span className="font-display text-3xl text-hall-gold leading-none">{p.num}</span>
        {p.destacado && (
          <span className="bg-hall-gold text-hall-navy font-inter text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
            Nuevo
          </span>
        )}
      </div>

      <p className="font-inter text-xs font-medium uppercase tracking-[0.2em] text-hall-navy/50 mb-2">
        {p.pregunta}
      </p>
      <h2 className={`font-display text-hall-navy leading-none mb-5 ${p.destacado ? 'text-6xl md:text-7xl' : 'text-5xl'}`}>
        {p.nombre}
      </h2>
      <p className={`font-inter text-hall-navy/70 leading-relaxed mb-8 flex-1 ${p.destacado ? 'text-base max-w-md' : 'text-sm max-w-sm'}`}>
        {p.descripcion}
      </p>

      <span className="font-inter text-sm font-semibold text-hall-navy underline decoration-hall-gold/50 decoration-1 underline-offset-[6px] group-hover:decoration-hall-gold group-hover:decoration-2 transition-all">
        {p.cta}
      </span>
    </>
  )

  const clases = `group flex flex-col p-8 md:p-10 transition-colors ${p.span} ${
    p.destacado ? 'bg-[#efe4cc] hover:bg-[#ebdfc3]' : 'bg-hall-cream hover:bg-[#f1ebdf]'
  }`

  return p.href ? (
    <a href={p.href} target="_blank" rel="noopener noreferrer" className={clases}>{contenido}</a>
  ) : (
    <Link to={p.to} className={clases}>{contenido}</Link>
  )
}

export const Home = () => (
  <div className="bg-hall-cream">

    {/* Bloque superior — editorial, alineado a la izquierda */}
    <section className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="flex items-center gap-3 mb-10">
        <img src="/logoHall.png" alt="" className="h-10 w-auto" />
        <span className="font-inter text-xs font-medium uppercase tracking-[0.25em] text-hall-navy/50">
          digitalhall.com.mx
        </span>
      </div>

      <h1 className="font-display text-hall-navy leading-[0.85] text-[6rem] md:text-[10rem] lg:text-[12rem]">
        HALL
      </h1>
      <p className="font-display italic text-hall-gold text-4xl md:text-6xl mt-2">
        Tu sala de estudio digital
      </p>
      <p className="font-inter text-hall-navy/70 text-base md:text-lg leading-relaxed mt-10 max-w-xl">
        Descubre qué estudiar, aprende con cursos certificados y consulta
        documentos académicos, todo en un mismo lugar.
      </p>
    </section>

    {/* Cuadrícula abierta — las líneas de 1px salen del gap sobre fondo azul tenue */}
    <section className="border-t border-hall-navy/15">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-hall-navy/15 border-x border-hall-navy/15">
          {PLATAFORMAS.map(p => <Celda key={p.id} p={p} />)}
        </div>
      </div>
    </section>

    <div className="border-t border-hall-navy/15 h-20" />

  </div>
)
