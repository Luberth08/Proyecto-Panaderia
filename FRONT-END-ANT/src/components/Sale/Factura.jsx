import React, { useState, useEffect } from "react";
import axios from "axios";

export const Factura = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [CI, setCI] = useState(2848582);
  const [pago, setPago] = useState("");
  const [precio, setPrecio] = useState(0);
  const [total, setTotal] = useState(0);
  const [facturaGenerada, setFacturaGenerada] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token"); // Suponiendo que el token se guarda en localStorage

  // Fetch productos desde la API
  useEffect(() => {
    handleUpdate();
  }, [token]);

  // Función para actualizar los productos
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/productos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const filteredproductos = response.data
        .map((prod) => (prod.stock > 0 ? prod : null))
        .filter((prod) => prod !== null);

      setProductos(filteredproductos);
    } catch (error) {
      console.error("Error al actualizar los productos:", error);
      setError("Error al actualizar la lista de productos");
    } finally {
      setLoading(false);
    }
  };

  const newFactura = async () => {
    setCI(0);
    setCantidad(1);
    setPrecio(0);
    setTotal(0);
    setDetalles([]);
    setFacturaGenerada(false);
    setProductoSeleccionado(null);
    handleUpdate();
  };

  const agregarProducto = () => {
    const productoEncontrado = productos.find(
      (prod) => prod.ide == productoSeleccionado
    );
    if (!productoEncontrado) {
      alert("Producto no registrado");
      return;
    }

    const productoConCantidad = {
      productoId: productoEncontrado.ide,
      nombre: productoEncontrado.nombre,
      precio: Number(productoEncontrado.precio),
      costo_unitario: productoEncontrado.costo_unitario,
      costo_promedio: productoEncontrado.costo_promedio,
      cantidad,
      totalProducto: precio * cantidad,
    };

    const productoYaExistente = detalles.find(
      (prod) => prod.productoId == productoSeleccionado
    );

    let nuevosDetalles;
    if (productoYaExistente) {
      // Si el producto ya existe, actualiza la cantidad y el total
      nuevosDetalles = detalles.map((prod) =>
        prod.productoId == productoSeleccionado
          ? {
              ...prod,
              cantidad: cantidad,
              totalProducto: cantidad * precio,
            }
          : prod
      );
    } else {
      // Si no existe, lo agrega a la lista
      nuevosDetalles = [...detalles, productoConCantidad];
    }

    // Calcula el nuevo total general
    const totalNuevo = nuevosDetalles.reduce(
      (acum, prod) => acum + prod.totalProducto,
      0
    );

    // Actualiza los estados
    setDetalles(nuevosDetalles);
    setTotal(totalNuevo);
    setCantidad(1);
  };

  const eliminarProducto = (idProducto) => {
    const nuevosDetalles = detalles.filter(
      (prod) => prod.productoId !== idProducto
    );
    const totalNuevo = nuevosDetalles.reduce(
      (acum, prod) => acum + prod.totalProducto,
      0
    );

    setDetalles(nuevosDetalles);
    setTotal(totalNuevo);
  };

  const emitirFactura = async () => {
    try {
      const factura = {
        clienteId: CI,
        tipoPago: pago,
        productos: detalles,
      };
      console.error(factura);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/facturas-internas`,
        factura,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFacturaGenerada(true);
      newFactura();
      alert("Factura emitida exitosamente");
    } catch (error) {
      console.error("Error al emitir la factura:", error);
      alert("Error al emitir la factura");
    }
  };

  return (
    <div className="background">
      <h2>Emitir Factura Interna</h2>

      {/* Flujo Principal */}
      <div className="form">
        <div className="form-group">
          <label htmlFor="precio">CI</label>
          <input
            id="CI"
            type="number"
            className="form-group input"
            value={CI}
            onChange={(e) => setCI(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="precio">Pago</label>
          <div className="radio-buttons">
            <label>
              Efectivo
              <input
                type="radio"
                checked={pago === "efectivo"}
                onChange={() => {
                  setPago("efectivo");
                }}
              />
            </label>
            <label>
              Tarjeta
              <input
                type="radio"
                checked={pago === "tarjeta"}
                onChange={() => {
                  setPago("tarjeta");
                }}
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="producto">Seleccionar producto</label>
          <select
            id="producto"
            className="form-group input"
            value={productoSeleccionado}
            onChange={(e) => {
              setProductoSeleccionado(e.target.value);
              setPrecio(
                productos.find((prod) => prod.ide == e.target.value).precio
              );
            }}
          >
            <option value="">Seleccione un producto</option>
            {productos.map((prod) => (
              <option key={prod.ide} value={prod.ide}>
                {prod.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="cantidad">Cantidad</label>
          <input
            id="cantidad"
            type="number"
            min="1"
            max={
              productoSeleccionado
                ? productos.find((prod) => prod.ide == productoSeleccionado)
                    .stock
                : 1
            }
            className="form-group input"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
          />
          Disponible en stock:
          {productoSeleccionado
            ? productos.find((prod) => prod.ide == productoSeleccionado).stock
            : 0}
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio</label>
          <input
            id="precio"
            type="number"
            min="0"
            className="form-group input"
            value={precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
          />
        </div>

        <button className="btn" onClick={agregarProducto}>
          Agregar Producto
        </button>
        <button className="btn" onClick={newFactura}>
          Nueva Factura
        </button>
      </div>

      {/* Resumen de la factura */}
      <div className="table-container">
        <h3>Resumen de la Factura</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad </th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((producto, index) => (
              <tr key={index}>
                <td>{producto.nombre}</td>
                <td>{producto.cantidad}</td>
                <td>${producto.totalProducto}</td>
                <td style={{ position: "relative", width: "30px" }}>
                  <button
                    className="btn-remove"
                    onClick={() => eliminarProducto(producto.productoId)}
                    title="Eliminar producto"
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          <strong>Total a Pagar: </strong>${total}
        </p>
        <button className="btn" onClick={emitirFactura}>
          Emitir Factura
        </button>
      </div>

      {/* Estado de la factura */}
      {facturaGenerada && (
        <div className="factura-generada">Factura generada con éxito!</div>
      )}

      {/* Cargando y error */}
      {loading && <p>Cargando productos...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Factura;
