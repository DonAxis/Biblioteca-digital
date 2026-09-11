import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDocument, incrementDownloads } from '../firebase/firestore'
import { PDFViewer } from '../components/PDFViewer'
import { SECTIONS } from '../constants'

const formatSize = (bytes) => {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

export const Document = () => {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [doc, setDoc]           = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [showViewer, setShowViewer] = useState(false)

  useEffect(() => {
    getDocument(id)
      .then(setDoc)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleDownload = async () => {
    await incrementDownloads(id)
    window.open(doc.fileUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
        <button onClick={() => navigate(-1)} className="text-primary-700 hover:underline text-sm">
          ← Volver
        </button>
      </div>
    )
  }

  const sectionLabel = SECTIONS.find(s => s.id === doc.section)?.label ?? doc.section

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-primary-700 hover:underline text-sm mb-6 flex items-center gap-1"
      >
        ← Volver a resultados
      </button>

      {/* Metadata */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
            {sectionLabel}
          </span>
          <span className="text-xs text-gray-400">{doc.year}</span>
        </div>

        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2 leading-snug">
          {doc.title}
        </h1>
        <p className="text-lg text-gray-600 mb-6">{doc.author}</p>

        {doc.abstract && (
          <div className="mb-5">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Resumen</h2>
            <p className="text-gray-700 leading-relaxed text-sm">{doc.abstract}</p>
          </div>
        )}

        {doc.keywords?.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Palabras clave</h2>
            <div className="flex flex-wrap gap-1.5">
              {doc.keywords.map(kw => (
                <span key={kw} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-400 border-t pt-4">
          {doc.fileSize && <span>📄 {formatSize(doc.fileSize)}</span>}
          <span>·</span>
          <span>⬇️ {doc.downloads ?? 0} descargas</span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setShowViewer(v => !v)}
          className="bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-800 transition-colors flex items-center gap-2"
        >
          {showViewer ? '✕ Cerrar visor' : '👁 Leer en línea'}
        </button>
        <button
          onClick={handleDownload}
          className="border border-primary-700 text-primary-700 px-5 py-2.5 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center gap-2"
        >
          ⬇️ Descargar PDF
        </button>
      </div>

      {showViewer && (
        <div className="mb-8">
          <PDFViewer fileUrl={doc.fileUrl} />
        </div>
      )}
    </div>
  )
}
