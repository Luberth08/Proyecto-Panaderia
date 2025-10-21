// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react"; // ← AGREGAR useState y useEffect
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboards/Dashboard";
import Rol from './pages/rol/Rol'; // Agregar esta importación
import Usuario from "./pages/usuario/Usuario"; // ← IMPORTAR el componente real
import Perfil from './pages/perfil/Perfil';
import CambiarContrasena from './pages/perfil/CambiarContrasena';
import Permiso from './pages/permiso/Permiso';
import Categoria from './pages/inventario/Categoria';
import Insumo from './pages/inventario/Insumo';
import Producto from './pages/inventario/Producto';
import Receta from './pages/produccion/Receta';
import Proveedor from './pages/compra/Proveedor';
import "./App.css";

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
            <Route path="usuarios" element={<Usuario/>} />
            <Route path="roles" element={<Rol />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="cambiar-contrasena" element={<CambiarContrasena />} />
            <Route path="permisos" element={<Permiso />} /> {/* Reemplazar el div temporal */}

            <Route path="categorias" element={<Categoria />} />
            <Route path="insumos" element={<Insumo />} />
            <Route path="productos" element={<Producto />} />

            <Route path="recetas" element={<Receta />} />
            <Route path="proveedores" element={<Proveedor />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;