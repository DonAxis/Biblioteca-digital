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
    <header className="bg-hall-navy text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <Link to="/" className="flex items-center gap-3">
          <img src="/Biblioteca-digital/logoHall.png" alt="HALL" className="h-12 w-auto flex-shrink-0" />
          <div className="leading-tight">
            <p className="text-hall-gold font-serif font-bold text-lg tracking-wide">HALL Centro de Investigación</p>
            <p className="text-gray-300 text-xs tracking-widest uppercase">Repositorio Científico</p>
          </div>
        </Link>

        <nav className="flex items-center gap-5 flex-wrap">
          <Link to="/" className="text-sm text-gray-300 hover:text-hall-gold transition-colors">Inicio</Link>
          <Link to="/browse" className="text-sm text-gray-300 hover:text-hall-gold transition-colors">Explorar</Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="bg-hall-gold text-hall-navy px-3 py-1 rounded font-semibold text-sm hover:brightness-110 transition-all"
            >
              Admin
            </Link>
          )}
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 hidden sm:block max-w-[180px] truncate">
                {currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="border border-gray-500 text-gray-300 px-3 py-1 rounded text-sm hover:border-hall-gold hover:text-hall-gold transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-hall-gold text-hall-navy px-4 py-1.5 rounded font-semibold text-sm hover:brightness-110 transition-all"
            >
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
