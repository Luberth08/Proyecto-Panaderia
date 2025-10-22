// src/pages/inventario/Producto.jsx
import { useState, useEffect } from 'react';
import { productoAPI, categoriaAPI } from '../../api/api';
import CRUDPage from '../../components/common/CRUDPage';
import FormInput from '../../components/ui/Form/FormInput';
import FormSelect from '../../components/ui/Form/FormSelect';
import FormRow from '../../components/ui/Form/FormRow';
import StatusBadge from '../../components/common/StatusBadge';
import { useForm } from '../../hooks/useForm'; // ✅ CORREGIDO: con llaves
import { useApi } from '../../hooks/useApi';
import { isStockBajo } from '../../utils/helpers';
import '../../styles/inventario/Producto.css';

// Componente de formulario para Producto
const ProductoForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [categorias, setCategorias] = useState([]);
  const { execute: loadCategorias } = useApi(() => categoriaAPI.getAll(), true);

  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await loadCategorias();
      setCategorias(data);
    };
    fetchCategorias();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { form, handleChange, validateForm } = useForm(initialData, {
    nombre: { required: true },
    precio: { required: true },
    stock: { required: true },
    stock_minimo: { required: true },
    id_categoria: { required: true }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formattedData = {
        ...form,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
        stock_minimo: parseInt(form.stock_minimo),
        id_categoria: parseInt(form.id_categoria)
      };
      onSubmit(formattedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <FormInput
        label="Nombre del producto"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Ej: Pan Francés, Café Americano"
        required
      />

      <FormInput
        label="Precio de venta"
        name="precio"
        value={form.precio}
        onChange={handleChange}
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
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

      <FormSelect
        label="Categoría"
        name="id_categoria"
        value={form.id_categoria}
        onChange={handleChange}
        options={categorias.map(cat => ({ value: cat.id, label: cat.nombre }))}
        placeholder="Seleccionar categoría"
        required
      />

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {isEditing ? 'Actualizar' : 'Crear'} Producto
        </button>
      </div>
    </form>
  );
};

// Configuración de columnas
const productoColumns = [
  {
    key: 'id',
    title: 'ID',
    width: '80px'
  },
  {
    key: 'nombre',
    title: 'Nombre',
    render: (producto) => (
      <span className="producto-nombre">{producto.nombre}</span>
    )
  },
  {
    key: 'precio',
    title: 'Precio',
    render: (producto) => (
      <span className="producto-precio">
        Bs.{parseFloat(producto.precio).toFixed(2)}
      </span>
    )
  },
  {
    key: 'stock',
    title: 'Stock',
    render: (producto) => (
      <StatusBadge 
        status={isStockBajo(producto.stock, producto.stock_minimo) ? 'bajo' : 'normal'}
        text={producto.stock.toString()}
      />
    )
  },
  {
    key: 'stock_minimo',
    title: 'Stock Mínimo',
    render: (producto) => producto.stock_minimo
  },
  {
    key: 'categoria',
    title: 'Categoría',
    render: (producto) => (
      <span className="producto-categoria">{producto.categoria}</span>
    )
  }
];

// Estado inicial
const initialFormState = {
  nombre: '',
  precio: '',
  stock: '',
  stock_minimo: '',
  id_categoria: ''
};

// Componente principal
export default function Producto() {
  return (
    <CRUDPage
      title="Productos"
      description="Administra los productos del inventario"
      api={productoAPI}
      columns={productoColumns}
      FormComponent={ProductoForm}
      initialFormState={initialFormState}
      searchFields={['nombre', 'categoria']}
    />
  );
}