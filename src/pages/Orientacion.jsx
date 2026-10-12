import { useState, useMemo } from 'react'
import { CareerRadar, AREA_LABELS } from '../components/CareerRadar'
import { AreaFilter } from '../components/AreaFilter'
import careers from '../data/careers.json'

const calcCompatibilidad = (career, avoidAreas) => {
  if (avoidAreas.length === 0) return { nivel: 'neutral', label: null }

  const conflicts = avoidAreas
    .map(key => ({ key, score: career.areas[key] ?? 0 }))
    .filter(c => c.score >= 5)
    .sort((a, b) => b.score - a.score)

  if (conflicts.length === 0) return { nivel: 'verde', label: 'Compatible' }

  const top = conflicts[0]
  if (top.score >= 7) return { nivel: 'rojo',     label: `alto en ${AREA_LABELS[top.key]}` }
  return                       { nivel: 'amarillo', label: `tiene poco ${AREA_LABELS[top.key]}` }
}

const NIVEL_ORDER = { verde: 0, neutral: 1, amarillo: 2, rojo: 3 }

const BADGE = {
  verde:    'bg-green-100 text-green-800 border-green-300',
  amarillo: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  rojo:     'bg-red-100 text-red-800 border-red-300',
  neutral:  '',
}

const CARD_BORDER = {
  verde:    'border-green-300 shadow-green-100',
  amarillo: 'border-yellow-300 shadow-yellow-100',
  rojo:     'border-red-300 shadow-red-100',
  neutral:  'border-gray-200',
}

const CareerCard = ({ career, avoidAreas }) => {
  const compat = calcCompatibilidad(career, avoidAreas)

  return (
    <div className={`bg-white rounded-xl border-2 p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 ${CARD_BORDER[compat.nivel]}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif font-bold text-hall-navy text-sm leading-snug flex-1">
          {career.nombre}
        </h3>
        {compat.label && (
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap flex-shrink-0 ${BADGE[compat.nivel]}`}>
            {compat.label}
          </span>
        )}
      </div>

      <p className="text-xs text-gray-400">
        {career.periodos} {career.tipoPeriodo}s · {career.institucion}
      </p>

      <CareerRadar areas={career.areas} avoidAreas={avoidAreas} size="sm" />
    </div>
  )
}

export const Orientacion = () => {
  const [avoidAreas, setAvoidAreas] = useState([])

  const sorted = useMemo(() => {
    return [...careers]
      .map(c => ({ ...c, _nivel: calcCompatibilidad(c, avoidAreas).nivel }))
      .sort((a, b) => NIVEL_ORDER[a._nivel] - NIVEL_ORDER[b._nivel])
  }, [avoidAreas])

  const verdes   = sorted.filter(c => c._nivel === 'verde').length
  const rojos    = sorted.filter(c => c._nivel === 'rojo').length

  return (
    <div className="bg-hall-cream min-h-screen">

      {/* Hero */}
      <section className="bg-hall-navy py-12 px-4 text-center">
        <p className="text-hall-gold text-xs font-medium tracking-widest uppercase mb-3">
          Orientación Vocacional
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
          Elige tu carrera con confianza
        </h1>
        <p className="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed">
          Marca las áreas que prefieres evitar y ve cómo encajan las carreras del Instituto Leonardo Bravo.
          El radar muestra el peso real de cada área en el plan de estudios.
        </p>
      </section>

      {/* Filtros — sticky */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <AreaFilter avoidAreas={avoidAreas} onChange={setAvoidAreas} />
        </div>
      </div>

      {/* Resultados */}
      <section className="max-w-6xl mx-auto px-4 py-8">

        {/* Resumen */}
        {avoidAreas.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-3 text-sm">
            {verdes > 0 && (
              <span className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {verdes} carrera{verdes > 1 ? 's' : ''} compatible{verdes > 1 ? 's' : ''}
              </span>
            )}
            {rojos > 0 && (
              <span className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {rojos} con alto nivel en áreas evitadas
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map(career => (
            <CareerCard key={career.id} career={career} avoidAreas={avoidAreas} />
          ))}
        </div>

        {/* Nota al pie */}
        <p className="mt-10 text-xs text-gray-400 text-center max-w-lg mx-auto leading-relaxed">
          Los scores son estimaciones basadas en el plan de estudios oficial.
          La gráfica en rojo señala las áreas que marcaste como a evitar.
          Usa esto como apoyo, no como decisión final.
        </p>
      </section>
    </div>
  )
}
