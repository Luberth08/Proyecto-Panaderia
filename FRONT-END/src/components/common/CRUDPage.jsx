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
  FormComponent,
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

  // 📌 CRUD
  const { 
    items, 
    loading, 
    error, 
    fetchAll, 
    create, 
    update, 
    remove 
  } = useCRUD(api);

  // 📌 BÚSQUEDA (optimizada con debounce interno)
  const { 
    searchTerm, 
    filteredData, 
    handleSearch, 
    noResultsMessage 
  } = useCRUDSearch(items, searchFields);

  // 📌 Modales
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

  // 📌 Cargar datos al montar
  useEffect(() => {
    fetchAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  // 📌 Transformación opcional
  const displayData = transformData ? transformData(filteredData) : filteredData;


  // 📌 Crear / actualizar
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

  // 📌 Eliminar
  const handleDelete = async (item) => {
    console.log("Eliminando cliente:", item);
    const result = await remove(item[rowKey]);
    console.log("Resultado API:", result);
  };

  // 📌 Editar
  const handleEdit = (item) => openModal(item);

  // 📌 Nuevo
  const handleCreate = () => openModal();


  // 📌 Botón por defecto del header
  const defaultHeaderAction = (
    <button className="btn-primary" onClick={handleCreate}>
      + Nuevo {title}
    </button>
  );


  // 📌 Acciones de tabla
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

  // 📌 Columnas con acciones
  const tableColumns = [
    ...columns,
    {
      key: 'actions',
      title: 'Acciones',
      width: '200px',
      render: (item) => renderActions(item)
    }
  ];

  // 📌 Loading inicial
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
      {/* Encabezado */}
      <PageHeader
        title={title}
        description={description}
        actionButton={
          renderHeaderAction 
            ? renderHeaderAction(handleCreate) 
            : defaultHeaderAction
        }
      />

      {/* Buscador */}
      <div className="search-section">
        <SearchBar
          placeholder={searchPlaceholder || `Buscar ${title.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}   // ← AHORA INSTANTÁNEO + DEBOUNCE
        />
      </div>

      {/* Errores */}
      {error && <div className="error-message">{error}</div>}

      {/* Tabla */}
      <DataTable
        columns={tableColumns}
        data={displayData}
        loading={loading}
        emptyMessage={noResultsMessage}
        onRowClick={onRowClick}
        rowKey={rowKey}
      />

      {/* Modal formulario */}
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

      {/* Modal confirmación */}
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
