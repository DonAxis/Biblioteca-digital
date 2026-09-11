import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Home }     from './pages/Home'
import { Browse }   from './pages/Browse'
import { Document } from './pages/Document'
import { Login }    from './pages/Login'
import { Admin }    from './pages/Admin'

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/"              element={<Home />} />
              <Route path="/login"         element={<Login />} />
              <Route path="/browse"        element={<ProtectedRoute><Browse /></ProtectedRoute>} />
              <Route path="/document/:id"  element={<ProtectedRoute><Document /></ProtectedRoute>} />
              <Route path="/admin"         element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="*"              element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  )
}
