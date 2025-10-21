import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VerCompra = () => {
  const [compras, setCompras] = useState([]);

  const [productos, setProductos] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [proveedor, setProveedor] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  
  const [detalleCompra, setDetalleCompra] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');  // Asegúrate de obtener el token desde el localStorage

  // UseEffect para cargar las compras desde el backend
  useEffect(() => {
    const obtenerCompras = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/notas-compra`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCompras(response.data.notas);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las compras:', error);
        setLoading(false);
      }
    };

    obtenerCompras();
  }, [token]);

  // Filtrar las compras según los filtros
  const comprasFiltradas = compras.filter((compra) => {
    const fechaPedido = new Date(compra.fecha_pedido).toLocaleDateString('es-ES');
    const fechaFiltro = new Date(filtroFecha).toLocaleDateString('es-ES');
    return !filtroFecha || fechaPedido === fechaFiltro;
  });
  

  const mostrarDetalleCompra = (compra) => {
    cerrarDetalle();
    actualizarProductosInsumos(compra.ide);
    setDetalleCompra(compra);
  };

  const cerrarDetalle = () => {
    setProductos([]);
    setInsumos([]);
    setProveedor('');

    setDetalleCompra(null);
  };
 const actualizarProductosInsumos = async (ide) => {

    try {
      const responseProductos = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notas-compra/${ide}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProveedor(responseProductos.data.notaCompra.nombre_proveedor);
      setProductos(responseProductos.data.productos);
      setInsumos(responseProductos.data.insumos);
    }catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  return (
    <div className="ver-compras">
      <h2>Ver Notas de Compra</h2>

      {/* Filtros */}
      <div className="filtros">
        <label>Fecha de Pedido:</label>
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />

      </div>

      {/* Mostrar cargando */}
      {loading && <p>Cargando compras...</p>}

      {/* Tabla de compras */}
      <table className="table" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Codigo</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Fecha de Pedido</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Fecha de Entrega</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {comprasFiltradas.length > 0 ? (
            comprasFiltradas.map((compra) => (
              <tr key={compra.ide}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{compra.ide}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {new Date(compra.fecha_pedido).toLocaleDateString('es-ES')}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {new Date(compra.fecha_entrega).toLocaleDateString('es-ES')}
                </td>

                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <button onClick={() => {
                    mostrarDetalleCompra(compra)
                    }}>Ver Detalles</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>No se encontraron compras.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Detalle de la compra */}
      {detalleCompra && (
        <div className="detalle-compra" style={{ marginTop: '20px' }}>
          <h3>Detalles de la Compra</h3>
          <p><strong>Proveedor:</strong> {proveedor}</p>
          <p><strong>Fecha de Pedido:</strong> 
          {new Date(detalleCompra.fecha_pedido).toLocaleDateString('es-ES')}
          </p>
          <p><strong>Fecha de Entrega:</strong> 
          {new Date(detalleCompra.fecha_entrega).toLocaleDateString('es-ES')}
          </p>
        

          <h4>Productos/Insumos</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Nombre</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Cantidad</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Precio</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => (
                <tr key={index}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{producto.nombre_producto}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{producto.cantidad} Unid</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>${producto.costo_compra}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>${producto.total}</td>
                </tr>
              ))}
              {insumos.map((insumo, index) => (
                <tr key={index}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{insumo.nombre_insumo}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{insumo.cantidad} {insumo.unidad_medida}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>${insumo.precio}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>${insumo.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={cerrarDetalle} style={{ marginTop: '20px' }}>Cerrar Detalles</button>
        </div>
      )}
    </div>
  );
};

export default VerCompra;
