// src/pages/rol/Rol.jsx
import { useState, useEffect } from 'react';
import { rolAPI, permisoAPI, rolPermisoAPI } from '../../api/api';
import './Rol.css';

export default function Rol() {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [permisosAsignados, setPermisosAsignados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermisosModal, setShowPermisosModal] = useState(false);
  const [editingRol, setEditingRol] = useState(null);
  const [rolToDelete, setRolToDelete] = useState(null);
  const [rolPermisos, setRolPermisos] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingPermisos, setLoadingPermisos] = useState(false);

  // Estado para el formulario
  const [form, setForm] = useState({
    nombre: ''
  });

  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    try {
      setLoading(true);
      const data = await rolAPI.getAll();
      setRoles(data);
    } catch (err) {
      setError('Error al cargar los roles: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarPermisos = async () => {
    try {
      const data = await permisoAPI.getAll();
      setPermisos(data);
    } catch (err) {
      setError('Error al cargar los permisos: ' + err.message);
    }
  };

  const cargarPermisosDelRol = async (idRol) => {
    try {
      setLoadingPermisos(true);
      const data = await rolPermisoAPI.getByRol(idRol);
      setPermisosAsignados(data.map(rp => rp.id_permiso));
    } catch (err) {
      setError('Error al cargar los permisos del rol: ' + err.message);
    } finally {
      setLoadingPermisos(false);
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
    setEditingRol(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRol) {
        // Actualizar rol
        await rolAPI.update(editingRol.id, form);
      } else {
        // Crear rol
        await rolAPI.create(form);
      }
      await cargarRoles();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (rol) => {
    setEditingRol(rol);
    setForm({
      nombre: rol.nombre
    });
    setShowModal(true);
  };

  const handleAsignarPermisos = async (rol) => {
    setRolPermisos(rol);
    setShowPermisosModal(true);
    setError('');
    
    // Cargar permisos disponibles y permisos del rol
    await Promise.all([
      cargarPermisos(),
      cargarPermisosDelRol(rol.id)
    ]);
  };

  const handlePermisoChange = (permisoId) => {
    setPermisosAsignados(prev => {
      if (prev.includes(permisoId)) {
        // Remover permiso
        return prev.filter(id => id !== permisoId);
      } else {
        // Agregar permiso
        return [...prev, permisoId];
      }
    });
  };

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
      setError('Error al guardar los permisos: ' + err.message);
    } finally {
      setLoadingPermisos(false);
    }
  };

  const handleDeleteClick = (rol) => {
    setRolToDelete(rol);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (rolToDelete) {
      try {
        await rolAPI.delete(rolToDelete.id);
        await cargarRoles();
        setShowDeleteModal(false);
        setRolToDelete(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRolToDelete(null);
  };

  // Filtrar roles basado en la búsqueda
  const filteredRoles = roles.filter(rol =>
    rol.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Cargando roles...</div>;

  return (
    <div className="rol-container">
      {/* Header con título y botón */}
      <div className="rol-header">
        <div className="header-left">
          <h1>Gestión de Roles</h1>
          <p>Administra los roles del sistema</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Nuevo Rol
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

      {/* Tabla de roles */}
      <div className="table-container">
        <table className="rol-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map(rol => (
              <tr key={rol.id}>
                <td>{rol.id}</td>
                <td>{rol.nombre}</td>
                <td className="acciones">
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
                    onClick={() => handleDeleteClick(rol)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredRoles.length === 0 && (
          <div className="no-data">
            {searchTerm ? 'No se encontraron roles con ese criterio' : 'No hay roles registrados'}
          </div>
        )}
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingRol ? 'Editar Rol' : 'Nuevo Rol'}</h2>
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
                <label>Nombre del rol *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Administrador, Cajero, Panadero"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingRol ? 'Actualizar' : 'Crear'} Rol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de asignación de permisos */}
      {showPermisosModal && rolPermisos && (
        <div className="modal-overlay">
          <div className="modal permisos-modal">
            <div className="modal-header">
              <h2>Asignar Permisos - {rolPermisos.nombre}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowPermisosModal(false);
                  setRolPermisos(null);
                  setPermisosAsignados([]);
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              
              {loadingPermisos ? (
                <div className="loading">Cargando permisos...</div>
              ) : (
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
                            onChange={() => handlePermisoChange(permiso.id)}
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
              )}
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => {
                  setShowPermisosModal(false);
                  setRolPermisos(null);
                  setPermisosAsignados([]);
                }}
                disabled={loadingPermisos}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleGuardarPermisos}
                disabled={loadingPermisos}
              >
                {loadingPermisos ? 'Guardando...' : 'Guardar Permisos'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && rolToDelete && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <div className="modal-header">
              <h2>Confirmar Eliminación</h2>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar el rol <strong>"{rolToDelete.nombre}"</strong>?
              </p>
              <p className="warning-text">
                ⚠️ Esta acción no se puede deshacer.
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