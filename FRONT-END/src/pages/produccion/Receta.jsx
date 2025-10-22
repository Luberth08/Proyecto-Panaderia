// src/pages/produccion/Receta.jsx
import { useState, useEffect } from 'react';
import { recetaAPI, productoAPI } from '../../api/api';
import CRUDPage from '../../components/common/CRUDPage';
import FormInput from '../../components/ui/Form/FormInput';
import FormSelect from '../../components/ui/Form/FormSelect';
import FormRow from '../../components/ui/Form/FormRow';
import { useForm } from '../../hooks/useForm'; // ✅ CORREGIDO: con llaves
import { useApi } from '../../hooks/useApi';
import '../../styles/produccion/Receta.css';

// Componente de formulario para Receta
const RecetaForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [productos, setProductos] = useState([]);
  const { execute: loadProductos } = useApi(() => productoAPI.getAll(), true);

  useEffect(() => {
    const fetchProductos = async () => {
      const data = await loadProductos();
      setProductos(data);
    };
    fetchProductos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { form, handleChange, validateForm } = useForm(initialData, {
    unidades: { required: true },
    tiempo: { required: true },
    id_producto: { required: true }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formattedData = {
        ...form,
        unidades: parseInt(form.unidades),
        tiempo: parseInt(form.tiempo),
        id_producto: parseInt(form.id_producto)
      };
      onSubmit(formattedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <FormSelect
        label="Producto"
        name="id_producto"
        value={form.id_producto}
        onChange={handleChange}
        options={productos.map(prod => ({ value: prod.id, label: prod.nombre }))}
        placeholder="Seleccionar producto"
        required
      />

      <FormRow>
        <FormInput
          label="Unidades por lote"
          name="unidades"
          value={form.unidades}
          onChange={handleChange}
          type="number"
          min="1"
          placeholder="Ej: 10"
          required
        />

        <FormInput
          label="Tiempo de producción (minutos)"
          name="tiempo"
          value={form.tiempo}
          onChange={handleChange}
          type="number"
          min="1"
          placeholder="Ej: 30"
          required
        />
      </FormRow>

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {isEditing ? 'Actualizar' : 'Crear'} Receta
        </button>
      </div>
    </form>
  );
};

// Configuración de columnas
const recetaColumns = [
  {
    key: 'id',
    title: 'ID',
    width: '80px'
  },
  {
    key: 'producto',
    title: 'Producto',
    render: (receta) => (
      <span className="receta-producto">{receta.producto}</span>
    )
  },
  {
    key: 'unidades',
    title: 'Unidades',
    render: (receta) => (
      <span className="receta-unidades">{receta.unidades}</span>
    )
  },
  {
    key: 'tiempo',
    title: 'Tiempo (min)',
    render: (receta) => (
      <span className="receta-tiempo">{receta.tiempo} min</span>
    )
  }
];

// Estado inicial
const initialFormState = {
  unidades: '',
  tiempo: '',
  id_producto: ''
};

// Componente principal
export default function Receta() {
  return (
    <CRUDPage
      title="Recetas"
      description="Administra las recetas de producción"
      api={recetaAPI}
      columns={recetaColumns}
      FormComponent={RecetaForm}
      initialFormState={initialFormState}
      searchFields={['producto']}
    />
  );
}