// src/pages/permiso/Permiso.jsx
import { useState, useEffect } from 'react';
import { permisoAPI } from '../../api/api';
import './Permiso.css';

export default function Permiso() {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPermiso, setEditingPermiso] = useState(null);
  const [permisoToDelete, setPermisoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para el formulario
  const [form, setForm] = useState({
    nombre: ''
  });

  useEffect(() => {
    cargarPermisos();
  }, []);

  const cargarPermisos = async () => {
    try {
      setLoading(true);
      const data = await permisoAPI.getAll();
      setPermisos(data);
    } catch (err) {
      setError('Error al cargar los permisos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm({
      nombre: ''
    });
    setEditingPermiso(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPermiso) {
        // Actualizar permiso
        await permisoAPI.update(editingPermiso.id, form);
      } else {
        // Crear permiso
        await permisoAPI.create(form);
      }
      await cargarPermisos();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (permiso) => {
    setEditingPermiso(permiso);
    setForm({
      nombre: permiso.nombre
    });
    setShowModal(true);
  };

  const handleDeleteClick = (permiso) => {
    setPermisoToDelete(permiso);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (permisoToDelete) {
      try {
        await permisoAPI.delete(permisoToDelete.id);
        await cargarPermisos();
        setShowDeleteModal(false);
        setPermisoToDelete(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setPermisoToDelete(null);
  };

  // Filtrar permisos basado en la búsqueda
  const filteredPermisos = permisos.filter(permiso =>
    permiso.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Cargando permisos...</div>;

  return (
    <div className="permiso-container">
      {/* Header con título y botón */}
      <div className="permiso-header">
        <div className="header-left">
          <h1>Gestión de Permisos</h1>
          <p>Administra los permisos del sistema</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Nuevo Permiso
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla de permisos */}
      <div className="table-container">
        <table className="permiso-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPermisos.map(permiso => (
              <tr key={permiso.id}>
                <td>{permiso.id}</td>
                <td>
                  <span className="permiso-nombre">
                    {permiso.nombre}
                  </span>
                </td>
                <td className="acciones">
                  <button 
                    className="btn-editar"
                    onClick={() => handleEdit(permiso)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="btn-eliminar"
                    onClick={() => handleDeleteClick(permiso)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredPermisos.length === 0 && (
          <div className="no-data">
            {searchTerm ? 'No se encontraron permisos con ese criterio' : 'No hay permisos registrados'}
          </div>
        )}
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingPermiso ? 'Editar Permiso' : 'Nuevo Permiso'}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label>Nombre del permiso *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: CREAR_USUARIO, VER_USUARIO"
                  pattern="[A-Z_]+"
                  title="Solo letras mayúsculas y guiones bajos"
                />
                <small>Formato: SOLO_MAYUSCULAS_CON_GUIONES_BAJOS</small>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingPermiso ? 'Actualizar' : 'Crear'} Permiso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && permisoToDelete && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <div className="modal-header">
              <h2>Confirmar Eliminación</h2>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar el permiso <strong>"{permisoToDelete.nombre}"</strong>?
              </p>
              <p className="warning-text">
                ⚠️ Esta acción afectará a todos los roles que tengan este permiso asignado.
              </p>
            </div>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleDeleteCancel}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn-danger" 
                onClick={handleDeleteConfirm}
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}