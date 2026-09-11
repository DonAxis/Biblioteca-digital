import { useState } from 'react'

export const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar por título, autor, palabras clave..."
        className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
      />
      <button type="submit" className="bg-primary-700 text-white px-5 py-2 rounded-md hover:bg-primary-800 transition-colors font-medium">
        Buscar
      </button>
      {query && (
        <button
          type="button"
          onClick={() => { setQuery(''); onSearch('') }}
          className="border border-gray-300 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          ✕
        </button>
      )}
    </form>
  )
}
