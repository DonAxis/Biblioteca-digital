import { AREA_LABELS } from './CareerRadar'

export const AreaFilter = ({ avoidAreas, onChange }) => {
  const toggle = (key) => {
    onChange(
      avoidAreas.includes(key)
        ? avoidAreas.filter(k => k !== key)
        : [...avoidAreas, key]
    )
  }

  const clear = () => onChange([])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm font-medium text-gray-700">
          ¿Qué áreas prefieres <span className="text-red-600 font-semibold">evitar</span>?
        </p>
        {avoidAreas.length > 0 && (
          <button
            onClick={clear}
            className="text-xs text-gray-400 hover:text-gray-700 underline transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.keys(AREA_LABELS).map(key => {
          const active = avoidAreas.includes(key)
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                active
                  ? 'bg-red-50 border-red-400 text-red-700 shadow-sm'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-hall-navy hover:text-hall-navy'
              }`}
            >
              <span>{AREA_LABELS[key]}</span>
              {active && <span className="text-red-500 font-bold leading-none">✕</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
