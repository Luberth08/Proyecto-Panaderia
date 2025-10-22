// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react"; 
import "./styles/globals.css";

// Importar componentes y páginas
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/usuario/Login";
import Rol from './pages/usuario/Rol'; 
import Usuario from "./pages/usuario/Usuario"; 
import Perfil from './pages/usuario/Perfil';
import CambiarContrasena from './pages/usuario/CambiarContrasena';
import Permiso from './pages/usuario/Permiso';
import Receta from './pages/produccion/Receta';
import Categoria from './pages/inventario/Categoria';
import Insumo from './pages/inventario/Insumo';
import Producto from './pages/inventario/Producto';
import Proveedor from './pages/compra/Proveedor';
import Bitacora from "./pages/bitacora/Bitacora";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Efecto para escuchar cambios en el localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    // Escuchar el evento storage (cuando cambia localStorage desde otra pestaña)
    window.addEventListener('storage', handleStorageChange);
    
    // También verificar periódicamente (por si acaso)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!token ? <Login /> : <Navigate to="/dashboard" replace />} 
        />
        
        {token ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Rutas de Usuario */}
            <Route path="usuarios" element={<Usuario/>} />
            <Route path="roles" element={<Rol />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="cambiar-contrasena" element={<CambiarContrasena />} />
            <Route path="permisos" element={<Permiso />} />

            {/* Rutas de Inventario */}
            <Route path="categorias" element={<Categoria />} />
            <Route path="insumos" element={<Insumo />} />
            <Route path="productos" element={<Producto />} />

            {/* Rutas de Producción */}
            <Route path="recetas" element={<Receta />} />

            {/* Rutas de Compras */}
            <Route path="proveedores" element={<Proveedor />} />

            {/* Rutas de Auditoria*/}
            <Route path="bitacora" element={<Bitacora />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;