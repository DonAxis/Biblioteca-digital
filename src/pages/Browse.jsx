import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar'
import { SectionFilter } from '../components/SectionFilter'
import { DocumentCard } from '../components/DocumentCard'
import { useDocuments } from '../hooks/useDocuments'

const matchesQuery = (doc, q) => {
  if (!q) return true
  const lower = q.toLowerCase()
  return (
    doc.title?.toLowerCase().includes(lower) ||
    doc.author?.toLowerCase().includes(lower) ||
    doc.abstract?.toLowerCase().includes(lower) ||
    doc.keywords?.some(k => k.toLowerCase().includes(lower))
  )
}

export const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const section = searchParams.get('section') || null
  const query   = searchParams.get('q') || ''

  const { documents, loading, error } = useDocuments(section)

  const filtered = useMemo(
    () => documents.filter(d => matchesQuery(d, query)),
    [documents, query]
  )

  const handleSearch = (q) => {
    const params = {}
    if (q)       params.q = q
    if (section) params.section = section
    setSearchParams(params)
  }

  const handleSectionChange = (sec) => {
    const params = {}
    if (query) params.q = query
    if (sec)   params.section = sec
    setSearchParams(params)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Explorar documentos</h1>

      <div className="space-y-4 mb-8">
        <SearchBar onSearch={handleSearch} initialValue={query} />
        <SectionFilter selected={section} onChange={handleSectionChange} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          Error al cargar documentos: {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse h-52" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-xl font-medium text-gray-600 mb-2">No se encontraron documentos</p>
          <p className="text-sm">Intenta con otros términos o cambia el filtro de sección.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {filtered.length} documento{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            {section && ' en esta sección'}
            {query && ` para "${query}"`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
          </div>
        </>
      )}
    </div>
  )
}
