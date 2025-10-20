import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Plugin para manejar tablas
import "../../styles/reportes.css";

const FacturaReporte = () => {
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFinal: "",
    usuario: "",
    cliente: "",
  });
  const [datos, setDatos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/reporte-factura-interna`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const detallesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/detalles-facturas-internas`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDatos(response.data.result);
        setDatosFiltrados(response.data.result); // Inicialmente muestra todos los datos
        setDetalles(detallesResponse.data.result);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError("Hubo un problema al cargar los datos. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiltrar = (e) => {
    e.preventDefault();

    const { fechaInicio, fechaFinal, usuario, cliente } = filtros;

    const datosFiltrados = datos.filter((factura) => {
      const fechaFactura = new Date(factura.fecha_factura);
      const inicio = fechaInicio ? new Date(fechaInicio) : null;
      const final = fechaFinal ? new Date(fechaFinal) : null;

      const cumpleFecha =
        (!inicio || fechaFactura >= inicio) &&
        (!final || fechaFactura <= final);
      const cumpleUsuario = usuario
        ? factura.nombre_usuario.toLowerCase().includes(usuario.toLowerCase())
        : true;
      const cumpleCliente = cliente
        ? factura.ci_cliente.toString().includes(cliente)
        : true;

      return cumpleFecha && cumpleUsuario && cumpleCliente;
    });

    setDatosFiltrados(datosFiltrados);
  };

  const generarPDF = () => {
    const doc = new jsPDF();

    // Título del PDF
    doc.text("Reporte de Facturas", 14, 20);

    // Configuración de la tabla principal
    const columnas = ["ID Factura", "Fecha", "Usuario", "Cliente", "Total"];
    const filas = datosFiltrados.map((factura) => [
      factura.id_factura,
      new Date(factura.fecha_factura).toLocaleDateString(),
      factura.nombre_usuario,
      factura.ci_cliente,
      `$${factura.total_factura}`,
    ]);

    doc.autoTable({
      head: [columnas],
      body: filas,
      startY: 30,
    });

    // Detalles de cada factura
    datosFiltrados.forEach((factura) => {
      const detallesFactura = detalles.filter(
        (detalle) => detalle.codigo_control === factura.id_factura
      );

      if (detallesFactura.length > 0) {
        doc.text(
          `Detalles de Factura ID: ${factura.id_factura}`,
          14,
          doc.lastAutoTable.finalY + 10
        );
        doc.autoTable({
          head: [["Producto", "Cantidad", "Precio", "Total"]],
          body: detallesFactura.map((detalle) => [
            detalle.nombre_producto,
            detalle.cantidad_producto,
            `$${detalle.precio_producto}`,
            `$${detalle.total_producto}`,
          ]),
          startY: doc.lastAutoTable.finalY + 15,
        });
      }
    });

    // Guardar el archivo PDF
    doc.save("reporte_facturas.pdf");
  };

  const toggleDetalles = (facturaId) => {
    setFacturaSeleccionada(
      facturaSeleccionada === facturaId ? null : facturaId
    );
  };

  return (
    <div className="reporte-container">
      <h1>Generar Reporte de Facturas</h1>

      {/* Filtros */}
      <form onSubmit={handleFiltrar} className="filtros-form">
        <div>
          <label>Fecha Inicio:</label>
          <input
            type="date"
            name="fechaInicio"
            value={filtros.fechaInicio}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Fecha Final:</label>
          <input
            type="date"
            name="fechaFinal"
            value={filtros.fechaFinal}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            name="usuario"
            value={filtros.usuario}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Cliente:</label>
          <input
            type="text"
            name="cliente"
            value={filtros.cliente}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Filtrar</button>
      </form>

      {/* Botón para generar PDF */}
      <button onClick={generarPDF} className="btn-pdf">
        Exportar a PDF
      </button>

      {/* Tabla de Datos */}
      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="tabla-container">
          <table className="tabla">
            <thead>
              <tr>
                <th>ID Factura</th>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.map((factura) => (
                <React.Fragment key={factura.id_factura}>
                  <tr>
                    <td>{factura.id_factura}</td>
                    <td>
                      {new Date(factura.fecha_factura).toLocaleDateString()}
                    </td>
                    <td>{factura.nombre_usuario}</td>
                    <td>{factura.ci_cliente}</td>
                    <td>${factura.total_factura}</td>
                    <td>
                      <button
                        onClick={() => toggleDetalles(factura.id_factura)}
                      >
                        {facturaSeleccionada === factura.id_factura
                          ? "Ocultar Detalles"
                          : "Ver Detalles"}
                      </button>
                    </td>
                  </tr>
                  {facturaSeleccionada === factura.id_factura && (
                    <tr>
                      <td colSpan="6">
                        <table className="tabla-detalles">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Precio</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detalles
                              .filter(
                                (detalle) =>
                                  detalle.codigo_control === factura.id_factura
                              )
                              .map((detalle) => (
                                <tr key={detalle.nombre_producto}>
                                  <td>{detalle.nombre_producto}</td>
                                  <td>{detalle.cantidad_producto}</td>
                                  <td>${detalle.precio_producto}</td>
                                  <td>${detalle.total_producto}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FacturaReporte;
