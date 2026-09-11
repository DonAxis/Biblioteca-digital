import { SECTIONS } from '../constants'

export const SectionFilter = ({ selected, onChange }) => (
  <div className="flex flex-wrap gap-2">
    <button
      onClick={() => onChange(null)}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        !selected
          ? 'bg-primary-700 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      Todas
    </button>
    {SECTIONS.map(sec => (
      <button
        key={sec.id}
        onClick={() => onChange(sec.id)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          selected === sec.id
            ? 'bg-primary-700 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {sec.label}
      </button>
    ))}
  </div>
)
