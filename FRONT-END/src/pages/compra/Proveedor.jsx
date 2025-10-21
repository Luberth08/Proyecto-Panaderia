// src/pages/compra/Proveedor.jsx
import { useState, useEffect } from 'react';
import { proveedorAPI } from '../../api/api';
import './Proveedor.css';

export default function Proveedor() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState(null);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para el formulario
  const [form, setForm] = useState({
    codigo: '',
    nombre: '',
    sexo: '',
    telefono: '',
    estado: true,
    empresa: ''
  });

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      const data = await proveedorAPI.getAll();
      setProveedores(data);
    } catch (err) {
      setError('Error al cargar los proveedores: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setForm({
      codigo: '',
      nombre: '',
      sexo: '',
      telefono: '',
      estado: true,
      empresa: ''
    });
    setEditingProveedor(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const proveedorData = {
        ...form,
        estado: form.estado === true || form.estado === 'true'
      };

      if (editingProveedor) {
        // Actualizar proveedor
        await proveedorAPI.update(editingProveedor.codigo, proveedorData);
      } else {
        // Crear proveedor
        await proveedorAPI.create(proveedorData);
      }
      await cargarProveedores();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (proveedor) => {
    setEditingProveedor(proveedor);
    setForm({
      codigo: proveedor.codigo,
      nombre: proveedor.nombre,
      sexo: proveedor.sexo || '',
      telefono: proveedor.telefono || '',
      estado: proveedor.estado,
      empresa: proveedor.empresa
    });
    setShowModal(true);
  };

  const handleDeleteClick = (proveedor) => {
    setProveedorToDelete(proveedor);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (proveedorToDelete) {
      try {
        await proveedorAPI.delete(proveedorToDelete.codigo);
        await cargarProveedores();
        setShowDeleteModal(false);
        setProveedorToDelete(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProveedorToDelete(null);
  };

  // Filtrar proveedores basado en la búsqueda
  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Cargando proveedores...</div>;

  return (
    <div className="proveedor-container">
      {/* Header con título y botón */}
      <div className="proveedor-header">
        <div className="header-left">
          <h1>Gestión de Proveedores</h1>
          <p>Administra los proveedores del sistema</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Nuevo Proveedor
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por código, nombre o empresa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla de proveedores */}
      <div className="table-container">
        <table className="proveedor-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Sexo</th>
              <th>Teléfono</th>
              <th>Empresa</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProveedores.map(proveedor => (
              <tr key={proveedor.codigo}>
                <td>
                  <span className="proveedor-codigo">
                    {proveedor.codigo}
                  </span>
                </td>
                <td>{proveedor.nombre}</td>
                <td>
                  <span className="proveedor-sexo">
                    {proveedor.sexo === 'M' ? '👨 Masculino' : 
                     proveedor.sexo === 'F' ? '👩 Femenino' : 'No especificado'}
                  </span>
                </td>
                <td>
                  <span className="proveedor-telefono">
                    {proveedor.telefono || 'No especificado'}
                  </span>
                </td>
                <td>
                  <span className="proveedor-empresa">
                    {proveedor.empresa.length > 0 ? proveedor.empresa : 'No especificado'}
                  </span>
                </td>
                <td>
                  <span className={`estado-badge ${proveedor.estado ? 'estado-activo' : 'estado-inactivo'}`}>
                    {proveedor.estado ? '✅ Activo' : '❌ Inactivo'}
                  </span>
                </td>
                <td className="acciones">
                  <button 
                    className="btn-editar"
                    onClick={() => handleEdit(proveedor)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="btn-eliminar"
                    onClick={() => handleDeleteClick(proveedor)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProveedores.length === 0 && (
          <div className="no-data">
            {searchTerm ? 'No se encontraron proveedores con ese criterio' : 'No hay proveedores registrados'}
          </div>
        )}
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
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
                <label>Código *</label>
                <input
                  type="text"
                  name="codigo"
                  value={form.codigo}
                  onChange={handleInputChange}
                  required
                  disabled={!!editingProveedor}
                  placeholder="Código único del proveedor"
                />
              </div>

              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Nombre del proveedor"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sexo</label>
                  <select
                    name="sexo"
                    value={form.sexo}
                    onChange={handleInputChange}
                  >
                    <option value="">No especificado</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleInputChange}
                    placeholder="Número de teléfono"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Empresa *</label>
                <input
                  type="text"
                  name="empresa"
                  value={form.empresa}
                  onChange={handleInputChange}
                  required
                  placeholder="Nombre de la empresa"
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="estado"
                    checked={form.estado}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Proveedor activo
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingProveedor ? 'Actualizar' : 'Crear'} Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && proveedorToDelete && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <div className="modal-header">
              <h2>Confirmar Eliminación</h2>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar al proveedor <strong>"{proveedorToDelete.nombre}"</strong>?
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