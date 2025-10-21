// src/pages/perfil/CambiarContrasena.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { perfilAPI } from '../../api/api';
import './CambiarContrasena.css';

export default function CambiarContrasena() {
  const [form, setForm] = useState({
    contrasena_actual: '',
    nueva_contrasena: '',
    confirmar_contrasena: ''
  });
  const [mostrarContrasenas, setMostrarContrasenas] = useState({
    contrasena_actual: false,
    nueva_contrasena: false,
    confirmar_contrasena: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const toggleMostrarContrasena = (campo) => {
    setMostrarContrasenas(prev => ({
      ...prev,
      [campo]: !prev[campo]
    }));
  };

  const validateForm = () => {
    if (!form.contrasena_actual || !form.nueva_contrasena || !form.confirmar_contrasena) {
      setError('Todos los campos son obligatorios');
      return false;
    }

    if (form.nueva_contrasena.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (form.nueva_contrasena !== form.confirmar_contrasena) {
      setError('Las nuevas contraseñas no coinciden');
      return false;
    }

    if (form.contrasena_actual === form.nueva_contrasena) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
        // USAR ENDPOINT REAL
        await perfilAPI.cambiarContrasena({
        contrasena_actual: form.contrasena_actual,
        nueva_contrasena: form.nueva_contrasena
        });

        setSuccess('Contraseña cambiada exitosamente');
        setForm({
        contrasena_actual: '',
        nueva_contrasena: '',
        confirmar_contrasena: ''
        });
    } catch (err) {
        setError(err.message || 'Error al cambiar la contraseña');
    } finally {
        setLoading(false);
    }
 };

  const handleCancel = () => {
    navigate('/perfil');
  };

  return (
    <div className="cambiar-contrasena-container">
      <div className="form-card">
        <div className="form-header">
          <h1>Cambiar Contraseña</h1>
          <p>Actualiza tu contraseña de acceso al sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="contrasena-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="contrasena_actual">
              Contraseña Actual *
              <span className="field-info">Ingresa tu contraseña actual para verificar tu identidad</span>
            </label>
            <div className="password-input-container">
              <input
                type={mostrarContrasenas.contrasena_actual ? "text" : "password"}
                id="contrasena_actual"
                name="contrasena_actual"
                value={form.contrasena_actual}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="Ingresa tu contraseña actual"
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => toggleMostrarContrasena('contrasena_actual')}
              >
                {mostrarContrasenas.contrasena_actual ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="nueva_contrasena">
              Nueva Contraseña *
              <span className="field-info">Mínimo 6 caracteres</span>
            </label>
            <div className="password-input-container">
              <input
                type={mostrarContrasenas.nueva_contrasena ? "text" : "password"}
                id="nueva_contrasena"
                name="nueva_contrasena"
                value={form.nueva_contrasena}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="Mínimo 6 caracteres"
                minLength="6"
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => toggleMostrarContrasena('nueva_contrasena')}
              >
                {mostrarContrasenas.nueva_contrasena ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmar_contrasena">
              Confirmar Nueva Contraseña *
              <span className="field-info">Repite la nueva contraseña para confirmar</span>
            </label>
            <div className="password-input-container">
              <input
                type={mostrarContrasenas.confirmar_contrasena ? "text" : "password"}
                id="confirmar_contrasena"
                name="confirmar_contrasena"
                value={form.confirmar_contrasena}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="Repite la nueva contraseña"
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => toggleMostrarContrasena('confirmar_contrasena')}
              >
                {mostrarContrasenas.confirmar_contrasena ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="password-strength">
            <div className={`strength-bar ${form.nueva_contrasena.length >= 6 ? 'strong' : 'weak'}`}>
              <div className="strength-fill"></div>
            </div>
            <span className="strength-text">
              {form.nueva_contrasena.length >= 6 ? 'Contraseña segura' : 'Contraseña débil'}
            </span>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}