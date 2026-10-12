import { useState, useMemo } from 'react'
import { CareerRadar, AREA_LABELS } from '../components/CareerRadar'
import { AreaFilter } from '../components/AreaFilter'
import careers from '../data/careers.json'

const calcCompatibilidad = (career, areaStates) => {
  const preferKeys = Object.entries(areaStates).filter(([, v]) => v === 'prefer').map(([k]) => k)
  const avoidKeys  = Object.entries(areaStates).filter(([, v]) => v === 'avoid').map(([k]) => k)

  if (preferKeys.length === 0 && avoidKeys.length === 0)
    return { nivel: 'neutral', label: null, score: 0 }

  const avoidConflicts = avoidKeys
    .map(k => ({ key: k, score: career.areas[k] ?? 0 }))
    .filter(c => c.score >= 5)
    .sort((a, b) => b.score - a.score)

  const preferMisses = preferKeys
    .map(k => ({ key: k, score: career.areas[k] ?? 0 }))
    .filter(m => m.score < 5)
    .sort((a, b) => a.score - b.score)

  const preferSum    = preferKeys.reduce((s, k) => s + (career.areas[k] ?? 0), 0)
  const avoidPenalty = avoidConflicts.reduce((s, c) => s + c.score * 2, 0)
  const score        = preferSum - avoidPenalty

  const hardConflict = avoidConflicts.find(c => c.score >= 7)
  const softConflict = avoidConflicts.find(c => c.score < 7)
  const weakPrefer   = preferMisses[0]

  if (hardConflict)
    return { nivel: 'rojo',     label: `alto en ${AREA_LABELS[hardConflict.key]}`, score }
  if (softConflict)
    return { nivel: 'amarillo', label: `tiene poco ${AREA_LABELS[softConflict.key]}`, score }
  if (weakPrefer && avoidConflicts.length === 0)
    return { nivel: 'amarillo', label: `bajo en ${AREA_LABELS[weakPrefer.key]}`, score }

  return { nivel: 'verde', label: 'Compatible', score }
}

const BADGE = {
  verde:    'bg-green-100 text-green-800 border-green-300',
  amarillo: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  rojo:     'bg-red-100 text-red-800 border-red-300',
  neutral:  '',
}

const CARD_BORDER = {
  verde:    'border-green-300',
  amarillo: 'border-yellow-300',
  rojo:     'border-red-300',
  neutral:  'border-gray-200',
}

const CareerCard = ({ career, areaStates }) => {
  const compat     = calcCompatibilidad(career, areaStates)
  const avoidAreas = Object.entries(areaStates).filter(([, v]) => v === 'avoid').map(([k]) => k)
  const preferAreas= Object.entries(areaStates).filter(([, v]) => v === 'prefer').map(([k]) => k)

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

      <CareerRadar
        areas={career.areas}
        avoidAreas={avoidAreas}
        preferAreas={preferAreas}
        size="sm"
      />
    </div>
  )
}

export const Orientacion = () => {
  const [areaStates, setAreaStates] = useState({})

  const hasFilters = Object.keys(areaStates).length > 0

  const sorted = useMemo(() => {
    return [...careers]
      .map(c => ({ ...c, _compat: calcCompatibilidad(c, areaStates) }))
      .sort((a, b) => b._compat.score - a._compat.score)
  }, [areaStates])

  const verdes = sorted.filter(c => c._compat.nivel === 'verde').length
  const rojos  = sorted.filter(c => c._compat.nivel === 'rojo').length

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
          Marca las áreas que prefieres tener (verde) o evitar (rojo) y el radar
          ajusta las carreras en tiempo real.
        </p>
      </section>

      {/* Filtros — sticky */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <AreaFilter areaStates={areaStates} onChange={setAreaStates} />
        </div>
      </div>

      {/* Resultados */}
      <section className="max-w-6xl mx-auto px-4 py-8">

        {/* Resumen */}
        {hasFilters && (
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
                {rojos} con conflicto en áreas marcadas
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map(career => (
            <CareerCard key={career.id} career={career} areaStates={areaStates} />
          ))}
        </div>

        <p className="mt-10 text-xs text-gray-400 text-center max-w-lg mx-auto leading-relaxed">
          Los scores son estimaciones basadas en el plan de estudios oficial.
          Verde = área que prefieres con alta presencia · Rojo = área que evitas con alta presencia.
        </p>
      </section>
    </div>
  )
}
