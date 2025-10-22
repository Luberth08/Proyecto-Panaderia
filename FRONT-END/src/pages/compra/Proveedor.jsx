// src/pages/compra/Proveedor.jsx
import { proveedorAPI } from '../../api/api';
import CRUDPage from '../../components/common/CRUDPage';
import FormInput from '../../components/ui/Form/FormInput';
import FormSelect from '../../components/ui/Form/FormSelect';
import FormRow from '../../components/ui/Form/FormRow';
import StatusBadge from '../../components/common/StatusBadge';
import { GENERO_OPCIONES } from '../../utils/constants';
import { useForm } from '../../hooks/useForm'; // ✅ CORREGIDO: con llaves

// Componente de formulario para Proveedor
const ProveedorForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const { form, handleChange, validateForm } = useForm(initialData, {
    codigo: { required: true },
    nombre: { required: true },
    empresa: { required: true }
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
        label="Código"
        name="codigo"
        value={form.codigo}
        onChange={handleChange}
        placeholder="Código único del proveedor"
        required
        disabled={isEditing}
      />

      <FormInput
        label="Nombre"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre del proveedor"
        required
      />

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
          placeholder="Número de teléfono"
          type="tel"
        />
      </FormRow>

      <FormInput
        label="Empresa"
        name="empresa"
        value={form.empresa}
        onChange={handleChange}
        placeholder="Nombre de la empresa"
        required
      />

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="estado"
            checked={form.estado}
            onChange={handleChange}
          />
          <span className="checkmark"></span>
          Proveedor activo
        </label>
      </div>

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {isEditing ? 'Actualizar' : 'Crear'} Proveedor
        </button>
      </div>
    </form>
  );
};

// Configuración de columnas para la tabla
const proveedorColumns = [
  {
    key: 'codigo',
    title: 'Código',
    width: '120px',
    render: (proveedor) => (
      <span className="proveedor-codigo">{proveedor.codigo}</span>
    )
  },
  {
    key: 'nombre',
    title: 'Nombre',
    render: (proveedor) => proveedor.nombre
  },
  {
    key: 'sexo',
    title: 'Sexo',
    render: (proveedor) => {
      const sexoText = proveedor.sexo === 'M' ? '👨 Masculino' : 
                       proveedor.sexo === 'F' ? '👩 Femenino' : 'No especificado';
      return <span className="proveedor-sexo">{sexoText}</span>;
    }
  },
  {
    key: 'telefono',
    title: 'Teléfono',
    render: (proveedor) => (
      <span className="proveedor-telefono">
        {proveedor.telefono || 'No especificado'}
      </span>
    )
  },
  {
    key: 'empresa',
    title: 'Empresa',
    render: (proveedor) => (
      <span className="proveedor-empresa">
        {proveedor.empresa || 'No especificado'}
      </span>
    )
  },
  {
    key: 'estado',
    title: 'Estado',
    render: (proveedor) => (
      <StatusBadge 
        status={proveedor.estado} 
        text={proveedor.estado === 'ACTIVOP' ? 'Activo' : 'Inactivo'}
      />
    )
  }
];

// Estado inicial del formulario
const initialFormState = {
  codigo: '',
  nombre: '',
  sexo: '',
  telefono: '',
  estado: true,
  empresa: ''
};

// Componente principal refactorizado
export default function Proveedor() {
  return (
    <CRUDPage
      title="Proveedores"
      description="Administra los proveedores del sistema"
      api={proveedorAPI}
      columns={proveedorColumns}
      FormComponent={ProveedorForm}
      initialFormState={initialFormState}
      searchFields={['codigo', 'nombre', 'empresa']}
      searchPlaceholder="Buscar por código, nombre o empresa..."
      rowKey="codigo"
    />
  );
}