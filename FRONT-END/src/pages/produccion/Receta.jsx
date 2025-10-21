// src/pages/produccion/Receta.jsx
import { useState, useEffect } from 'react';
import { recetaAPI, productoAPI } from '../../api/api';
import './Receta.css';

export default function Receta() {
  const [recetas, setRecetas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingReceta, setEditingReceta] = useState(null);
  const [recetaToDelete, setRecetaToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para el formulario
  const [form, setForm] = useState({
    unidades: '',
    tiempo: '',
    id_producto: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [recetasData, productosData] = await Promise.all([
        recetaAPI.getAll(),
        productoAPI.getAll()
      ]);
      setRecetas(recetasData);
      setProductos(productosData);
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message);
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
      unidades: '',
      tiempo: '',
      id_producto: ''
    });
    setEditingReceta(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const recetaData = {
        ...form,
        unidades: parseInt(form.unidades),
        // Convertimos de string a tiempo number
        tiempo: parseInt(form.tiempo),
        id_producto: parseInt(form.id_producto)
      };

      if (editingReceta) {
        // Actualizar receta
        await recetaAPI.update(editingReceta.id, recetaData);
      } else {
        // Crear receta
        await recetaAPI.create(recetaData);
      }
      await cargarDatos();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (receta) => {
    setEditingReceta(receta);
    setForm({
      unidades: receta.unidades.toString(),
      tiempo: receta.tiempo.toString(),
      id_producto: receta.id_producto.toString()
    });
    setShowModal(true);
  };

  const handleDeleteClick = (receta) => {
    setRecetaToDelete(receta);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (recetaToDelete) {
      try {
        await recetaAPI.delete(recetaToDelete.id);
        await cargarDatos();
        setShowDeleteModal(false);
        setRecetaToDelete(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecetaToDelete(null);
  };

  // Filtrar recetas basado en la búsqueda
  const filteredRecetas = recetas.filter(receta =>
    receta.producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Cargando recetas...</div>;

  return (
    <div className="receta-container">
      {/* Header con título y botón */}
      <div className="receta-header">
        <div className="header-left">
          <h1>Gestión de Recetas</h1>
          <p>Administra las recetas de producción</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Nueva Receta
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla de recetas */}
      <div className="table-container">
        <table className="receta-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Unidades</th>
              <th>Tiempo (min)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecetas.map(receta => (
              <tr key={receta.id}>
                <td>{receta.id}</td>
                <td>
                  <span className="receta-producto">
                    {receta.producto}
                  </span>
                </td>
                <td>
                  <span className="receta-unidades">
                    {receta.unidades}
                  </span>
                </td>
                <td>
                  <span className="receta-tiempo">
                    {receta.tiempo} min
                  </span>
                </td>
                <td className="acciones">
                  <button 
                    className="btn-editar"
                    onClick={() => handleEdit(receta)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="btn-eliminar"
                    onClick={() => handleDeleteClick(receta)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredRecetas.length === 0 && (
          <div className="no-data">
            {searchTerm ? 'No se encontraron recetas con ese criterio' : 'No hay recetas registradas'}
          </div>
        )}
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingReceta ? 'Editar Receta' : 'Nueva Receta'}</h2>
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
                <label>Producto *</label>
                <select
                  name="id_producto"
                  value={form.id_producto}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar producto</option>
                  {productos.map(producto => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Unidades por lote *</label>
                  <input
                    type="number"
                    name="unidades"
                    value={form.unidades}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="Ej: 10"
                  />
                </div>

                <div className="form-group">
                  <label>Tiempo de producción (minutos) *</label>
                  <input
                    type="number"
                    name="tiempo"
                    value={form.tiempo}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="Ej: 30"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingReceta ? 'Actualizar' : 'Crear'} Receta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && recetaToDelete && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <div className="modal-header">
              <h2>Confirmar Eliminación</h2>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar la receta del producto <strong>"{recetaToDelete.producto}"</strong>?
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