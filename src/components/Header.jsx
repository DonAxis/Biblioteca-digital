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
    <header className="bg-ub-navy text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <Link to="/" className="flex items-center gap-3">
          <img src="/Biblioteca-digital/logo.png" alt="Universidades Bravo" className="h-12 w-auto flex-shrink-0" />
          <div className="leading-tight">
            <p className="text-xs text-ub-light font-medium tracking-wide uppercase">Universidades Bravo</p>
            <p className="text-lg font-serif font-bold">Biblioteca Digital</p>
          </div>
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
