// src/components/ui/Form/DetalleCompraInsumoForm.jsx
import { useEffect, useState } from 'react';
import { useForm } from '../../../hooks/useForm';
import { insumoAPI } from '../../../api/api';
import { useApi } from '../../../hooks/useApi';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormRow from './FormRow';

const DetalleCompraInsumoForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [insumos, setInsumos] = useState([]);
  const { execute: loadInsumos } = useApi(() => insumoAPI.getAll(), true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadInsumos();
      setInsumos(data);
    };
    fetchData();
  }, []);

  const { form, handleChange, validateForm } = useForm(initialData, {
    id_insumo: { required: true },
    cantidad: { required: true },
    precio: { required: true }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Calculamos el total
      const total = Number(form.cantidad) * Number(form.precio);
      onSubmit({ ...form, total });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <FormRow>
        <FormSelect
          label="Insumo"
          name="id_insumo"
          value={form.id_insumo}
          onChange={handleChange}
          options={insumos.map(i => ({ value: i.id, label: i.nombre }))}
          placeholder="Seleccionar insumo"
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
          {isEditing ? 'Actualizar' : 'Agregar'} Insumo
        </button>
      </div>
    </form>
  );
};

export default DetalleCompraInsumoForm;
