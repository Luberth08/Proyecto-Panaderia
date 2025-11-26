import { pedidoAPI, clienteAPI, productoAPI, detallePedidoAPI } from '../../api/api';
import FormInput from '../../components/ui/Form/FormInput';
import FormSelect from '../../components/ui/Form/FormSelect';
import FormRow from '../../components/ui/Form/FormRow';
import StatusBadge from '../../components/common/StatusBadge';
import { useForm } from '../../hooks/useForm';
import { useEffect, useState } from 'react';
import '../../styles/venta/detalles-pedido.css';

// Componente de formulario para agregar productos al pedido
const AgregarProductoForm = ({ productos, onAgregar, onCancel }) => {
  const [formProducto, setFormProducto] = useState({
    id_producto: '',
    cantidad: '',
    precio: ''
  });

  const handleProductoChange = (productId) => {
    const producto = productos.find(p => p.id === parseInt(productId));
    setFormProducto({
      id_producto: productId,
      cantidad: '',
      precio: producto ? producto.precio : ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formProducto.id_producto && formProducto.cantidad && formProducto.precio) {
      onAgregar({
        id_producto: parseInt(formProducto.id_producto),
        cantidad: parseInt(formProducto.cantidad),
        precio: parseFloat(formProducto.precio)
      });
      setFormProducto({ id_producto: '', cantidad: '', precio: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <h3>Agregar Producto al Pedido</h3>
      
      <FormSelect
        label="Producto"
        name="id_producto"
        value={formProducto.id_producto}
        onChange={(e) => handleProductoChange(e.target.value)}
        options={productos.map(p => ({ 
          value: p.id, 
          label: `${p.nombre}` 
        }))}
        placeholder="Seleccionar producto"
        required
      />

      <FormRow>
        <FormInput
          label="Cantidad"
          name="cantidad"
          value={formProducto.cantidad}
          onChange={(e) => setFormProducto({ ...formProducto, cantidad: e.target.value })}
          type="number"
          min="1"
          required
        />

        <FormInput
          label="Precio Unitario"
          name="precio"
          value={formProducto.precio}
          onChange={(e) => setFormProducto({ ...formProducto, precio: e.target.value })}
          type="number"
          step="0.01"
          min="0"
          required
        />
      </FormRow>

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cerrar
        </button>
        <button type="submit" className="btn-primary">
          Agregar Producto
        </button>
      </div>
    </form>
  );
};

// Componente de formulario para Pedido
const PedidoForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [clientes, setClientes] = useState([]);
  const { form, handleChange, validateForm } = useForm(initialData, {
    fecha_pedido: { required: true },
    ci_cliente: { required: true },
    fecha_entrega: { required: true },
    tipo: { required: true },
    total: { required: true },
    pagado: { required: true }
  });

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const data = await clienteAPI.getAll();
        setClientes(data);
      } catch (error) {
        console.error('Error al cargar clientes:', error);
      }
    };
    cargarClientes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formattedData = {
        ...form,
        total: parseFloat(form.total),
        pagado: form.pagado === 'true' || form.pagado === true
      };
      onSubmit(formattedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <FormRow>
        <FormInput
          label="Fecha del Pedido"
          name="fecha_pedido"
          value={form.fecha_pedido}
          onChange={handleChange}
          type="date"
          required
        />

        <FormInput
          label="Fecha de Entrega"
          name="fecha_entrega"
          value={form.fecha_entrega}
          onChange={handleChange}
          type="date"
          required
        />
      </FormRow>

      <FormSelect
        label="Cliente"
        name="ci_cliente"
        value={form.ci_cliente}
        onChange={handleChange}
        options={clientes.map(cliente => ({ 
          value: cliente.ci, 
          label: `${cliente.nombre} (${cliente.ci})` 
        }))}
        placeholder="Seleccionar cliente"
        required
      />

      <FormRow>
        <FormSelect
          label="Tipo de Pedido"
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          options={[
            { value: 'Normal', label: 'Normal' },
            { value: 'Urgente', label: 'Urgente' },
            { value: 'Especial', label: 'Especial' }
          ]}
          required
        />

        <FormInput
          label="Total"
          name="total"
          value={form.total}
          onChange={handleChange}
          type="number"
          step="0.01"
          min="0"
          required
        />
      </FormRow>

      <FormSelect
        label="¿Pagado?"
        name="pagado"
        value={form.pagado}
        onChange={handleChange}
        options={[
          { value: 'true', label: 'Sí' },
          { value: 'false', label: 'No' }
        ]}
        required
      />

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {isEditing ? 'Actualizar' : 'Crear'} Pedido
        </button>
      </div>
    </form>
  );
};

// Estado inicial
const initialFormState = {
  fecha_pedido: '',
  ci_cliente: '',
  fecha_entrega: '',
  tipo: '',
  total: '',
  pagado: 'false'
};

// Componente de fila expandible con detalles
const PedidoRow = ({ pedido, onDelete, onEdit, onAgregarProductos }) => {
  const [expandido, setExpandido] = useState(false);

  return (
    <>
      <tr>
        <td style={{ width: '60px' }}>{pedido.id}</td>
        <td>{pedido.cliente_nombre}</td>
        <td style={{ width: '120px' }}>{pedido.fecha_pedido}</td>
        <td style={{ width: '100px' }}>${(parseFloat(pedido.total) || 0).toFixed(2)}</td>
        <td style={{ width: '80px' }}>
          <StatusBadge 
            status={pedido.pagado ? 'completado' : 'pendiente'}
            text={pedido.pagado ? 'Sí' : 'No'}
          />
        </td>
        <td style={{ width: '150px' }}>
          <button 
            className="btn-secondary" 
            onClick={() => setExpandido(!expandido)}
            title="Ver detalles"
          >
            {expandido ? '▼ Detalles' : '▶ Detalles'}
          </button>
        </td>
        <td style={{ width: '250px' }}>
          <button className="btn-info" onClick={() => onAgregarProductos(pedido.id)}>+ Producto</button>
          <button className="btn-warning" onClick={() => onEdit(pedido.id)}>Editar</button>
          <button className="btn-danger" onClick={() => onDelete(pedido.id)}>Eliminar</button>
        </td>
      </tr>
      {expandido && (
        <tr className="detalle-row">
          <td colSpan="7">
            <div className="detalles-pedido">
              <h4>Productos del Pedido</h4>
              {pedido.detalles && pedido.detalles.length > 0 ? (
                <table className="detalles-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unit.</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.detalles.map((detalle, idx) => (
                      <tr key={idx}>
                        <td>{detalle.producto_nombre || 'N/A'}</td>
                        <td>{detalle.cantidad}</td>
                        <td>${(parseFloat(detalle.precio) || 0).toFixed(2)}</td>
                        <td>${(parseFloat(detalle.total) || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-detalles">No hay productos en este pedido</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// Componente principal
export default function Pedido() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showProductoForm, setShowProductoForm] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [productos, setProductos] = useState([]);
  const [pedidoActualId, setPedidoActualId] = useState(null);

  useEffect(() => {
    cargarDatos();
    cargarProductos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const data = await pedidoAPI.getAll();
      setDatos(data);
    } catch {
      setError('Error al cargar pedidos');
    } finally {
      setCargando(false);
    }
  };

  const cargarProductos = async () => {
    try {
      const data = await productoAPI.getAll();
      setProductos(data);
    } catch {
      console.error('Error al cargar productos');
    }
  };

  const handleAgregar = () => {
    setIsEditing(false);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditar = async (id) => {
    setEditingId(id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAgregarProductos = (idPedido) => {
    setPedidoActualId(idPedido);
    setShowProductoForm(true);
  };

  const handleAgregarProductoAlPedido = async (producto) => {
    try {
      await detallePedidoAPI.create({
        id_producto: producto.id_producto,
        id_pedido: pedidoActualId,
        cantidad: producto.cantidad,
        precio: producto.precio
      });
      await cargarDatos();
    } catch {
      setError('Error al agregar producto al pedido');
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      try {
        await pedidoAPI.delete(id);
        await cargarDatos();
      } catch {
        setError('Error al eliminar pedido');
      }
    }
  };

  const datosFiltrados = datos.filter(pedido =>
    pedido.cliente_nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    pedido.tipo?.toLowerCase().includes(filtro.toLowerCase())
  );

  if (cargando) return <div className="loading">Cargando...</div>;

  return (
    <div className="pedido-container">
      <div className="header-section">
        <h1>Pedidos</h1>
        <p>Administra los pedidos de los clientes</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="actions-bar">
        <input
          type="text"
          placeholder="Buscar por cliente o tipo..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="search-input"
        />
        <button className="btn-primary" onClick={handleAgregar}>
          + Nuevo Pedido
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <PedidoForm 
              initialData={isEditing ? datos.find(p => p.id === editingId) : initialFormState}
              onSubmit={async (data) => {
                try {
                  if (isEditing) {
                    await pedidoAPI.update(editingId, data);
                  } else {
                    await pedidoAPI.create(data);
                  }
                  await cargarDatos();
                  setShowForm(false);
                } catch {
                  setError('Error al guardar pedido');
                }
              }}
              onCancel={() => setShowForm(false)}
              isEditing={isEditing}
            />
          </div>
        </div>
      )}

      {showProductoForm && (
        <div className="modal-overlay" onClick={() => setShowProductoForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AgregarProductoForm 
              productos={productos}
              onAgregar={(producto) => {
                handleAgregarProductoAlPedido(producto);
                setShowProductoForm(false);
              }}
              onCancel={() => setShowProductoForm(false)}
            />
          </div>
        </div>
      )}

      {datosFiltrados.length === 0 ? (
        <div className="no-data">
          <p>No hay pedidos para mostrar</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>Cliente</th>
                <th style={{ width: '120px' }}>Fecha Pedido</th>
                <th style={{ width: '100px' }}>Total</th>
                <th style={{ width: '80px' }}>Pagado</th>
                <th style={{ width: '150px' }}>Detalles</th>
                <th style={{ width: '250px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.map(pedido => (
                <PedidoRow 
                  key={pedido.id}
                  pedido={pedido}
                  onEdit={handleEditar}
                  onDelete={handleEliminar}
                  onAgregarProductos={handleAgregarProductos}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
