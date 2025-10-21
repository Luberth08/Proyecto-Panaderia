import React, { useState, useEffect } from "react";
import axios from "axios";

export const Compra = () => {
  const [productos, setProductos] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tipo, setTipo] = useState("");
  const [codigo_proveedor, setCodigo_proveedor] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [precio, setPrecio] = useState(0);

  const [total, setTotal] = useState(0);
  const [fecha_pedido, setFechaPedido] = useState("");
  const [fecha_entrega, setFechaEntrega] = useState("");
  const [detalleProductos, setDetalleProductos] = useState([]);
  const [detalleInsumos, setDetalleInsumos] = useState([]);
  const [error, setError] = useState("");

  // Obtener el token desde el almacenamiento local o desde donde lo guardes
  const token = localStorage.getItem("token"); // Asegúrate de obtener el token de la fuente correcta

  // Cargar productos, insumos y proveedores desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosResponse, insumosResponse, proveedoresResponse] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/api/productos`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${import.meta.env.VITE_API_URL}/api/insumos`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${import.meta.env.VITE_API_URL}/api/proveedores`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setProductos(productosResponse.data);
        setInsumos(insumosResponse.data);
        setProveedores(proveedoresResponse.data.proveedores);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, [token]); // Dependiendo del token, si cambia, vuelve a cargar los datos

  useEffect(() => {
    recalcularTotal();
  }, [detalleProductos, detalleInsumos]);
  const handleAgregarProducto = () => {
    if (!cantidad || !precio || !selected) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const detalle = {
      id_producto: tipo === "producto" ? selected.ide : null,
      id_insumo: tipo === "insumo" ? selected.ide : null,
      nombre: selected.nombre,
      cantidad: parseFloat(cantidad),
      costo_compra: parseFloat(precio),
      precio: parseFloat(precio),
      total: parseFloat(cantidad) * parseFloat(precio),
      unidad_medida: tipo === "insumo" ? selected.medida : null,
    };
    agregarDetalle(detalle);
    // Calcula el nuevo total general

    // Resetear selección después de agregar
    setError("");
  };

  const agregarDetalle = (detalle) => {
    const detalles = tipo === "producto" ? detalleProductos : detalleInsumos;
    if (tipo === "producto") {
      const nuevosDetalles = detalles.some(
        (item) => item.id_producto === detalle.id_producto
      )
        ? detalles.map((item) =>
            item.id_producto === detalle.id_producto
              ? {
                  ...item,
                  costo_compra: detalle.precio,
                  cantidad: detalle.cantidad,
                  total: detalle.total,
                }
              : item
          )
        : [...detalles, detalle];

      setDetalleProductos(nuevosDetalles);
    } else {
      const nuevosDetalles = detalles.some(
        (item) => item.id_insumo === detalle.id_insumo
      )
        ? detalles.map((item) =>
            item.id_insumo === detalle.id_insumo
              ? {
                  ...item,
                  precio: detalle.precio,
                  cantidad: detalle.cantidad,
                  total: detalle.total,
                }
              : item
          )
        : [...detalles, detalle];
      setDetalleInsumos(nuevosDetalles);
    }
  };

  const handleGuardarCompra = () => {
    if (
      !fecha_pedido ||
      !fecha_entrega ||
      !codigo_proveedor ||
      detalleProductos.length === 0
    ) {
      setError(
        "Debe completar todos los campos y agregar productos o insumos."
      );
      return;
    }

    const nuevaCompra = {
      fecha_pedido,
      fecha_entrega,
      codigo_proveedor,
      productos: detalleProductos,
      insumos: detalleInsumos,
    };
    console.error(nuevaCompra);
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/notas-compra`, nuevaCompra, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Compra guardada exitosamente");
        setDetalleInsumos([]);
        setDetalleProductos([]);
        setFechaPedido("");
        setFechaEntrega("");
        setCodigo_proveedor(null);
        setError("");
      })
      .catch((error) => {
        console.error("Error al guardar compra:", error);
        setError("Error al guardar la compra.");
      });
  };

  const recalcularTotal = () => {
    const totalProductos = detalleProductos.reduce(
      (acum, prod) => acum + prod.total,
      0
    );
    const totalInsumos = detalleInsumos.reduce(
      (acum, ins) => acum + ins.total,
      0
    );
    setTotal(totalProductos + totalInsumos);
  };

  const eliminarDetalle = (index, tipo) => {
    if (tipo === "producto") {
      setDetalleProductos(detalleProductos.filter((_, i) => i !== index));
    } else {
      setDetalleInsumos(detalleInsumos.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="background">
      <h2>Crear Nota de Compra</h2>

      <div className="form">
        <div className="form-group">
          <label>Proveedor</label>
          <select
            value={codigo_proveedor}
            onChange={(e) => setCodigo_proveedor(e.target.value)}
          >
            <option value="">Seleccionar Proveedor</option>
            {proveedores.map((prov) => (
              <option key={prov.codigo} value={prov.codigo}>
                {prov.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Fecha de Pedido</label>
          <input
            type="date"
            value={fecha_pedido}
            onChange={(e) => setFechaPedido(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Fecha de Entrega</label>
          <input
            type="date"
            value={fecha_entrega}
            onChange={(e) => setFechaEntrega(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Seleccionar Producto o Insumo</label>
          <div className="radio-buttons">
            <label>
              Producto
              <input
                type="radio"
                checked={tipo === "producto"}
                onChange={() => {
                  setTipo("producto");
                }}
              />
            </label>
            <label>
              Insumo
              <input
                type="radio"
                checked={tipo === "insumo"}
                onChange={() => {
                  setTipo("insumo");
                }}
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Producto o Insumo</label>
          <select
            value={selected ? selected.ide : ""}
            onChange={(e) => {
              const item =
                tipo === "producto"
                  ? productos.find(
                      (prod) => prod.ide === parseInt(e.target.value)
                    )
                  : insumos.find((ins) => ins.ide === parseInt(e.target.value));
              setSelected(item);
              setPrecio(item ? item.precio : 0);
            }}
          >
            <option value="">Seleccionar</option>
            {tipo === "producto"
              ? productos.map((prod) => (
                  <option key={prod.ide} value={prod.ide}>
                    {prod.nombre}
                  </option>
                ))
              : insumos.map((ins) => (
                  <option key={ins.ide} value={ins.ide}>
                    {ins.nombre}
                  </option>
                ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            Cantidad {tipo == "insumo" && selected ? selected.medida : ""}
          </label>
          <input
            type="number"
            value={cantidad}
            max={selected ? selected.stock : 0}
            onChange={(e) => setCantidad(e.target.value)}
          />
          Disponible en stock: {selected ? selected.stock : 0}
        </div>

        <div className="form-group">
          <label>Precio</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>

        <button className="action-buttons" onClick={handleAgregarProducto}>
          Agregar Producto/ Insumo
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="table-container">
        <h3>Resumen de Compra</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {detalleProductos.map((item, index) => (
              <tr key={index}>
                <td>{item.nombre}</td>
                <td>{item.cantidad}</td>
                <td>{item.precio}</td>
                <td>{item.total}</td>
                <td>
                  <button onClick={() => eliminarDetalle(index, "producto")}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {detalleInsumos.map((item, index) => (
              <tr key={index}>
                <td>{item.nombre}</td>
                <td>{item.cantidad}</td>
                <td>{item.precio}</td>
                <td>{item.total}</td>
                <td>
                  <button onClick={() => eliminarDetalle(index, "insumo")}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>total : {total}</p>
        <button className="action-buttons" onClick={handleGuardarCompra}>
          Guardar Compra
        </button>
      </div>
    </div>
  );
};
export default Compra;
