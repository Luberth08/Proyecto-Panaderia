// src/pages/inventario/Insumo.jsx
import { useState, useEffect } from 'react';
import { insumoAPI } from '../../api/api';
import './Insumo.css';

export default function Insumo() {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState(null);
  const [insumoToDelete, setInsumoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para el formulario
  const [form, setForm] = useState({
    nombre: '',
    medida: '',
    stock: '',
    stock_minimo: ''
  });

  // Opciones de unidad de medida
  const medidas = ['kg', 'gr', 'lt', 'ml', 'unid'];

  useEffect(() => {
    cargarInsumos();
  }, []);

  const cargarInsumos = async () => {
    try {
      setLoading(true);
      const data = await insumoAPI.getAll();
      setInsumos(data);
    } catch (err) {
      setError('Error al cargar los insumos: ' + err.message);
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
      medida: '',
      stock: '',
      stock_minimo: ''
    });
    setEditingInsumo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const insumoData = {
        ...form,
        stock: parseInt(form.stock),
        stock_minimo: parseInt(form.stock_minimo)
      };

      if (editingInsumo) {
        // Actualizar insumo
        await insumoAPI.update(editingInsumo.id, insumoData);
      } else {
        // Crear insumo
        await insumoAPI.create(insumoData);
      }
      await cargarInsumos();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (insumo) => {
    setEditingInsumo(insumo);
    setForm({
      nombre: insumo.nombre,
      medida: insumo.medida,
      stock: insumo.stock.toString(),
      stock_minimo: insumo.stock_minimo.toString()
    });
    setShowModal(true);
  };

  const handleDeleteClick = (insumo) => {
    setInsumoToDelete(insumo);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (insumoToDelete) {
      try {
        await insumoAPI.delete(insumoToDelete.id);
        await cargarInsumos();
        setShowDeleteModal(false);
        setInsumoToDelete(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setInsumoToDelete(null);
  };

  // Función para verificar si el stock está bajo
  const isStockBajo = (stock, stockMinimo) => {
    return stock < stockMinimo;
  };

  // Filtrar insumos basado en la búsqueda
  const filteredInsumos = insumos.filter(insumo =>
    insumo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Cargando insumos...</div>;

  return (
    <div className="insumo-container">
      {/* Header con título y botón */}
      <div className="insumo-header">
        <div className="header-left">
          <h1>Gestión de Insumos</h1>
          <p>Administra los insumos del inventario</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Nuevo Insumo
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

      {/* Tabla de insumos */}
      <div className="table-container">
        <table className="insumo-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Medida</th>
              <th>Stock</th>
              <th>Stock Mínimo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredInsumos.map(insumo => (
              <tr key={insumo.id}>
                <td>{insumo.id}</td>
                <td>
                  <span className="insumo-nombre">
                    {insumo.nombre}
                  </span>
                </td>
                <td>
                  <span className="insumo-medida">
                    {insumo.medida}
                  </span>
                </td>
                <td>
                  <span className={`insumo-stock ${isStockBajo(insumo.stock, insumo.stock_minimo) ? 'stock-bajo' : ''}`}>
                    {insumo.stock}
                  </span>
                </td>
                <td>
                  <span className="insumo-stock-minimo">
                    {insumo.stock_minimo}
                  </span>
                </td>
                <td className="acciones">
                  <button 
                    className="btn-editar"
                    onClick={() => handleEdit(insumo)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="btn-eliminar"
                    onClick={() => handleDeleteClick(insumo)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredInsumos.length === 0 && (
          <div className="no-data">
            {searchTerm ? 'No se encontraron insumos con ese criterio' : 'No hay insumos registrados'}
          </div>
        )}
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingInsumo ? 'Editar Insumo' : 'Nuevo Insumo'}</h2>
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
                <label>Nombre del insumo *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Harina, Azúcar, Sal"
                />
              </div>

              <div className="form-group">
                <label>Unidad de Medida *</label>
                <select
                  name="medida"
                  value={form.medida}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar medida</option>
                  {medidas.map(medida => (
                    <option key={medida} value={medida}>
                      {medida}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock Actual *</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Stock Mínimo *</label>
                  <input
                    type="number"
                    name="stock_minimo"
                    value={form.stock_minimo}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
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
                  {editingInsumo ? 'Actualizar' : 'Crear'} Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && insumoToDelete && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <div className="modal-header">
              <h2>Confirmar Eliminación</h2>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar el insumo <strong>"{insumoToDelete.nombre}"</strong>?
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