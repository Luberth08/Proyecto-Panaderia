// src/pages/inventario/Insumo.jsx
import { insumoAPI } from '../../api/api';
import CRUDPage from '../../components/common/CRUDPage';
import FormInput from '../../components/ui/Form/FormInput';
import FormSelect from '../../components/ui/Form/FormSelect';
import FormRow from '../../components/ui/Form/FormRow';
import StatusBadge from '../../components/common/StatusBadge';
import { UNIDADES_MEDIDA } from '../../utils/constants';
import { useForm } from '../../hooks/useForm'; // ✅ CORREGIDO: con llaves
import { isStockBajo } from '../../utils/helpers';

// Componente de formulario para Insumo
const InsumoForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const { form, handleChange, validateForm } = useForm(initialData, {
    nombre: { required: true },
    medida: { required: true },
    stock: { required: true },
    stock_minimo: { required: true }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Convertir a números
      const formattedData = {
        ...form,
        stock: parseInt(form.stock),
        stock_minimo: parseInt(form.stock_minimo)
      };
      onSubmit(formattedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <FormInput
        label="Nombre del insumo"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Ej: Harina, Azúcar, Sal"
        required
      />

      <FormSelect
        label="Unidad de Medida"
        name="medida"
        value={form.medida}
        onChange={handleChange}
        options={UNIDADES_MEDIDA.map(medida => ({ value: medida, label: medida }))}
        placeholder="Seleccionar medida"
        required
      />

      <FormRow>
        <FormInput
          label="Stock Actual"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          type="number"
          min="0"
          required
        />

        <FormInput
          label="Stock Mínimo"
          name="stock_minimo"
          value={form.stock_minimo}
          onChange={handleChange}
          type="number"
          min="0"
          required
        />
      </FormRow>

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {isEditing ? 'Actualizar' : 'Crear'} Insumo
        </button>
      </div>
    </form>
  );
};

// Configuración de columnas
const insumoColumns = [
  {
    key: 'id',
    title: 'ID',
    width: '80px'
  },
  {
    key: 'nombre',
    title: 'Nombre',
    render: (insumo) => (
      <span className="insumo-nombre">{insumo.nombre}</span>
    )
  },
  {
    key: 'medida',
    title: 'Medida',
    render: (insumo) => (
      <span className="insumo-medida">{insumo.medida}</span>
    )
  },
  {
    key: 'stock',
    title: 'Stock',
    render: (insumo) => (
      <StatusBadge 
        status={isStockBajo(insumo.stock, insumo.stock_minimo) ? 'bajo' : 'normal'}
        text={insumo.stock.toString()}
      />
    )
  },
  {
    key: 'stock_minimo',
    title: 'Stock Mínimo',
    render: (insumo) => insumo.stock_minimo
  }
];

// Estado inicial
const initialFormState = {
  nombre: '',
  medida: '',
  stock: '',
  stock_minimo: ''
};

// Componente principal
export default function Insumo() {
  return (
    <CRUDPage
      title="Insumos"
      description="Administra los insumos del inventario"
      api={insumoAPI}
      columns={insumoColumns}
      FormComponent={InsumoForm}
      initialFormState={initialFormState}
      searchFields={['nombre']}
    />
  );
}