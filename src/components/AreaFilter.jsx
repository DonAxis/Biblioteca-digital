import { AREA_LABELS } from './CareerRadar'

// null → 'prefer' → 'avoid' → null
const CYCLE = { null: 'prefer', prefer: 'avoid', avoid: null }

export const AreaFilter = ({ areaStates, onChange }) => {
  const toggle = (key) => {
    const current = areaStates[key] ?? null
    const next = CYCLE[String(current)]
    const updated = { ...areaStates }
    if (next === null) delete updated[key]
    else updated[key] = next
    onChange(updated)
  }

  const hasAny = Object.keys(areaStates).length > 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-gray-500">
          <span className="font-semibold text-green-700">1 click</span> = prefiero ·{' '}
          <span className="font-semibold text-red-600">2 clicks</span> = evito ·{' '}
          <span className="text-gray-400">3 clicks</span> = quitar
        </p>
        {hasAny && (
          <button
            onClick={() => onChange({})}
            className="text-xs text-gray-400 hover:text-gray-700 underline transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.keys(AREA_LABELS).map(key => {
          const state = areaStates[key] ?? null
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all select-none ${
                state === 'prefer'
                  ? 'bg-green-50 border-green-400 text-green-800 shadow-sm'
                  : state === 'avoid'
                  ? 'bg-red-50 border-red-400 text-red-700 shadow-sm'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-hall-navy hover:text-hall-navy'
              }`}
            >
              {state === 'prefer' && <span className="font-bold text-green-600 text-xs">+</span>}
              {state === 'avoid'  && <span className="font-bold text-red-500 text-xs">✕</span>}
              <span>{AREA_LABELS[key]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
