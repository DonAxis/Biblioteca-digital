export const SECTIONS = [
  { id: 'ciencias-basicas',      label: 'Ciencias Básicas' },
  { id: 'ingenieria-tecnologia', label: 'Ingeniería y Tecnología' },
  { id: 'ciencias-salud',        label: 'Ciencias de la Salud / Medicina' },
  { id: 'ciencias-sociales',     label: 'Ciencias Sociales' },
  { id: 'humanidades',           label: 'Humanidades' },
  { id: 'computacion-ti',        label: 'Ciencias de la Computación / TI' },
  { id: 'tesis-grado',           label: 'Tesis y Trabajos de Grado' },
  { id: 'revistas-articulos',    label: 'Revistas y Artículos Científicos' },
]

export const DOCUMENT_TYPES = [
  { id: 'articulo',   label: 'Artículo científico' },
  { id: 'capitulo',   label: 'Capítulo de libro' },
  { id: 'libro',      label: 'Libro' },
  { id: 'tesis',      label: 'Tesis' },
  { id: 'ponencia',   label: 'Ponencia' },
  { id: 'informe',    label: 'Informe técnico' },
  { id: 'revista',    label: 'Revista' },
]

export const LICENSES = [
  { id: 'cc-by-4.0',  label: 'Creative Commons CC BY 4.0' },
  { id: 'cc-by-sa',   label: 'Creative Commons CC BY-SA' },
  { id: 'cc-by-nc',   label: 'Creative Commons CC BY-NC' },
  { id: 'dominio',    label: 'Dominio público' },
  { id: 'open-access',label: 'Open Access — licencia por verificar' },
  { id: 'otro',       label: 'Otro / especificar en fuente' },
]

export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL
