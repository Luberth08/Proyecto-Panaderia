// src/pages/produccion/Receta.jsx
import { useState, useEffect } from 'react';
import { recetaAPI, productoAPI, detalleRecetaAPI } from '../../api/api';
import CRUDPage from '../../components/common/CRUDPage';
import FormInput from '../../components/ui/Form/FormInput';
import FormSelect from '../../components/ui/Form/FormSelect';
import FormRow from '../../components/ui/Form/FormRow';
import { useForm } from '../../hooks/useForm';
import { useApi } from '../../hooks/useApi';
import Modal from '../../components/ui/Modal/Modal';
import DetalleRecetaForm from '../../components/ui/Form/DetalleRecetaForm';
import '../../styles/produccion/Receta.css';

// ----------------------------
// Formulario de Receta
// ----------------------------
const RecetaForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [productos, setProductos] = useState([]);
  const { execute: loadProductos } = useApi(() => productoAPI.getAll(), true);

  useEffect(() => {
    const fetchProductos = async () => {
      const data = await loadProductos();
      setProductos(data);
    };
    fetchProductos();
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

// ----------------------------
// Configuración de columnas de Receta
// ----------------------------
const recetaColumns = (onVerInsumos) => [
  { key: 'id', title: 'ID', width: '80px' },
  { key: 'producto', title: 'Producto', render: r => <span>{r.producto}</span> },
  { key: 'unidades', title: 'Unidades', render: r => <span>{r.unidades}</span> },
  { key: 'tiempo', title: 'Tiempo (min)', render: r => <span>{r.tiempo} min</span> },
  {
    key: 'acciones',
    title: 'Acciones',
    render: r => (
      <button className="btn-secondary btn-sm" onClick={() => onVerInsumos(r)}>
        Ver Insumos
      </button>
    )
  }
];

// ----------------------------
// Estado inicial de formulario
// ----------------------------
const initialFormState = { unidades: '', tiempo: '', id_producto: '' };

// ----------------------------
// Componente principal
// ----------------------------
export default function Receta() {
  const [showInsumosModal, setShowInsumosModal] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [detalleData, setDetalleData] = useState([]);

  const { execute: loadDetalleReceta } = useApi(() => detalleRecetaAPI.getAll(), true);

  // Abrir modal de insumos filtrando por receta
  const handleVerInsumos = async (receta) => {
    const allDetalle = await loadDetalleReceta();
    const filtered = allDetalle.filter(d => d.id_receta === receta.id);
    setDetalleData(filtered);
    setRecetaSeleccionada(receta);
    setShowInsumosModal(true);
  };

  return (
    <>
      <CRUDPage
        title="Recetas"
        description="Administra las recetas de producción"
        api={recetaAPI}
        columns={recetaColumns(handleVerInsumos)}
        FormComponent={RecetaForm}
        initialFormState={initialFormState}
        searchFields={['producto']}
      />

      {/* Modal de Insumos */}
      {showInsumosModal && recetaSeleccionada && (
        <Modal
          isOpen={showInsumosModal}
          onClose={() => setShowInsumosModal(false)}
          title={`Insumos de ${recetaSeleccionada.producto}`}
          size="large"
        >
          <CRUDPage
            title={`Insumos`}
            api={{ getAll: () => Promise.resolve(detalleData) }} // Pasamos los datos filtrados
            columns={[
              { key: 'insumo', title: 'Insumo', render: d => d.insumo },
              { key: 'cantidad', title: 'Cantidad', render: d => d.cantidad },
              { key: 'medida', title: 'Medida', render: d => d.medida }
            ]}
            FormComponent={DetalleRecetaForm}
            initialFormState={{
              id_receta: recetaSeleccionada.id,
              id_insumo: '',
              cantidad: '',
              medida: ''
            }}
            parentId={recetaSeleccionada.id}
            searchFields={['insumo']}
          />
        </Modal>
      )}
    </>
  );
}
