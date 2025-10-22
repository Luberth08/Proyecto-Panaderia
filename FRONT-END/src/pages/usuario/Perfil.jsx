// src/pages/usuario/Perfil.jsx
import { useState, useEffect } from 'react';
import { perfilAPI } from '../../api/api';
import { useForm } from '../../hooks/useForm'; // ✅ CORREGIDO: con llaves
import { useApi } from '../../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/ui/Form/FormInput';
import FormSelect from '../../components/ui/Form/FormSelect';
import FormRow from '../../components/ui/Form/FormRow';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { GENERO_OPCIONES } from '../../utils/constants';
import '../../styles/usuario/Perfil.css';

export default function Perfil() {
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Usar hook useApi para cargar el perfil
  const { data: userData, loading: userLoading, execute: loadUser } = useApi(
    () => perfilAPI.getPerfil(),
    true // cargar inmediatamente
  );

  // Usar hook useForm para manejar el formulario
  const { form, handleChange, setFormData, validateForm } = useForm(
    {
      nombre: '',
      email: '',
      sexo: '',
      telefono: ''
    },
    {
      nombre: { required: true },
      email: { 
        required: true, 
        pattern: /^\S+@\S+\.\S+$/, 
        message: 'El formato de email es inválido' 
      }
    }
  );

  // Actualizar formulario cuando se cargan los datos del usuario
  useEffect(() => {
    if (userData?.user) {
      setFormData(userData.user);
    }
  }, [userData, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await perfilAPI.updatePerfil(form);
      setSuccess(response.message || 'Perfil actualizado exitosamente');
      // Recargar los datos del usuario
      await loadUser();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setSuccess('');
    }
  };

  const handleCambiarContrasena = () => {
    navigate('/cambiar-contrasena');
  };

  if (userLoading && !userData) {
    return <LoadingSpinner text="Cargando perfil..." centered />;
  }

  return (
    <div className="perfil-container">
      <PageHeader
        title="Mi Perfil"
        description="Gestiona tu información personal"
      />

      <div className="perfil-card">
        <form onSubmit={handleSubmit} className="perfil-form">
          {success && <div className="success-message">{success}</div>}

          <FormRow>
            <FormInput
              label="Nombre de usuario"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              disabled={userLoading}
              placeholder="Tu nombre de usuario"
            />

            <FormInput
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              required
              disabled={userLoading}
              placeholder="tu@email.com"
            />
          </FormRow>

          <FormRow>
            <FormSelect
              label="Sexo"
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              options={GENERO_OPCIONES}
              disabled={userLoading}
              placeholder="No especificado"
            />

            <FormInput
              label="Teléfono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              type="tel"
              disabled={userLoading}
              placeholder="Tu número de teléfono"
            />
          </FormRow>

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
              disabled={userLoading}
            >
              {userLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}