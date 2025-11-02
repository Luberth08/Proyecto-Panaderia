// src/components/ui/Form/DetalleCompraProductoForm.jsx
import { useEffect, useState } from 'react';
import { useForm } from '../../../hooks/useForm';
import { productoAPI } from '../../../api/api';
import { useApi } from '../../../hooks/useApi';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormRow from './FormRow';

const DetalleCompraProductoForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [productos, setProductos] = useState([]);
  const { execute: loadProductos } = useApi(() => productoAPI.getAll(), true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadProductos();
      setProductos(data);
    };
    fetchData();
  }, []);

  const { form, handleChange, validateForm } = useForm(initialData, {
    id_producto: { required: true },
    cantidad: { required: true },
    precio: { required: true }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const total = Number(form.cantidad) * Number(form.precio);
      onSubmit({ ...form, total });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <FormRow>
        <FormSelect
          label="Producto"
          name="id_producto"
          value={form.id_producto}
          onChange={handleChange}
          options={productos.map(p => ({ value: p.id, label: p.nombre }))}
          placeholder="Seleccionar producto"
          required
          disabled={isEditing}
        />
        <FormInput
          label="Cantidad"
          name="cantidad"
          type="number"
          value={form.cantidad}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Precio"
          name="precio"
          type="number"
          value={form.precio}
          onChange={handleChange}
          required
        />
      </FormRow>

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {isEditing ? 'Actualizar' : 'Agregar'} Producto
        </button>
      </div>
    </form>
  );
};

export default DetalleCompraProductoForm;
