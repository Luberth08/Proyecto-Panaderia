// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../api/api";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ nombre: "", contrasena: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Intentando login...");
      const res = await authAPI.login(form);
      console.log("Login exitoso, token recibido:", res.token);
      
      localStorage.setItem("token", res.token);
      console.log("Token guardado en localStorage");
      
      // Forzar actualización del estado en App.jsx
      window.dispatchEvent(new Event('storage'));
      
      navigate("/dashboard");
      console.log("Navegación ejecutada");
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Iniciar Sesión</h2>
          <p>Sistema de Gestión Integral</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="nombre">Usuario</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Ingresa tu usuario"
              value={form.nombre}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={form.contrasena}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "Iniciando Sesión..." : "Ingresar al Sistema"}
          </button>
        </form>
      </div>
    </div>
  );
}