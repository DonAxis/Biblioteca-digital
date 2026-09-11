import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { logout } from '../firebase/auth'

export const Header = () => {
  const { currentUser, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="bg-primary-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
        <Link to="/" className="flex items-center gap-3">
          <svg className="w-8 h-8 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477
                 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5
                 c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18
                 c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-xl font-serif font-bold leading-tight">Biblioteca Digital Universitaria</span>
        </Link>

        <nav className="flex items-center gap-4 flex-wrap">
          <Link to="/" className="hover:text-blue-200 transition-colors text-sm">Inicio</Link>
          <Link to="/browse" className="hover:text-blue-200 transition-colors text-sm">Explorar</Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="bg-yellow-400 text-primary-900 px-3 py-1 rounded font-medium text-sm hover:bg-yellow-300 transition-colors"
            >
              Admin
            </Link>
          )}
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-blue-200 hidden sm:block max-w-[180px] truncate">
                {currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="border border-white text-white px-3 py-1 rounded text-sm hover:bg-white hover:text-primary-800 transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-primary-800 px-4 py-1.5 rounded font-medium text-sm hover:bg-blue-50 transition-colors"
            >
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
