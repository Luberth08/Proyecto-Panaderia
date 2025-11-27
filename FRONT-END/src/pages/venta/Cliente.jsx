// src/pages/venta/Cliente.jsx
import { clienteAPI } from '../../api/api';
import CRUDPage from '../../components/common/CRUDPage';
import FormInput from '../../components/ui/Form/FormInput';
import { useForm } from '../../hooks/useForm';

// ------------------------------------------------------
// Formulario del cliente
// ------------------------------------------------------
const ClienteForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const { form, handleChange, validateForm } = useForm(initialData, {
    ci: {
      required: true,
      pattern: /^[0-9]{1,10}$/,
      message: 'El CI debe tener entre 1 y 10 dígitos numéricos'
    },
    nombre: {
      required: true,
      pattern: /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{3,40}$/,
      message: 'Solo letras y espacios (3 a 40 caracteres)'
    },
    sexo: {
      required: true,
      pattern: /^[MF]$/,
      message: 'Solo M o F'
    },
    telefono: {
      required: true,
      pattern: /^[0-9]{1,10}$/,
      message: 'Teléfono entre 7 y 10 dígitos'
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form cliente-form">

      <FormInput
        label="CI"
        name="ci"
        value={form.ci}
        onChange={handleChange}
        placeholder="Ej: 7894561"
        required
        disabled={isEditing} // El CI no cambia
      />

      <FormInput
        label="Nombre"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Ej: Juan Pérez"
        required
      />

      <div className="form-group">
        <label>Sexo</label>
        <select
          name="sexo"
          value={form.sexo}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione...</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
      </div>

      <FormInput
        label="Teléfono"
        name="telefono"
        value={form.telefono}
        onChange={handleChange}
        placeholder="Ej: 76543210"
        required
      />

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>

        <button type="submit" className="btn-primary">
          {isEditing ? 'Actualizar' : 'Crear'} Cliente
        </button>
      </div>
    </form>
  );
};

// ------------------------------------------------------
// Columnas de la tabla
// ------------------------------------------------------
const clienteColumns = [
  { key: 'ci', title: 'CI', width: '120px' },
  {
    key: 'nombre',
    title: 'Nombre',
    render: (c) => <span className="cliente-nombre">{c.nombre}</span>
  },
  {
    key: 'sexo',
    title: 'Sexo',
    width: '90px',
    render: (c) => (
      <span className={`cliente-sexo sexo-${c.sexo}`}>
        {c.sexo === 'M' ? 'Masculino' : 'Femenino'}
      </span>
    )
  },
  {
    key: 'telefono',
    title: 'Teléfono',
    width: '120px'
  }
];

// ------------------------------------------------------
// Estado inicial del formulario
// ------------------------------------------------------
const initialFormState = {
  ci: '',
  nombre: '',
  sexo: '',
  telefono: ''
};

// ------------------------------------------------------
// Página principal del CRUD
// ------------------------------------------------------
export default function Cliente() {
  return (
    <CRUDPage
      title="Clientes"
      description="Administración de clientes"
      api={clienteAPI}
      columns={clienteColumns}
      FormComponent={ClienteForm}
      initialFormState={initialFormState}
      searchFields={['ci', 'nombre']}
      rowKey="ci" 
    />
  );
}
