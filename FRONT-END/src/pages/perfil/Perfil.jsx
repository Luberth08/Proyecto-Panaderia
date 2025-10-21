// src/pages/perfil/Perfil.jsx
import { useState, useEffect } from 'react';
import { perfilAPI } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import './Perfil.css';

export default function Perfil() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    sexo: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      const response = await perfilAPI.getPerfil();
      setForm(response.user);
    } catch (err) {
      setError('Error al cargar el perfil: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.nombre || !form.email) {
      setError('Nombre y email son obligatorios');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await perfilAPI.updatePerfil(form);
      setSuccess(response.message || 'Perfil actualizado exitosamente');
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleCambiarContrasena = () => {
    navigate('/cambiar-contrasena');
  };

  if (loading) return <div className="loading">Cargando perfil...</div>;

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal</p>
      </div>

      <div className="perfil-card">
        <form onSubmit={handleSubmit} className="perfil-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Nombre de usuario *</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleInputChange}
                required
                disabled={saving}
                placeholder="Tu nombre de usuario"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                required
                disabled={saving}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Sexo</label>
              <select
                name="sexo"
                value={form.sexo}
                onChange={handleInputChange}
                disabled={saving}
              >
                <option value="">No especificado</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleInputChange}
                disabled={saving}
                placeholder="Tu número de teléfono"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleCambiarContrasena}
            >
              🔐 Cambiar Contraseña
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}