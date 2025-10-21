// src/pages/inventario/Producto.jsx
import { useState, useEffect } from 'react';
import { productoAPI, categoriaAPI } from '../../api/api';
import './Producto.css';

export default function Producto() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [productoToDelete, setProductoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para el formulario
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    stock: '',
    stock_minimo: '',
    id_categoria: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [productosData, categoriasData] = await Promise.all([
        productoAPI.getAll(),
        categoriaAPI.getAll()
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
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
      nombre: '',
      precio: '',
      stock: '',
      stock_minimo: '',
      id_categoria: ''
    });
    setEditingProducto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productoData = {
        ...form,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
        stock_minimo: parseInt(form.stock_minimo),
        id_categoria: parseInt(form.id_categoria)
      };

      if (editingProducto) {
        // Actualizar producto
        await productoAPI.update(editingProducto.id, productoData);
      } else {
        // Crear producto
        await productoAPI.create(productoData);
      }
      await cargarDatos();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (producto) => {
    setEditingProducto(producto);
    setForm({
      nombre: producto.nombre,
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      stock_minimo: producto.stock_minimo.toString(),
      id_categoria: categorias.find(c => c.nombre === producto.categoria)?.id.toString() || ''
    });
    setShowModal(true);
  };

  const handleDeleteClick = (producto) => {
    setProductoToDelete(producto);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (productoToDelete) {
      try {
        await productoAPI.delete(productoToDelete.id);
        await cargarDatos();
        setShowDeleteModal(false);
        setProductoToDelete(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProductoToDelete(null);
  };

  // Función para verificar si el stock está bajo
  const isStockBajo = (stock, stockMinimo) => {
    return stock < stockMinimo;
  };

  // Filtrar productos basado en la búsqueda
  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Cargando productos...</div>;

  return (
    <div className="producto-container">
      {/* Header con título y botón */}
      <div className="producto-header">
        <div className="header-left">
          <h1>Gestión de Productos</h1>
          <p>Administra los productos del inventario</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabla de productos */}
      <div className="table-container">
        <table className="producto-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Stock Mínimo</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.map(producto => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>
                  <span className="producto-nombre">
                    {producto.nombre}
                  </span>
                </td>
                <td>
                  <span className="producto-precio">
                    Bs.{parseFloat(producto.precio).toFixed(2)}
                  </span>
                </td>
                <td>
                  <span className={`producto-stock ${isStockBajo(producto.stock, producto.stock_minimo) ? 'stock-bajo' : ''}`}>
                    {producto.stock}
                  </span>
                </td>
                <td>
                  <span className="producto-stock-minimo">
                    {producto.stock_minimo}
                  </span>
                </td>
                <td>
                  <span className="producto-categoria">
                    {producto.categoria}
                  </span>
                </td>
                <td className="acciones">
                  <button 
                    className="btn-editar"
                    onClick={() => handleEdit(producto)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="btn-eliminar"
                    onClick={() => handleDeleteClick(producto)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProductos.length === 0 && (
          <div className="no-data">
            {searchTerm ? 'No se encontraron productos con ese criterio' : 'No hay productos registrados'}
          </div>
        )}
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingProducto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
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
                <label>Nombre del producto *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Pan Francés, Café Americano"
                />
              </div>

              <div className="form-group">
                <label>Precio de venta *</label>
                <input
                  type="number"
                  name="precio"
                  value={form.precio}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
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

              <div className="form-group">
                <label>Categoría *</label>
                <select
                  name="id_categoria"
                  value={form.id_categoria}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingProducto ? 'Actualizar' : 'Crear'} Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && productoToDelete && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <div className="modal-header">
              <h2>Confirmar Eliminación</h2>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar el producto <strong>"{productoToDelete.nombre}"</strong>?
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