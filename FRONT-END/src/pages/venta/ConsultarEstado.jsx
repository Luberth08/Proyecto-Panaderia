import { pedidoAPI } from '../../api/api';
import { useState } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import FormInput from '../../components/ui/Form/FormInput';
import '../../styles/venta/consultar-estado.css';
import '../../styles/venta/detalles-pedido.css';

// Componente para consultar estado de pedidos
export default function ConsultarEstado() {
  const [idPedido, setIdPedido] = useState('');
  const [estadoPedido, setEstadoPedido] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!idPedido.trim()) {
      setError('Ingresa un ID de pedido');
      return;
    }

    setCargando(true);
    setError(null);
    setEstadoPedido(null);

    try {
      const data = await pedidoAPI.getEstado(idPedido);
      setEstadoPedido(data);
    } catch (err) {
      setError(err.message || 'Error al buscar el pedido');
    } finally {
      setCargando(false);
    }
  };

  const getEstadoColor = (estado) => {
    if (estado === 'Entregado') return 'completado';
    if (estado === 'Confirmado') return 'en-proceso';
    return 'pendiente';
  };

  return (
    <div className="consultar-estado-container">
      <div className="header-section">
        <h1>Consultar Estado de Pedido</h1>
        <p>Busca un pedido por su ID para ver su estado actual</p>
      </div>

      <form onSubmit={handleBuscar} className="search-form">
        <FormInput
          label="ID del Pedido"
          name="idPedido"
          value={idPedido}
          onChange={(e) => setIdPedido(e.target.value)}
          placeholder="Ej: 1, 2, 3..."
          type="number"
        />
        <button type="submit" className="btn-primary" disabled={cargando}>
          {cargando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {estadoPedido && (
        <div className="estado-resultado">
          <div className="estado-card">
            <div className="estado-header">
              <h2>Pedido #{estadoPedido.id}</h2>
              <StatusBadge 
                status={getEstadoColor(estadoPedido.estado)} 
                text={estadoPedido.estado}
              />
            </div>

            <div className="estado-details">
              <div className="detail-row">
                <span className="label">Fecha del Pedido:</span>
                <span className="value">{new Date(estadoPedido.fecha_pedido).toLocaleDateString()}</span>
              </div>

              <div className="detail-row">
                <span className="label">Fecha de Entrega:</span>
                <span className="value">{new Date(estadoPedido.fecha_entrega).toLocaleDateString()}</span>
              </div>

              <div className="detail-row">
                <span className="label">¿Pagado?</span>
                <StatusBadge 
                  status={estadoPedido.pagado ? 'completado' : 'pendiente'} 
                  text={estadoPedido.pagado ? 'Sí' : 'No'}
                />
              </div>

              <div className="detail-row">
                <span className="label">¿Entregado?</span>
                <StatusBadge 
                  status={estadoPedido.entregado ? 'completado' : 'pendiente'} 
                  text={estadoPedido.entregado ? 'Sí' : 'No'}
                />
              </div>

              {/* Detalles del pedido - Productos */}
              <div className="productos-section">
                <h3>Productos del Pedido</h3>
                {estadoPedido.detalles && estadoPedido.detalles.length > 0 ? (
                  <table className="detalles-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estadoPedido.detalles.map((detalle, idx) => (
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
                  <p className="no-productos">No hay productos en este pedido</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
