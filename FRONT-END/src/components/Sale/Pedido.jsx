import React, { useState, useEffect } from "react";
import axios from "axios";

export const Pedido = () => {
  const [pedidosHechos, setPedidosHechos] = useState([]);
  const [pedidosTerminados, setPedidosTerminados] = useState([]);
  const [articulosPedido, setArticulosPedido] = useState({});
  const [expandedPedido, setExpandedPedido] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/pedidos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const pedidos = response.data.pedidos;
        setPedidosHechos(pedidos.filter((p) => !p.pagado));
        setPedidosTerminados(pedidos.filter((p) => p.pagado));
      } catch (error) {
        console.error("Error al cargar los pedidos:", error);
      }
    };
    fetchPedidos();
  }, []);

  const handleExpandPedido = async (pedidoId) => {
    if (articulosPedido[pedidoId]) {
      // Si los artículos ya están cargados, solo expande el pedido
      setExpandedPedido(expandedPedido == pedidoId ? null : pedidoId);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pedidos/${pedidoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.error("Artículos del pedido:", response.data.pedido.productos);
      setArticulosPedido((prev) => ({
        ...prev,
        [pedidoId]: response.data.pedido.productos,
      }));
      setExpandedPedido(pedidoId);
    } catch (error) {
      console.error("Error al cargar los artículos del pedido:", error);
    }
  };

  const handleMarcarTerminado = async (pedidoId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/pedidos/${pedidoId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPedidosHechos((prev) =>
        prev.filter((pedido) => pedido.ide !== pedidoId)
      );
      setPedidosTerminados((prev) => [
        ...prev,
        pedidosHechos.find((pedido) => pedido.ide === pedidoId),
      ]);
    } catch (error) {
      console.error("Error al marcar el pedido como terminado:", error);
    }
  };

  const renderPedidos = (pedidos, isTerminado) => (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Número de Pedido</th>
            <th>Precio Total</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <React.Fragment key={pedido.ide}>
              <tr>
                <td>{pedido.ide}</td>
                <td>${pedido.total || 0}</td>
                <td>{new Date(pedido.fecha_entrega).toLocaleDateString()}</td>
                <td>
                  <button
                    className="expandable-button"
                    onClick={() => handleExpandPedido(pedido.ide)}
                  >
                    {expandedPedido === pedido.ide ? "▲ Ocultar" : "▼ Ver"}
                  </button>
                  {!isTerminado && (
                    <button
                      className="action-buttons"
                      onClick={() => handleMarcarTerminado(pedido.ide)}
                    >
                      Terminar
                    </button>
                  )}
                </td>
              </tr>
              {expandedPedido === pedido.ide && (
                <tr className="dropdown-container">
                  <td colSpan="5">
                    <ul>
                      {articulosPedido[pedido.ide]?.length > 0 ? (
                        articulosPedido[pedido.ide].map((articulo) => (
                          <li key={articulo.ide_producto}>
                            {articulo.nombre_producto} - Cantidad:{" "}
                            {articulo.cantidad}
                          </li>
                        ))
                      ) : (
                        <p>Cargando artículos...</p>
                      )}
                    </ul>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="background">
      <h2>Gestión de Pedidos</h2>
      <div>
        <h3>Pedidos Hechos</h3>
        {renderPedidos(pedidosHechos, false)}
      </div>
      <div>
        <h3>Pedidos Realizados</h3>
        {renderPedidos(pedidosTerminados, true)}
      </div>
    </div>
  );
};

export default Pedido;
