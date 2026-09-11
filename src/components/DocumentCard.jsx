import { Link } from 'react-router-dom'
import { SECTIONS } from '../constants'

const formatSize = (bytes) => {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

export const DocumentCard = ({ doc }) => {
  const sectionLabel = SECTIONS.find(s => s.id === doc.section)?.label ?? doc.section

  return (
    <Link
      to={`/document/${doc.id}`}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-200 transition-all duration-200 p-5 block"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
          {sectionLabel}
        </span>
        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{doc.year}</span>
      </div>

      <h3 className="font-serif font-semibold text-gray-900 text-base mb-1 line-clamp-2 leading-snug">
        {doc.title}
      </h3>
      <p className="text-sm text-gray-600 mb-2">{doc.author}</p>

      {doc.abstract && (
        <p className="text-xs text-gray-500 line-clamp-3 mb-3 leading-relaxed">{doc.abstract}</p>
      )}

      {doc.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {doc.keywords.slice(0, 4).map(kw => (
            <span key={kw} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {kw}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-3 mt-3">
        <span>{formatSize(doc.fileSize)}</span>
        <span>{doc.downloads ?? 0} descargas</span>
      </div>
    </Link>
  )
}
