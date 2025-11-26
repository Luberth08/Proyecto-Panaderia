import { clienteAPI, pedidoAPI, productoAPI, detallePedidoAPI } from '../../api/api';
import { useState, useEffect } from 'react';
import FormInput from '../../components/ui/Form/FormInput';
import FormSelect from '../../components/ui/Form/FormSelect';
import FormRow from '../../components/ui/Form/FormRow';
import '../../styles/venta/realizar-pedido.css';

// Componente para realizar pedidos como cliente
export default function RealizarPedido() {
  const [paso, setPaso] = useState(1);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [pedidoActual, setPedidoActual] = useState(null);
  const [productosEnPedido, setProductosEnPedido] = useState([]);
  const [formularioPedido, setFormularioPedido] = useState({
    fecha_pedido: new Date().toISOString().split('T')[0],
    fecha_entrega: '',
    tipo: 'Normal',
    total: 0,
    pagado: false
  });
  const [formularioProducto, setFormularioProducto] = useState({
    id_producto: '',
    cantidad: 1,
    precio: 0
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const datosClientes = await clienteAPI.getAll();
      const datosProductos = await productoAPI.getAll();
      setClientes(datosClientes);
      setProductos(datosProductos);
    } catch (err) {
      setError('Error al cargar datos');
    }
  };

  const handleCrearPedido = async (e) => {
    e.preventDefault();
    if (!clienteSeleccionado) {
      setError('Selecciona un cliente');
      return;
    }
    if (!formularioPedido.fecha_entrega) {
      setError('Selecciona una fecha de entrega');
      return;
    }

    setCargando(true);
    try {
      const nuevoPedido = await pedidoAPI.create({
        fecha_pedido: formularioPedido.fecha_pedido,
        fecha_entrega: formularioPedido.fecha_entrega,
        tipo: formularioPedido.tipo,
        total: formularioPedido.total,
        pagado: formularioPedido.pagado,
        ci_cliente: clienteSeleccionado
      });
      setPedidoActual(nuevoPedido.pedido);
      setPaso(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    if (!formularioProducto.id_producto || formularioProducto.cantidad <= 0) {
      setError('Datos del producto inválidos');
      return;
    }

    const producto = productos.find(p => p.id === parseInt(formularioProducto.id_producto));
    if (!producto) {
      setError('Producto no encontrado');
      return;
    }

    const total = formularioProducto.cantidad * formularioProducto.precio;
    const nuevoProducto = {
      id_producto: parseInt(formularioProducto.id_producto),
      producto_nombre: producto.nombre,
      cantidad: formularioProducto.cantidad,
      precio: formularioProducto.precio,
      total
    };

    setProductosEnPedido([...productosEnPedido, nuevoProducto]);
    const nuevoTotal = productosEnPedido.reduce((sum, p) => sum + p.total, 0) + total;
    setFormularioPedido({ ...formularioPedido, total: nuevoTotal });
    setFormularioProducto({ id_producto: '', cantidad: 1, precio: 0 });
    setError(null);
  };

  const handleEliminarProducto = (index) => {
    const productoAEliminar = productosEnPedido[index];
    setProductosEnPedido(productosEnPedido.filter((_, i) => i !== index));
    const nuevoTotal = formularioPedido.total - productoAEliminar.total;
    setFormularioPedido({ ...formularioPedido, total: nuevoTotal });
  };

  const handleCompletarPedido = async () => {
    if (productosEnPedido.length === 0) {
      setError('Agrega al menos un producto');
      return;
    }

    setCargando(true);
    try {
      for (const producto of productosEnPedido) {
        await detallePedidoAPI.create({
          id_producto: producto.id_producto,
          id_pedido: pedidoActual.id,
          cantidad: producto.cantidad,
          precio: producto.precio
        });
      }
      setError(null);
      alert('Pedido realizado exitosamente');
      setPaso(1);
      setPedidoActual(null);
      setProductosEnPedido([]);
      setFormularioPedido({
        fecha_pedido: new Date().toISOString().split('T')[0],
        fecha_entrega: '',
        tipo: 'Normal',
        total: 0,
        pagado: false
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="realizar-pedido-container">
      <div className="header-section">
        <h1>Realizar Pedido</h1>
        <p>Crea un nuevo pedido paso a paso</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {paso === 1 ? (
        <form onSubmit={handleCrearPedido} className="form-step">
          <h2>Paso 1: Información del Pedido</h2>

          <FormSelect
            label="Cliente"
            name="cliente"
            value={clienteSeleccionado}
            onChange={(e) => setClienteSeleccionado(e.target.value)}
            options={clientes.map(c => ({ value: c.ci, label: `${c.nombre} (${c.ci})` }))}
            required
          />

          <FormRow>
            <FormInput
              label="Fecha del Pedido"
              name="fecha_pedido"
              type="date"
              value={formularioPedido.fecha_pedido}
              disabled
              onChange={() => {}}
            />
            <FormInput
              label="Fecha de Entrega"
              name="fecha_entrega"
              type="date"
              value={formularioPedido.fecha_entrega}
              onChange={(e) => setFormularioPedido({ ...formularioPedido, fecha_entrega: e.target.value })}
              required
            />
          </FormRow>

          <FormSelect
            label="Tipo de Pedido"
            name="tipo"
            value={formularioPedido.tipo}
            onChange={(e) => setFormularioPedido({ ...formularioPedido, tipo: e.target.value })}
            options={[
              { value: 'Normal', label: 'Normal' },
              { value: 'Urgente', label: 'Urgente' },
              { value: 'Especial', label: 'Especial' }
            ]}
          />

          <button type="submit" className="btn-primary" disabled={cargando}>
            {cargando ? 'Creando...' : 'Siguiente'}
          </button>
        </form>
      ) : (
        <div className="form-step">
          <h2>Paso 2: Agregar Productos</h2>

          <form onSubmit={handleAgregarProducto} className="agregar-producto-form">
            <FormRow>
              <FormSelect
                label="Producto"
                name="id_producto"
                value={formularioProducto.id_producto}
                onChange={(e) => {
                  const prod = productos.find(p => p.id === parseInt(e.target.value));
                  setFormularioProducto({
                    ...formularioProducto,
                    id_producto: e.target.value,
                    precio: prod ? prod.precio : 0
                  });
                }}
                options={productos.map(p => ({ value: p.id, label: `${p.nombre} ($${p.precio})` }))}
                required
              />

              <FormInput
                label="Cantidad"
                name="cantidad"
                type="number"
                value={formularioProducto.cantidad}
                onChange={(e) => setFormularioProducto({ ...formularioProducto, cantidad: parseInt(e.target.value) || 1 })}
                min="1"
              />
            </FormRow>
            <button type="submit" className="btn-secondary">Agregar Producto</button>
          </form>

          {productosEnPedido.length > 0 && (
            <div className="productos-en-pedido">
              <h3>Productos en el Pedido</h3>
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productosEnPedido.map((prod, index) => (
                    <tr key={index}>
                      <td>{prod.producto_nombre}</td>
                      <td>{prod.cantidad}</td>
                      <td>${(parseFloat(prod.precio) || 0).toFixed(2)}</td>
                      <td>${(parseFloat(prod.total) || 0).toFixed(2)}</td>
                      <td>
                        <button 
                          type="button"
                          className="btn-danger"
                          onClick={() => handleEliminarProducto(index)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="total-pedido">
                <h3>Total del Pedido: ${(parseFloat(formularioPedido.total) || 0).toFixed(2)}</h3>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button"
              className="btn-secondary"
              onClick={() => setPaso(1)}
            >
              Atrás
            </button>
            <button 
              type="button"
              className="btn-primary"
              onClick={handleCompletarPedido}
              disabled={cargando || productosEnPedido.length === 0}
            >
              {cargando ? 'Completando...' : 'Completar Pedido'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
