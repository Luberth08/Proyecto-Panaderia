// src/components/Layout.jsx - Versión mejorada
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { authAPI, perfilAPI } from '../api/api';
import './Layout.css';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState('Usuario');
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Cargar nombre del usuario al montar
  useEffect(() => {
    cargarUsuario();
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cargarUsuario = async () => {
    try {
      const response = await perfilAPI.getPerfil();
      setUserName(response.user.nombre);
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Primero intentar hacer logout en el backend
      await authAPI.logout();
      console.log('Logout en backend exitoso');
    } catch (error) {
      console.error('Error en logout del backend:', error);
      // Continuamos aunque falle el logout en el backend
    } finally {
      // Siempre limpiamos el frontend y redirigimos
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleProfile = () => {
    setUserMenuOpen(false);
    navigate('/perfil');
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Sistema de Gestión</h2>
          <button 
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button onClick={() => navigate('/dashboard')}>
                📊 Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/usuarios')}>
                👥 Usuarios
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/roles')}>
                🛡️ Roles
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/categorias')}>
                📁 Categorías
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/insumos')}>
                📦 Insumos
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/productos')}>
                🍞 Productos
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/recetas')}>
                📋 Recetas
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/proveedores')}>
                🏢 Proveedores
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/permisos')}>
                🔐 Permisos
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <h1>Sistema de Gestión</h1>
          </div>
          <div className="header-right">
            <div className="user-menu" ref={userMenuRef}>
              <button 
                className="user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="user-avatar">
                  👤
                </span>
                <span className="user-name">
                  {userName}
                </span>
                <span className={`dropdown-arrow ${userMenuOpen ? 'open' : ''}`}>
                  ▼
                </span>
              </button>
              
              {userMenuOpen && (
                <div className="user-dropdown">
                  <button onClick={handleProfile} className="dropdown-item">
                    ⚙️ Mi Perfil
                  </button>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    🚪 Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}