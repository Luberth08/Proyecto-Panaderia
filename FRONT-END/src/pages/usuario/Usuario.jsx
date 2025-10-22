// src/pages/usuario/Usuario.jsx
import { useState, useEffect } from 'react';
import { usuarioAPI, rolAPI } from '../../api/api';
import CRUDPage from '../../components/common/CRUDPage';
import FormInput from '../../components/ui/Form/FormInput';
import FormSelect from '../../components/ui/Form/FormSelect';
import FormRow from '../../components/ui/Form/FormRow';
import { useForm } from '../../hooks/useForm'; // ✅ CORREGIDO: con llaves
import { useApi } from '../../hooks/useApi';
import { GENERO_OPCIONES } from '../../utils/constants';
import '../../styles/usuario/Usuario.css';

// Componente de formulario para Usuario
const UsuarioForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [roles, setRoles] = useState([]);
  const { execute: loadRoles } = useApi(() => rolAPI.getAll(), true);

  useEffect(() => {
    const fetchRoles = async () => {
      const data = await loadRoles();
      setRoles(data);
    };
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { form, handleChange, validateForm } = useForm(initialData, {
    nombre: { 
      required: true,
      pattern: /^[a-zA-Z0-9_]{3,20}$/,
      message: 'Solo letras, números y guiones bajos (3-20 caracteres)'
    },
    email: { 
      required: true, 
      pattern: /^\S+@\S+\.\S+$/, 
      message: 'El formato de email es inválido' 
    },
    id_rol: { required: true }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Si estamos editando y no se cambió la contraseña, no la enviemos
      const dataToSubmit = { ...form };
      if (isEditing && !dataToSubmit.contrasena) {
        delete dataToSubmit.contrasena;
      }
      onSubmit(dataToSubmit);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form usuario-form">
      <FormRow>
        <FormInput
          label="Nombre de usuario"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          disabled={isEditing}
          placeholder="Usuario único"
        />

        <FormInput
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
          placeholder="usuario@email.com"
        />
      </FormRow>

      <FormRow>
        <FormInput
          label={isEditing ? "Nueva Contraseña (opcional)" : "Contraseña"}
          name="contrasena"
          value={form.contrasena}
          onChange={handleChange}
          type="password"
          required={!isEditing}
          minLength="6"
          placeholder={isEditing ? "Dejar vacío para mantener" : "Mínimo 6 caracteres"}
        />

        <FormSelect
          label="Rol"
          name="id_rol"
          value={form.id_rol}
          onChange={handleChange}
          options={roles.map(rol => ({ value: rol.id, label: rol.nombre }))}
          placeholder="Seleccionar rol"
          required
        />
      </FormRow>

      <FormRow>
        <FormSelect
          label="Sexo"
          name="sexo"
          value={form.sexo}
          onChange={handleChange}
          options={GENERO_OPCIONES}
          placeholder="No especificado"
        />

        <FormInput
          label="Teléfono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          type="tel"
          placeholder="Número de teléfono"
        />
      </FormRow>

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {isEditing ? 'Actualizar' : 'Crear'} Usuario
        </button>
      </div>
    </form>
  );
};

// Configuración de columnas
const usuarioColumns = [
  {
    key: 'nombre',
    title: 'Nombre',
    render: (usuario) => usuario.nombre
  },
  {
    key: 'email',
    title: 'Email',
    render: (usuario) => usuario.email
  },
  {
    key: 'sexo',
    title: 'Sexo',
    render: (usuario) => {
      const sexoText = usuario.sexo === 'M' ? '👨 Masculino' : 
                       usuario.sexo === 'F' ? '👩 Femenino' : 'No especificado';
      return <span className="usuario-sexo">{sexoText}</span>;
    }
  },
  {
    key: 'telefono',
    title: 'Teléfono',
    render: (usuario) => (
      <span className="usuario-telefono">
        {usuario.telefono || 'No especificado'}
      </span>
    )
  },
  {
    key: 'id_rol',
    title: 'Rol',
    render: (usuario) => (
      <span className="rol-badge">{usuario.id_rol}</span>
    )
  }
];

// Estado inicial
const initialFormState = {
  nombre: '',
  email: '',
  contrasena: '',
  sexo: '',
  telefono: '',
  id_rol: ''
};

// Componente principal
export default function Usuario() {
  return (
    <CRUDPage
      title="Usuarios"
      description="Administra los usuarios del sistema"
      api={usuarioAPI}
      columns={usuarioColumns}
      FormComponent={UsuarioForm}
      initialFormState={initialFormState}
      searchFields={['nombre', 'email']}
      rowKey="nombre"
    />
  );
}