import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { uploadPDF, deletePDF } from '../firebase/storage'
import { addDocument, deleteDocument } from '../firebase/firestore'
import { useDocuments } from '../hooks/useDocuments'
import { SECTIONS, DOCUMENT_TYPES, LICENSES } from '../constants'

const EMPTY_FORM = {
  title: '', author: '', abstract: '',
  year: new Date().getFullYear(),
  section: '', docType: '', license: '',
  keywords: '', doi: '', source: '',
  file: null,
}

const fetchDOIMetadata = async (doi) => {
  const clean = doi.trim().replace(/^https?:\/\/doi\.org\//i, '')
  const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(clean)}`)
  if (!res.ok) throw new Error('DOI no encontrado')
  const { message } = await res.json()

  const title = message.title?.[0] ?? ''
  const authors = (message.author ?? [])
    .map(a => [a.family, a.given].filter(Boolean).join(', '))
    .join('; ')
  const year = message.published?.['date-parts']?.[0]?.[0]
    ?? message['published-print']?.['date-parts']?.[0]?.[0]
    ?? ''
  const source = [
    message.publisher,
    message['container-title']?.[0],
  ].filter(Boolean).join(' — ')

  return { title, author: authors, year: String(year), source }
}

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
)

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-hall-gold focus:border-transparent text-sm"

export const Admin = () => {
  const { currentUser, isAdmin } = useAuth()
  const navigate = useNavigate()
  const { documents, loading: docsLoading, refetch } = useDocuments()

  const [form, setForm]                   = useState(EMPTY_FORM)
  const [progress, setProgress]           = useState(0)
  const [uploading, setUploading]         = useState(false)
  const [uploadError, setUploadError]     = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [deletingId, setDeletingId]       = useState(null)
  const [doiLoading, setDoiLoading]       = useState(false)
  const [doiError, setDoiError]           = useState('')

  if (!isAdmin) { navigate('/'); return null }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleDOILookup = async () => {
    if (!form.doi.trim()) { setDoiError('Escribe un DOI primero.'); return }
    setDoiLoading(true)
    setDoiError('')
    try {
      const meta = await fetchDOIMetadata(form.doi)
      setForm(f => ({
        ...f,
        title:  meta.title  || f.title,
        author: meta.author || f.author,
        year:   meta.year   || f.year,
        source: meta.source || f.source,
      }))
    } catch {
      setDoiError('No se encontró información para ese DOI. Verifica que sea correcto.')
    } finally {
      setDoiLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setUploadError('Solo se permiten archivos PDF.')
      return
    }
    setForm(f => ({ ...f, file }))
    setUploadError('')
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!form.file)    { setUploadError('Selecciona un archivo PDF.'); return }
    if (!form.section) { setUploadError('Selecciona una categoría.'); return }
    if (!form.license) { setUploadError('Selecciona una licencia.'); return }

    setUploading(true)
    setUploadError('')
    setUploadSuccess(false)

    try {
      const { fileUrl, storagePath } = await uploadPDF(form.file, setProgress)
      await addDocument({
        title:      form.title.trim(),
        author:     form.author.trim(),
        abstract:   form.abstract.trim(),
        year:       Number(form.year),
        section:    form.section,
        docType:    form.docType,
        license:    form.license,
        keywords:   form.keywords.split(',').map(k => k.trim()).filter(Boolean),
        doi:        form.doi.trim(),
        source:     form.source.trim(),
        fileUrl,
        storagePath,
        fileSize:   form.file.size,
        uploadedBy: currentUser.uid,
      })
      setForm(EMPTY_FORM)
      setProgress(0)
      setUploadSuccess(true)
      refetch()
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (doc) => {
    if (!window.confirm(`¿Eliminar "${doc.title}"? Esta acción no se puede deshacer.`)) return
    setDeletingId(doc.id)
    try {
      await deletePDF(doc.storagePath)
      await deleteDocument(doc.id)
      refetch()
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold text-hall-navy mb-8">Panel de administración</h1>

      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <h2 className="text-lg font-semibold text-hall-navy mb-6">Subir nuevo documento</h2>

        {uploadSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-5 text-sm">
            ✅ Documento subido exitosamente.
          </div>
        )}
        {uploadError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
            {uploadError}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-5">

          {/* Título y Autor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Título" required>
              <input required value={form.title} onChange={set('title')} className={inputCls} />
            </Field>
            <Field label="Autor(es)" required>
              <input required value={form.author} onChange={set('author')}
                placeholder="Apellido, Nombre; Apellido2, Nombre2" className={inputCls} />
            </Field>
          </div>

          {/* Resumen */}
          <Field label="Resumen">
            <textarea value={form.abstract} onChange={set('abstract')} rows={3}
              className={inputCls + ' resize-none'} />
          </Field>

          {/* Año, Categoría, Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Año" required>
              <input required type="number" min="1900" max="2100"
                value={form.year} onChange={set('year')} className={inputCls} />
            </Field>
            <Field label="Categoría" required>
              <select required value={form.section} onChange={set('section')} className={inputCls + ' bg-white'}>
                <option value="">Seleccionar...</option>
                {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Tipo de documento">
              <select value={form.docType} onChange={set('docType')} className={inputCls + ' bg-white'}>
                <option value="">Seleccionar...</option>
                {DOCUMENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </Field>
          </div>

          {/* Palabras clave */}
          <Field label="Palabras clave (separadas por coma)">
            <input value={form.keywords} onChange={set('keywords')}
              placeholder="cálculo, derivadas, límites" className={inputCls} />
          </Field>

          {/* Separador legal */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Derechos y procedencia
            </p>

            {/* Licencia */}
            <div className="mb-4">
              <Field label="Licencia / derechos de uso" required>
                <select required value={form.license} onChange={set('license')} className={inputCls + ' bg-white'}>
                  <option value="">Seleccionar licencia...</option>
                  {LICENSES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              </Field>
            </div>

            {/* DOI con búsqueda automática */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                DOI / ISBN — <span className="text-hall-gold font-normal">pega el DOI y busca para autocompletar</span>
              </label>
              <div className="flex gap-2">
                <input
                  value={form.doi}
                  onChange={set('doi')}
                  placeholder="10.1007/978-3-030-29509-7_14"
                  className={inputCls + ' flex-1'}
                />
                <button
                  type="button"
                  onClick={handleDOILookup}
                  disabled={doiLoading}
                  className="bg-hall-gold text-hall-navy px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {doiLoading ? '...' : '🔍 Buscar'}
                </button>
              </div>
              {doiError && <p className="text-xs text-red-500 mt-1">{doiError}</p>}
              <p className="text-xs text-gray-400 mt-1">
                También acepta URLs completas: https://doi.org/10.1007/...
              </p>
            </div>

            <Field label="Fuente / enlace original">
              <input value={form.source} onChange={set('source')}
                placeholder="Springer, PubMed, repositorio de origen..." className={inputCls} />
            </Field>
          </div>

          {/* PDF */}
          <div className="border-t border-gray-100 pt-5">
            <Field label="Archivo PDF" required>
              <input type="file" accept=".pdf,application/pdf" onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-hall-cream file:text-hall-navy hover:file:brightness-95 cursor-pointer" />
              {form.file && (
                <p className="text-xs text-gray-400 mt-1">
                  {form.file.name} — {(form.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </Field>
          </div>

          {/* Barra de progreso */}
          {uploading && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Subiendo...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-hall-gold h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <button type="submit" disabled={uploading}
            className="bg-hall-navy text-white px-6 py-2.5 rounded-lg font-medium hover:bg-hall-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? `Subiendo... ${progress}%` : '⬆️ Subir documento'}
          </button>
        </form>
      </div>

      {/* Lista de documentos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-lg font-semibold text-hall-navy mb-5">
          Documentos en la biblioteca ({documents.length})
        </h2>
        {docsLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : documents.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No hay documentos todavía.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {documents.map(doc => {
              const sectionLabel  = SECTIONS.find(s => s.id === doc.section)?.label ?? doc.section
              const docTypeLabel  = DOCUMENT_TYPES.find(t => t.id === doc.docType)?.label ?? ''
              const licenseLabel  = LICENSES.find(l => l.id === doc.license)?.label ?? ''
              return (
                <div key={doc.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800 text-sm truncate">{doc.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {doc.author} · {doc.year} · {sectionLabel}
                      {docTypeLabel && ` · ${docTypeLabel}`}
                    </p>
                    {licenseLabel && (
                      <p className="text-xs text-hall-gold mt-0.5">{licenseLabel}</p>
                    )}
                    {doc.doi && (
                      <p className="text-xs text-gray-400 font-mono">DOI: {doc.doi}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(doc)}
                    disabled={deletingId === doc.id}
                    className="text-xs text-red-400 hover:text-red-600 hover:underline flex-shrink-0 disabled:opacity-40 mt-0.5"
                  >
                    {deletingId === doc.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
