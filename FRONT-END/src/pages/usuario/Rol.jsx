// src/pages/usuario/Rol.jsx
import { useState, useEffect } from 'react';
import { rolAPI, permisoAPI, rolPermisoAPI } from '../../api/api';
import { useCRUD } from '../../hooks/useApi';
import { useConfirmModal, useModal } from '../../hooks/useModal';
import { useCRUDSearch } from '../../hooks/useSearch';
import PageHeader from '../../components/ui/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import DataTable from '../../components/ui/Table/DataTable';
import Modal from '../../components/ui/Modal/Modal';
import ConfirmModal from '../../components/ui/Modal/ConfirmModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FormInput from '../../components/ui/Form/FormInput';
import { useForm } from '../../hooks/useForm'; // ✅ CORREGIDO: con llaves
import '../../styles/usuario/Rol.css';

// Componente para el formulario de Rol
const RolForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
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
    <form onSubmit={handleSubmit} className="modal-form rol-form">
      <FormInput
        label="Nombre del rol"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Ej: Administrador, Cajero, Panadero"
        required
      />

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {isEditing ? 'Actualizar' : 'Crear'} Rol
        </button>
      </div>
    </form>
  );
};

// Componente para asignar permisos
const AsignarPermisosModal = ({ 
  isOpen, 
  onClose, 
  rol, 
  permisos, 
  permisosAsignados, 
  onPermisoChange, 
  onGuardar,
  loading 
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Asignar Permisos - ${rol?.nombre}`} size="large">
      <div className="permisos-modal-content">
        {loading ? (
          <LoadingSpinner text="Cargando permisos..." />
        ) : (
          <>
            <div className="permisos-list">
              <h3>Selecciona los permisos para este rol:</h3>
              
              {permisos.length === 0 ? (
                <div className="no-data">No hay permisos disponibles</div>
              ) : (
                <div className="permisos-grid">
                  {permisos.map(permiso => (
                    <label key={permiso.id} className="permiso-item">
                      <input
                        type="checkbox"
                        checked={permisosAsignados.includes(permiso.id)}
                        onChange={() => onPermisoChange(permiso.id)}
                      />
                      <span className="permiso-nombre">{permiso.nombre}</span>
                    </label>
                  ))}
                </div>
              )}
              
              <div className="selected-count">
                {permisosAsignados.length} de {permisos.length} permisos seleccionados
              </div>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={onGuardar}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Permisos'}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

// Componente principal
export default function Rol() {
  // Hooks para estado CRUD
  const { 
    items: roles, 
    loading, 
    error, 
    fetchAll, 
    create, 
    update, 
    remove 
  } = useCRUD(rolAPI);

  // Hooks para búsqueda
  const { 
    searchTerm, 
    filteredData, 
    handleSearch 
  } = useCRUDSearch(roles, ['nombre']);

  // Hooks para modales
  const { 
    isOpen: showModal, 
    openModal, 
    closeModal, 
    modalData: editingRol 
  } = useModal();

  const { 
    isOpen: showDeleteModal, 
    openConfirmModal, 
    closeConfirmModal, 
    handleConfirm,
    itemToDelete 
  } = useConfirmModal();

  // Estado para el modal de permisos
  const [showPermisosModal, setShowPermisosModal] = useState(false);
  const [rolPermisos, setRolPermisos] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [permisosAsignados, setPermisosAsignados] = useState([]);
  const [loadingPermisos, setLoadingPermisos] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejar creación/actualización
  const handleSubmit = async (formData) => {
    try {
      if (editingRol) {
        await update(editingRol.id, formData);
      } else {
        await create(formData);
      }
      closeModal();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  // Manejar eliminación
  const handleDelete = async (rol) => {
    await remove(rol.id);
  };

  // Abrir modal para editar
  const handleEdit = (rol) => {
    openModal(rol);
  };

  // Abrir modal para asignar permisos
  const handleAsignarPermisos = async (rol) => {
    setRolPermisos(rol);
    setShowPermisosModal(true);
    setLoadingPermisos(true);

    try {
      const [permisosData, rolPermisosData] = await Promise.all([
        permisoAPI.getAll(),
        rolPermisoAPI.getByRol(rol.id)
      ]);
      setPermisos(permisosData);
      setPermisosAsignados(rolPermisosData.map(rp => rp.id_permiso));
    } catch (err) {
      console.error('Error al cargar permisos:', err);
    } finally {
      setLoadingPermisos(false);
    }
  };

  // Manejar cambio de permiso
  const handlePermisoChange = (permisoId) => {
    setPermisosAsignados(prev => {
      if (prev.includes(permisoId)) {
        return prev.filter(id => id !== permisoId);
      } else {
        return [...prev, permisoId];
      }
    });
  };

  // Guardar permisos
  const handleGuardarPermisos = async () => {
    if (!rolPermisos) return;

    try {
      setLoadingPermisos(true);
      
      // Obtener permisos actuales del rol
      const permisosActuales = await rolPermisoAPI.getByRol(rolPermisos.id);
      const permisosActualesIds = permisosActuales.map(rp => rp.id_permiso);
      
      // Encontrar permisos a agregar
      const permisosAAgregar = permisosAsignados.filter(
        id => !permisosActualesIds.includes(id)
      );
      
      // Encontrar permisos a eliminar
      const permisosAEliminar = permisosActualesIds.filter(
        id => !permisosAsignados.includes(id)
      );
      
      // Ejecutar operaciones
      const operaciones = [];
      
      // Agregar nuevos permisos
      permisosAAgregar.forEach(id_permiso => {
        operaciones.push(
          rolPermisoAPI.create({
            id_rol: rolPermisos.id,
            id_permiso: id_permiso
          })
        );
      });
      
      // Eliminar permisos removidos
      permisosAEliminar.forEach(id_permiso => {
        operaciones.push(
          rolPermisoAPI.delete(rolPermisos.id, id_permiso)
        );
      });
      
      await Promise.all(operaciones);
      
      setShowPermisosModal(false);
      setRolPermisos(null);
      setPermisosAsignados([]);
      
    } catch (err) {
      console.error('Error al guardar los permisos:', err);
    } finally {
      setLoadingPermisos(false);
    }
  };

  // Configuración de columnas
  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: '80px'
    },
    {
      key: 'nombre',
      title: 'Nombre',
      render: (rol) => rol.nombre
    },
    {
      key: 'actions',
      title: 'Acciones',
      width: '250px',
      render: (rol) => (
        <div className="table-actions">
          <button 
            className="btn-editar"
            onClick={() => handleEdit(rol)}
          >
            ✏️ Editar
          </button>
          <button 
            className="btn-asignar"
            onClick={() => handleAsignarPermisos(rol)}
          >
            🔐 Permisos
          </button>
          <button 
            className="btn-eliminar"
            onClick={() => openConfirmModal(rol, handleDelete)}
          >
            🗑️ Eliminar
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="rol-page">
      <PageHeader
        title="Gestión de Roles"
        description="Administra los roles del sistema"
        actionButton={
          <button className="btn-primary" onClick={() => openModal()}>
            + Nuevo Rol
          </button>
        }
      />

      {/* Barra de búsqueda */}
      <div className="search-section">
        <SearchBar
          placeholder="Buscar por nombre..."
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
        columns={columns}
        data={filteredData}
        loading={loading}
        emptyMessage="No hay roles registrados"
      />

      {/* Modal de formulario */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingRol ? 'Editar Rol' : 'Nuevo Rol'}
        size="medium"
      >
        <RolForm
          initialData={editingRol || { nombre: '' }}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isEditing={!!editingRol}
        />
      </Modal>

      {/* Modal de asignación de permisos */}
      <AsignarPermisosModal
        isOpen={showPermisosModal}
        onClose={() => setShowPermisosModal(false)}
        rol={rolPermisos}
        permisos={permisos}
        permisosAsignados={permisosAsignados}
        onPermisoChange={handlePermisoChange}
        onGuardar={handleGuardarPermisos}
        loading={loadingPermisos}
      />

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={closeConfirmModal}
        onConfirm={handleConfirm}
        itemName={itemToDelete?.nombre}
        message="¿Estás seguro de que deseas eliminar este rol?"
      />
    </div>
  );
}