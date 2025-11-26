import { clienteAPI } from '../../api/api';
import CRUDPage from '../../components/common/CRUDPage';
import FormInput from '../../components/ui/Form/FormInput';
import FormSelect from '../../components/ui/Form/FormSelect';
import { useForm } from '../../hooks/useForm';

// Componente de formulario para Cliente
const ClienteForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const { form, handleChange, validateForm } = useForm(initialData, {
    ci: { required: true },
    nombre: { required: true },
    sexo: { required: true },
    telefono: { required: true }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <FormInput
        label="Cédula de Identidad"
        name="ci"
        value={form.ci}
        onChange={handleChange}
        placeholder="Ej: 12345678"
        disabled={isEditing}
        required
      />

      <FormInput
        label="Nombre del Cliente"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Ej: Juan Pérez"
        required
      />

      <FormSelect
        label="Sexo"
        name="sexo"
        value={form.sexo}
        onChange={handleChange}
        options={[
          { value: 'M', label: 'Masculino' },
          { value: 'F', label: 'Femenino' }
        ]}
        required
      />

      <FormInput
        label="Teléfono"
        name="telefono"
        value={form.telefono}
        onChange={handleChange}
        placeholder="Ej: 71234567"
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

// Configuración de columnas
const clienteColumns = [
  {
    key: 'ci',
    title: 'Cédula',
    width: '120px'
  },
  {
    key: 'nombre',
    title: 'Nombre',
  },
  {
    key: 'sexo',
    title: 'Sexo',
    width: '80px',
    render: (cliente) => cliente.sexo === 'M' ? 'Masculino' : 'Femenino'
  },
  {
    key: 'telefono',
    title: 'Teléfono',
    width: '120px'
  }
];

// Estado inicial
const initialFormState = {
  ci: '',
  nombre: '',
  sexo: '',
  telefono: ''
};

// Componente principal
export default function Cliente() {
  return (
    <CRUDPage
      title="Clientes"
      description="Administra los clientes del sistema"
      api={clienteAPI}
      columns={clienteColumns}
      FormComponent={ClienteForm}
      initialFormState={initialFormState}
      searchFields={['nombre', 'ci']}
      primaryKey="ci"
    />
  );
}
