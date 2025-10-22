// src/pages/usuario/Permiso.jsx
import { permisoAPI } from '../../api/api';
import CRUDPage from '../../components/common/CRUDPage';
import FormInput from '../../components/ui/Form/FormInput';
import { useForm } from '../../hooks/useForm'; // ✅ CORREGIDO: con llaves
import '../../styles/usuario/Permiso.css';

// Componente de formulario para Permiso
const PermisoForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const { form, handleChange, validateForm } = useForm(initialData, {
    nombre: { 
      required: true,
      pattern: /^[A-Z_]+$/,
      message: 'Solo letras mayúsculas y guiones bajos'
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form permiso-form">
      <FormInput
        label="Nombre del permiso"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Ej: CREAR_USUARIO, VER_USUARIO"
        required
        pattern="[A-Z_]+"
        title="Solo letras mayúsculas y guiones bajos"
      />
      <small className="format-hint">Formato: SOLO_MAYUSCULAS_CON_GUIONES_BAJOS</small>

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {isEditing ? 'Actualizar' : 'Crear'} Permiso
        </button>
      </div>
    </form>
  );
};

// Configuración de columnas
const permisoColumns = [
  {
    key: 'id',
    title: 'ID',
    width: '80px'
  },
  {
    key: 'nombre',
    title: 'Nombre',
    render: (permiso) => (
      <span className="permiso-nombre">{permiso.nombre}</span>
    )
  }
];

// Estado inicial
const initialFormState = {
  nombre: ''
};

// Componente principal
export default function Permiso() {
  return (
    <CRUDPage
      title="Permisos"
      description="Administra los permisos del sistema"
      api={permisoAPI}
      columns={permisoColumns}
      FormComponent={PermisoForm}
      initialFormState={initialFormState}
      searchFields={['nombre']}
    />
  );
}