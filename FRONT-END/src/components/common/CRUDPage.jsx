// src/components/common/CRUDPage.jsx
import { useEffect } from 'react';
import { useCRUD } from '../../hooks/useApi';
import { useModal, useConfirmModal } from '../../hooks/useModal';
import { useCRUDSearch } from '../../hooks/useSearch';
import PageHeader from '../ui/PageHeader';
import SearchBar from '../ui/SearchBar';
import DataTable from '../ui/Table/DataTable';
import Modal from '../ui/Modal/Modal';
import ConfirmModal from '../ui/Modal/ConfirmModal';
import LoadingSpinner from '../ui/LoadingSpinner';
import './CRUDPage.css';

const CRUDPage = ({
  // Configuración básica
  title,
  description,
  
  // Configuración de API
  api,
  
  // Configuración de tabla
  columns,
  rowKey = 'id',
  
  // Configuración de formulario
  FormComponent, // ✅ Cambiado a FormComponent (con mayúscula)
  initialFormState,
  formValidations = {},
  
  // Configuración de búsqueda
  searchFields = ['nombre'],
  searchPlaceholder,
  
  // Personalización
  renderHeaderAction,
  onRowClick,
  transformData,
  customActions
}) => {
  // Hooks para estado CRUD
  const { 
    items, 
    loading, 
    error, 
    fetchAll, 
    create, 
    update, 
    remove 
  } = useCRUD(api);

  // Hook para búsqueda
  const { 
    searchTerm, 
    filteredData, 
    handleSearch, 
    noResultsMessage 
  } = useCRUDSearch(items, searchFields);

  // Hooks para modales
  const { 
    isOpen: showModal, 
    openModal, 
    closeModal, 
    modalData: editingItem 
  } = useModal();

  const { 
    isOpen: showDeleteModal, 
    openConfirmModal, 
    closeConfirmModal, 
    handleConfirm,
    itemToDelete 
  } = useConfirmModal();

  // Cargar datos al montar
  useEffect(() => {
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Transformar datos si es necesario
  const displayData = transformData ? transformData(filteredData) : filteredData;

  // Manejar creación/actualización
  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await update(editingItem[rowKey], formData);
      } else {
        await create(formData);
      }
      closeModal();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  // Manejar eliminación
  const handleDelete = async (item) => {
    await remove(item[rowKey]);
  };

  // Abrir modal para editar
  const handleEdit = (item) => {
    openModal(item);
  };

  // Abrir modal para crear
  const handleCreate = () => {
    openModal();
  };

  // Acción por defecto del header
  const defaultHeaderAction = (
    <button className="btn-primary" onClick={handleCreate}>
      + Nuevo {title}
    </button>
  );

  // Renderizar acciones personalizadas o por defecto
  const renderActions = (item) => {
    if (customActions) {
      return customActions(item, { handleEdit, openConfirmModal });
    }

    return (
      <div className="table-actions">
        <button 
          className="btn-editar"
          onClick={() => handleEdit(item)}
        >
          ✏️ Editar
        </button>
        <button 
          className="btn-eliminar"
          onClick={() => openConfirmModal(item, handleDelete)}
        >
          🗑️ Eliminar
        </button>
      </div>
    );
  };

  // Columnas con acciones
  const tableColumns = [
    ...columns,
    {
      key: 'actions',
      title: 'Acciones',
      width: '200px',
      render: (item) => renderActions(item)
    }
  ];

  if (loading && items.length === 0) {
    return (
      <div className="crud-page">
        <PageHeader title={title} description={description} />
        <LoadingSpinner text={`Cargando ${title.toLowerCase()}...`} />
      </div>
    );
  }

  return (
    <div className="crud-page">
      {/* Header */}
      <PageHeader
        title={title}
        description={description}
        actionButton={renderHeaderAction ? renderHeaderAction(handleCreate) : defaultHeaderAction}
      />

      {/* Barra de búsqueda */}
      <div className="search-section">
        <SearchBar
          placeholder={searchPlaceholder || `Buscar ${title.toLowerCase()}...`}
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Tabla de datos */}
      <DataTable
        columns={tableColumns}
        data={displayData}
        loading={loading}
        emptyMessage={noResultsMessage}
        onRowClick={onRowClick}
        rowKey={rowKey}
      />

      {/* Modal de formulario */}
      {FormComponent && (
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title={editingItem ? `Editar ${title}` : `Nuevo ${title}`}
          size="medium"
        >
          <FormComponent
            initialData={editingItem || initialFormState}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            isEditing={!!editingItem}
            validations={formValidations}
          />
        </Modal>
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={closeConfirmModal}
        onConfirm={handleConfirm}
        itemName={itemToDelete?.nombre}
        message={`¿Estás seguro de que deseas eliminar este ${title.toLowerCase()}?`}
      />
    </div>
  );
};

export default CRUDPage;