import { useState, useEffect } from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormRow from './FormRow';
import { useForm } from '../../../hooks/useForm';
import { insumoAPI } from '../../../api/api';

export default function DetalleRecetaForm({ initialData, onSubmit, onCancel, isEditing }) {
  const [insumos, setInsumos] = useState([]);

  useEffect(() => {
    const fetchInsumos = async () => {
      const data = await insumoAPI.getAll();
      setInsumos(data);
    };
    fetchInsumos();
  }, []);

  const { form, handleChange, validateForm } = useForm(initialData, {
    id_insumo: { required: true },
    cantidad: { required: true },
    medida: { required: true }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <FormSelect
        label="Insumo"
        name="id_insumo"
        value={form.id_insumo}
        onChange={handleChange}
        options={insumos.map(i => ({ value: i.id, label: i.nombre }))}
        placeholder="Seleccionar insumo"
        required
      />

      <FormRow>
        <FormInput
          label="Cantidad"
          name="cantidad"
          value={form.cantidad}
          onChange={handleChange}
          type="number"
          min="1"
          required
        />

        <FormInput
          label="Medida"
          name="medida"
          value={form.medida}
          onChange={handleChange}
          placeholder="Ej: kg, lt"
          required
        />
      </FormRow>

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">
          {isEditing ? 'Actualizar' : 'Agregar'} Insumo
        </button>
      </div>
    </form>
  );
}
