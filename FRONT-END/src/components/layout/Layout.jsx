// src/components/layout/Layout.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { authAPI, perfilAPI } from '../../api/api';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../ui/LoadingSpinner';
import './Layout.css';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    compra: false,
    inventario: false,
    produccion: false,
    usuario: false,
    venta: false,
    auditoria: false
  });
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Usar hook useApi para cargar el perfil
  const { data: userData, loading: userLoading } = useApi(
    () => perfilAPI.getPerfil(),
    true
  );

  const userName = userData?.user?.nombre || 'Usuario';

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

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Error en logout del backend:', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleProfile = () => {
    setUserMenuOpen(false);
    navigate('/perfil');
  };
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Nueva estructura del menú organizada
  const menuSections = [
    {
      id: 'usuario',
      type: 'section',
      icon: '👥',
      label: 'Administrar Usuario',
      expanded: expandedSections.usuario,
      items: [
        { icon: '👥', label: 'Usuarios', path: '/usuarios' },
        { icon: '🛡️', label: 'Roles', path: '/roles' },
        { icon: '🔐', label: 'Permisos', path: '/permisos' }
      ]
    },
    {
      id: 'compra',
      type: 'section',
      icon: '🛒',
      label: 'Administrar Compra',
      expanded: expandedSections.compra,
      items: [
        { icon: '🏢', label: 'Proveedores', path: '/proveedores' },
        { icon: '📝', label: 'Notas de compra', path: '/nota-compra' }        
      ]
    },
    {
      id: 'inventario',
      type: 'section',
      icon: '📦',
      label: 'Administrar Inventario',
      expanded: expandedSections.inventario,
      items: [
        { icon: '📁', label: 'Categorías', path: '/categorias' },
        { icon: '📦', label: 'Insumos', path: '/insumos' },
        { icon: '🍞', label: 'Productos', path: '/productos' }
      ]
    },
    {
      id: 'produccion',
      type: 'section',
      icon: '🏭',
      label: 'Administrar Producción',
      expanded: expandedSections.produccion,
      items: [
        { icon: '📋', label: 'Recetas', path: '/recetas' },
        { icon: '🏭', label: 'Producciones', path: '/produccion' }
      ]
    },
    {
      id: 'venta',
      type: 'section',
      icon: '💰',
      label: 'Administrar Venta',
      expanded: expandedSections.venta,
      items: [
        { icon: '📋', label: 'Gestionar Pedido del Cliente', path: '/pedidos' },
        { icon: '✅', label: 'Confirmar Entrega de Pedido', path: '/confirmar-entrega' },
        { icon: '➕', label: 'Realizar Pedido como Cliente', path: '/realizar-pedido' },
        { icon: '🔍', label: 'Consultar Estado de Pedido', path: '/consultar-estado' }
      ]
    },
    {
      id: 'auditoria',
      type: 'section',
      icon: '🕓',
      label: 'Auditoría del Sistema',
      expanded: expandedSections.auditoria,
      items: [
        { icon: '📜', label: 'Bitácora', path: '/bitacora' },
        { icon: '📊', label: 'Reportes', path: '/reportes' },
        { icon: '🤖', label: 'Reportes IA', path: '/reportes-ia' }
      ]
    },
    {
      id: 'dashboard',
      type: 'single',
      icon: '📊',
      label: 'Dashboard',
      path: '/dashboard'
    }
  ];

  if (userLoading) {
    return <LoadingSpinner text="Cargando aplicación..." centered />;
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Sistema de Gestión</h2>
          <button 
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {menuSections.map((section) => {
              if (section.type === 'single') {
                return (
                  <li key={section.id}>
                    <button 
                      onClick={() => navigate(section.path)}
                      className="nav-button single-item"
                    >
                      <span className="nav-icon">{section.icon}</span>
                      {sidebarOpen && (
                        <span className="nav-label">{section.label}</span>
                      )}
                    </button>
                  </li>
                );
              }

              return (
                <li key={section.id} className="nav-section">
                  <button 
                    onClick={() => toggleSection(section.id)}
                    className={`nav-button section-header ${section.expanded ? 'expanded' : ''}`}
                  >
                    <span className="nav-icon">{section.icon}</span>
                    {sidebarOpen && (
                      <>
                        <span className="nav-label">{section.label}</span>
                        <span className="section-arrow">
                          {section.expanded ? '▼' : '▶'}
                        </span>
                      </>
                    )}
                  </button>
                  
                  {sidebarOpen && section.expanded && (
                    <ul className="submenu">
                      {section.items.map((item) => (
                        <li key={item.path}>
                          <button 
                            onClick={() => navigate(item.path)}
                            className="nav-button submenu-item"
                          >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
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
                aria-expanded={userMenuOpen}
                aria-label="Menú de usuario"
              >
                <span className="user-avatar">
                  👤
                </span>
                {sidebarOpen && (
                  <span className="user-name">
                    {userName}
                  </span>
                )}
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