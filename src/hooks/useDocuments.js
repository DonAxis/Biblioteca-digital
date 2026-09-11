import { useState, useEffect, useCallback } from 'react'
import { getDocuments } from '../firebase/firestore'

export const useDocuments = (section = null) => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const docs = await getDocuments(section)
      setDocuments(docs)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [section])

  useEffect(() => { fetch() }, [fetch])

  return { documents, loading, error, refetch: fetch }
}
