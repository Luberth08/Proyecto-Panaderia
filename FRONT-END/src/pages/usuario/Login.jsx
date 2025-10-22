// src/pages/usuario/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../api/api";
import { useForm } from "../../hooks/useForm"; // ✅ CORREGIDO: con llaves
import FormInput from "../../components/ui/Form/FormInput"; // ✅ CORREGIDO: ruta correcta
import LoadingSpinner from "../../components/ui/LoadingSpinner"; // ✅ CORREGIDO: importación por defecto
import "../../styles/usuario/Login.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { form, handleChange, validateForm } = useForm(
    { nombre: "", contrasena: "" },
    {
      nombre: { required: true },
      contrasena: { required: true }
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await authAPI.login(form);
      localStorage.setItem("token", res.token);
      window.dispatchEvent(new Event('storage'));
      navigate("/dashboard");
    } catch (err) {
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
          
          <FormInput
            label="Usuario"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Ingresa tu usuario"
          />

          <FormInput
            label="Contraseña"
            name="contrasena"
            type="password"
            value={form.contrasena}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Ingresa tu contraseña"
          />

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner size="small" text="" />
            ) : (
              "Ingresar al Sistema"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}