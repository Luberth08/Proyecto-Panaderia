import { pedidoAPI } from '../../api/api';
import { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import '../../styles/venta/confirmar-entrega.css';
import '../../styles/venta/detalles-pedido.css';

// Componente para expandir y ver detalles
const PedidoConDetalles = ({ pedido, onConfirmar }) => {
  const [expandido, setExpandido] = useState(false);

  return (
    <>
      <tr>
        <td>#{pedido.id}</td>
        <td>{pedido.cliente_nombre}</td>
        <td>{new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
        <td>{new Date(pedido.fecha_entrega).toLocaleDateString()}</td>
        <td>${(parseFloat(pedido.total) || 0).toFixed(2)}</td>
        <td>
          <StatusBadge 
            status={pedido.pagado ? 'completado' : 'pendiente'} 
            text={pedido.pagado ? 'Pagado' : 'Pendiente de Pago'}
          />
        </td>
        <td>
          <button 
            className="btn-secondary"
            onClick={() => setExpandido(!expandido)}
          >
            {expandido ? '▼ Ver' : '▶ Ver'}
          </button>
        </td>
        <td>
          <button 
            className="btn-success"
            onClick={() => onConfirmar(pedido.id)}
          >
            Confirmar Entrega
          </button>
        </td>
      </tr>
      {expandido && (
        <tr className="detalle-row">
          <td colSpan="8">
            <div className="detalles-pedido">
              <h4>Productos del Pedido</h4>
              {pedido.detalles && pedido.detalles.length > 0 ? (
                <table className="detalles-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Precio Unit.</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.detalles.map((detalle, idx) => (
                      <tr key={idx}>
                        <td>{detalle.producto_nombre || 'N/A'}</td>
                        <td>{detalle.producto_descripcion || '-'}</td>
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

// Componente para confirmar entregas de pedidos
export default function ConfirmarEntrega() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [pedidosEntregados, setPedidosEntregados] = useState([]);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      setCargando(true);
      const data = await pedidoAPI.getAll();
      const noEntregados = data.filter(p => !p.entregado);
      setPedidos(noEntregados);
    } catch {
      setError('Error al cargar pedidos');
    } finally {
      setCargando(false);
    }
  };

  const handleConfirmarEntrega = async (idPedido) => {
    try {
      await pedidoAPI.confirmarEntrega(idPedido);
      setPedidosEntregados([...pedidosEntregados, idPedido]);
      setPedidos(pedidos.filter(p => p.id !== idPedido));
    } catch {
      setError('Error al confirmar entrega');
    }
  };

  if (cargando) {
    return <div className="loading">Cargando pedidos...</div>;
  }

  return (
    <div className="confirmar-entrega-container">
      <div className="header-section">
        <h1>Confirmar Entrega de Pedidos</h1>
        <p>Marca los pedidos como entregados y visualiza sus detalles</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {pedidosEntregados.length > 0 && (
        <div className="success-message">
          {pedidosEntregados.length} pedido(s) marcado(s) como entregado(s)
        </div>
      )}

      {pedidos.length === 0 ? (
        <div className="no-data">
          <p>No hay pedidos pendientes de entrega</p>
        </div>
      ) : (
        <div className="pedidos-table">
          <table>
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Fecha Pedido</th>
                <th>Fecha Entrega</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Detalles</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <PedidoConDetalles 
                  key={pedido.id}
                  pedido={pedido}
                  onConfirmar={handleConfirmarEntrega}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
