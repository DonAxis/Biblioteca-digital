import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { uploadPDF, deletePDF } from '../firebase/storage'
import { addDocument, deleteDocument } from '../firebase/firestore'
import { useDocuments } from '../hooks/useDocuments'
import { SECTIONS } from '../constants'

const EMPTY_FORM = {
  title: '', author: '', abstract: '', year: new Date().getFullYear(),
  section: '', keywords: '', file: null,
}

export const Admin = () => {
  const { currentUser, isAdmin } = useAuth()
  const navigate = useNavigate()
  const { documents, loading: docsLoading, refetch } = useDocuments()

  const [form, setForm]               = useState(EMPTY_FORM)
  const [progress, setProgress]       = useState(0)
  const [uploading, setUploading]     = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [deletingId, setDeletingId]   = useState(null)

  if (!isAdmin) {
    navigate('/')
    return null
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

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
    if (!form.section) { setUploadError('Selecciona una sección.'); return }

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
        keywords:   form.keywords.split(',').map(k => k.trim()).filter(Boolean),
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
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-8">Panel de administración</h1>

      {/* Formulario de subida */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Subir nuevo documento</h2>

        {uploadSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-5 text-sm flex items-center gap-2">
            ✅ Documento subido exitosamente.
          </div>
        )}
        {uploadError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
            {uploadError}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Título *</label>
              <input
                required
                value={form.title}
                onChange={set('title')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Autor(es) *</label>
              <input
                required
                value={form.author}
                onChange={set('author')}
                placeholder="Apellido, Nombre; Apellido2, Nombre2"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Resumen</label>
            <textarea
              value={form.abstract}
              onChange={set('abstract')}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Año *</label>
              <input
                required
                type="number"
                min="1900"
                max="2100"
                value={form.year}
                onChange={set('year')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sección *</label>
              <select
                required
                value={form.section}
                onChange={set('section')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
              >
                <option value="">Seleccionar...</option>
                {SECTIONS.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Palabras clave (separadas por coma)
              </label>
              <input
                value={form.keywords}
                onChange={set('keywords')}
                placeholder="cálculo, derivadas, límites"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Archivo PDF *</label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
            />
            {form.file && (
              <p className="text-xs text-gray-500 mt-1">
                Seleccionado: {form.file.name} ({(form.file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {uploading && (
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                <span>Subiendo archivo...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? `Subiendo... ${progress}%` : '⬆️ Subir documento'}
          </button>
        </form>
      </div>

      {/* Lista de documentos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">
          Documentos en la biblioteca ({documents.length})
        </h2>

        {docsLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No hay documentos todavía.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {documents.map(doc => {
              const sectionLabel = SECTIONS.find(s => s.id === doc.section)?.label ?? doc.section
              return (
                <div key={doc.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800 text-sm truncate">{doc.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {doc.author} · {doc.year} · {sectionLabel}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(doc)}
                    disabled={deletingId === doc.id}
                    className="text-xs text-red-500 hover:text-red-700 hover:underline flex-shrink-0 disabled:opacity-40"
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
