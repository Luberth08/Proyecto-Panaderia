// src/pages/usuario/CambiarContrasena.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { perfilAPI } from '../../api/api';
import { useForm } from '../../hooks/useForm'; // ✅ CORREGIDO: con llaves y ruta correcta
import FormInput from '../../components/ui/Form/FormInput';
import PageHeader from '../../components/ui/PageHeader';
import { ERROR_MESSAGES } from '../../utils/constants';
import '../../styles/usuario/CambiarContrasena.css';

export default function CambiarContrasena() {
  const [mostrarContrasenas, setMostrarContrasenas] = useState({
    contrasena_actual: false,
    nueva_contrasena: false,
    confirmar_contrasena: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const { form, handleChange, errors, validateForm } = useForm(
    {
      contrasena_actual: '',
      nueva_contrasena: '',
      confirmar_contrasena: ''
    },
    {
      contrasena_actual: { required: true },
      nueva_contrasena: { 
        required: true, 
        minLength: 6,
        custom: (value, form) => {
          if (value === form.contrasena_actual) {
            return 'La nueva contraseña debe ser diferente a la actual';
          }
          return '';
        }
      },
      confirmar_contrasena: { 
        required: true,
        custom: (value, form) => {
          if (value !== form.nueva_contrasena) {
            return ERROR_MESSAGES.PASSWORD_MISMATCH;
          }
          return '';
        }
      }
    }
  );

  const toggleMostrarContrasena = (campo) => {
    setMostrarContrasenas(prev => ({
      ...prev,
      [campo]: !prev[campo]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setSuccess('');

    try {
      await perfilAPI.cambiarContrasena({
        contrasena_actual: form.contrasena_actual,
        nueva_contrasena: form.nueva_contrasena
      });

      setSuccess('Contraseña cambiada exitosamente');
      // Limpiar formulario
      handleChange({ target: { name: 'contrasena_actual', value: '' } });
      handleChange({ target: { name: 'nueva_contrasena', value: '' } });
      handleChange({ target: { name: 'confirmar_contrasena', value: '' } });
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/perfil');
  };

  const passwordStrength = form.nueva_contrasena.length >= 6 ? 'strong' : 'weak';

  return (
    <div className="cambiar-contrasena-container">
      <PageHeader
        title="Cambiar Contraseña"
        description="Actualiza tu contraseña de acceso al sistema"
      />

      <div className="form-card">
        <form onSubmit={handleSubmit} className="contrasena-form">
          {success && <div className="success-message">{success}</div>}

          <FormInput
            label="Contraseña Actual"
            name="contrasena_actual"
            type={mostrarContrasenas.contrasena_actual ? "text" : "password"}
            value={form.contrasena_actual}
            onChange={handleChange}
            error={errors.contrasena_actual}
            required
            disabled={loading}
            placeholder="Ingresa tu contraseña actual"
            icon={
              <button
                type="button"
                className="password-toggle"
                onClick={() => toggleMostrarContrasena('contrasena_actual')}
              >
                {mostrarContrasenas.contrasena_actual ? '🙈' : '👁️'}
              </button>
            }
          />

          <FormInput
            label="Nueva Contraseña"
            name="nueva_contrasena"
            type={mostrarContrasenas.nueva_contrasena ? "text" : "password"}
            value={form.nueva_contrasena}
            onChange={handleChange}
            error={errors.nueva_contrasena}
            required
            disabled={loading}
            placeholder="Mínimo 6 caracteres"
            minLength="6"
            icon={
              <button
                type="button"
                className="password-toggle"
                onClick={() => toggleMostrarContrasena('nueva_contrasena')}
              >
                {mostrarContrasenas.nueva_contrasena ? '🙈' : '👁️'}
              </button>
            }
          />

          <FormInput
            label="Confirmar Nueva Contraseña"
            name="confirmar_contrasena"
            type={mostrarContrasenas.confirmar_contrasena ? "text" : "password"}
            value={form.confirmar_contrasena}
            onChange={handleChange}
            error={errors.confirmar_contrasena}
            required
            disabled={loading}
            placeholder="Repite la nueva contraseña"
            icon={
              <button
                type="button"
                className="password-toggle"
                onClick={() => toggleMostrarContrasena('confirmar_contrasena')}
              >
                {mostrarContrasenas.confirmar_contrasena ? '🙈' : '👁️'}
              </button>
            }
          />

          <div className="password-strength">
            <div className={`strength-bar ${passwordStrength}`}>
              <div className="strength-fill"></div>
            </div>
            <span className="strength-text">
              {passwordStrength === 'strong' ? 'Contraseña segura' : 'Contraseña débil'}
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