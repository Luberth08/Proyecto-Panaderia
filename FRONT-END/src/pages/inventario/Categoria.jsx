// src/pages/inventario/Categoria.jsx
import { useState, useEffect } from 'react';
import { categoriaAPI } from '../../api/api';
import './Categoria.css';

export default function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para el formulario
  const [form, setForm] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const data = await categoriaAPI.getAll();
      setCategorias(data);
    } catch (err) {
      setError('Error al cargar las categorías: ' + err.message);
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
      nombre: '',
      descripcion: ''
    });
    setEditingCategoria(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategoria) {
        // Actualizar categoría
        await categoriaAPI.update(editingCategoria.id, form);
      } else {
        // Crear categoría
        await categoriaAPI.create(form);
      }
      await cargarCategorias();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (categoria) => {
    setEditingCategoria(categoria);
    setForm({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || ''
    });
    setShowModal(true);
  };

  const handleDeleteClick = (categoria) => {
    setCategoriaToDelete(categoria);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoriaToDelete) {
      try {
        await categoriaAPI.delete(categoriaToDelete.id);
        await cargarCategorias();
        setShowDeleteModal(false);
        setCategoriaToDelete(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCategoriaToDelete(null);
  };

  // Filtrar categorías basado en la búsqueda
  const filteredCategorias = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (categoria.descripcion && categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="loading">Cargando categorías...</div>;

  return (
    <div className="categoria-container">
      {/* Header con título y botón */}
      <div className="categoria-header">
        <div className="header-left">
          <h1>Gestión de Categorías</h1>
          <p>Administra las categorías del inventario</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Nueva Categoría
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla de categorías */}
      <div className="table-container">
        <table className="categoria-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategorias.map(categoria => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>
                  <span className="categoria-nombre">
                    {categoria.nombre}
                  </span>
                </td>
                <td>
                  <span className="categoria-descripcion">
                    {categoria.descripcion || 'Sin descripción'}
                  </span>
                </td>
                <td className="acciones">
                  <button 
                    className="btn-editar"
                    onClick={() => handleEdit(categoria)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="btn-eliminar"
                    onClick={() => handleDeleteClick(categoria)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredCategorias.length === 0 && (
          <div className="no-data">
            {searchTerm ? 'No se encontraron categorías con ese criterio' : 'No hay categorías registradas'}
          </div>
        )}
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
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
                <label>Nombre de la categoría *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Panadería, Bebidas, Limpieza"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción opcional de la categoría"
                  rows="3"
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
                  {editingCategoria ? 'Actualizar' : 'Crear'} Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && categoriaToDelete && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <div className="modal-header">
              <h2>Confirmar Eliminación</h2>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar la categoría <strong>"{categoriaToDelete.nombre}"</strong>?
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