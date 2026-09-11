import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { loginWithEmail, loginWithCustomToken } from '../firebase/auth'
import { useAuth } from '../contexts/AuthContext'

const ERROR_MESSAGES = {
  'auth/user-not-found':    'No existe una cuenta con ese correo.',
  'auth/wrong-password':    'Contraseña incorrecta.',
  'auth/invalid-email':     'Correo electrónico inválido.',
  'auth/invalid-credential':'Correo o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
}

export const Login = () => {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate         = useNavigate()
  const location         = useLocation()
  const [searchParams]   = useSearchParams()
  const { currentUser }  = useAuth()

  const from = location.state?.from?.pathname ?? '/'

  // Integración Moodle: si viene con ?token=..., iniciar sesión automáticamente
  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) return
    setLoading(true)
    loginWithCustomToken(token)
      .then(() => navigate(from, { replace: true }))
      .catch(err => {
        setError('Token de acceso inválido o expirado. Accede desde Moodle nuevamente.')
        setLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (currentUser) {
    navigate(from, { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginWithEmail(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] ?? 'Error al iniciar sesión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-800 p-4 rounded-full">
              <svg className="w-10 h-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477
                     5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5
                     c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18
                     c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-primary-800">Biblioteca Digital</h1>
          <p className="text-gray-500 mt-2 text-sm">Inicia sesión para acceder al repositorio universitario</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="usuario@universidad.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-700 text-white py-2.5 rounded-lg font-medium hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
