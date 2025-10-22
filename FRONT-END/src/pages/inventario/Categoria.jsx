// src/pages/inventario/Categoria.jsx
import { categoriaAPI } from '../../api/api';
import CRUDPage from '../../components/common/CRUDPage';
import FormInput from '../../components/ui/Form/FormInput';
import { useForm } from '../../hooks/useForm'; // ✅ CORREGIDO: con llaves

// Componente de formulario para Categoría
const CategoriaForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const { form, handleChange, validateForm } = useForm(initialData, {
    nombre: { required: true }
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
        label="Nombre de la categoría"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Ej: Panadería, Bebidas, Limpieza"
        required
      />

      <FormInput
        label="Descripción"
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        placeholder="Descripción opcional de la categoría"
        type="textarea"
      />

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {isEditing ? 'Actualizar' : 'Crear'} Categoría
        </button>
      </div>
    </form>
  );
};

// Configuración de columnas
const categoriaColumns = [
  {
    key: 'id',
    title: 'ID',
    width: '80px'
  },
  {
    key: 'nombre',
    title: 'Nombre',
    render: (categoria) => (
      <span className="categoria-nombre">{categoria.nombre}</span>
    )
  },
  {
    key: 'descripcion',
    title: 'Descripción',
    render: (categoria) => (
      <span className="categoria-descripcion">
        {categoria.descripcion || 'Sin descripción'}
      </span>
    )
  }
];

// Estado inicial
const initialFormState = {
  nombre: '',
  descripcion: ''
};

// Componente principal
export default function Categoria() {
  return (
    <CRUDPage
      title="Categorías"
      description="Administra las categorías del inventario"
      api={categoriaAPI}
      columns={categoriaColumns}
      FormComponent={CategoriaForm}
      initialFormState={initialFormState}
      searchFields={['nombre', 'descripcion']}
    />
  );
}