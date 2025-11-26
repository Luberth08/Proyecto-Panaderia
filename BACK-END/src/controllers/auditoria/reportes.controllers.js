const pool = require("../../db.js");
const { logEvent } = require("../../utils/bitacoraUtils.js");
const { generarPDF } = require("../../utils/reportes/generador_pdf.js");
const { generarExcel } = require("../../utils/reportes/generador_excel.js");
const { generarTXT } = require("../../utils/reportes/generador_txt.js");

// Genera reporte de ventas
const generarReporteVentas = async (req, res) => {
  const { formato, fecha_inicio, fecha_fin } = req.query;
  const { bitacoraId } = req.user;

  try {
    let query = `SELECT p.id, c.nombre as cliente, p.total, p.fecha_pedido, 
                        CASE WHEN p.entregado = true THEN 'Entregado' ELSE 'Pendiente' END as estado
                 FROM pedido p
                 LEFT JOIN cliente c ON p.ci_cliente = c.ci
                 WHERE 1=1`;

    const params = [];

    if (fecha_inicio && fecha_fin) {
      query += ` AND p.fecha_pedido BETWEEN $${params.length + 1} AND $${params.length + 2}`;
      params.push(fecha_inicio, fecha_fin);
    }

    query += ` ORDER BY p.fecha_pedido DESC`;

    const result = await pool.query(query, params);

    const titulo = "Reporte de Ventas";
    const columnas = ["ID", "Cliente", "Total", "Fecha Pedido", "Estado"];
    let buffer;

    switch (formato?.toUpperCase()) {
      case "PDF":
        buffer = await generarPDF(titulo, result.rows, columnas);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_ventas.pdf");
        break;
      case "EXCEL":
        buffer = await generarExcel(titulo, result.rows, columnas);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_ventas.xlsx");
        break;
      case "TXT":
        buffer = await generarTXT(titulo, result.rows, columnas);
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_ventas.txt");
        break;
      default:
        return res.status(400).json({ message: "Formato no válido. Use PDF, EXCEL o TXT" });
    }

    await logEvent(bitacoraId, "GET", "api/reporte/ventas", `Reporte de ventas generado en ${formato}`);
    res.send(buffer);
  } catch (error) {
    console.error("Error al generar reporte de ventas:", error);
    res.status(500).json({ message: "Error al generar reporte" });
  }
};

// Genera reporte de producción
const generarReporteProduccion = async (req, res) => {
  const { formato, fecha_inicio, fecha_fin } = req.query;
  const { bitacoraId } = req.user;

  try {
    let query = `SELECT pr.id, p.nombre as producto, pr.descripcion, pr.fecha, 
                        CASE WHEN pr.terminado = true THEN 'Terminado' ELSE 'En Proceso' END as estado
                 FROM produccion pr
                 LEFT JOIN receta r ON pr.id_receta = r.id
                 LEFT JOIN producto p ON r.id_producto = p.id
                 WHERE 1=1`;

    const params = [];

    if (fecha_inicio && fecha_fin) {
      query += ` AND pr.fecha BETWEEN $${params.length + 1} AND $${params.length + 2}`;
      params.push(fecha_inicio, fecha_fin);
    }

    query += ` ORDER BY pr.fecha DESC`;

    const result = await pool.query(query, params);

    const titulo = "Reporte de Producción";
    const columnas = ["ID", "Producto", "Descripción", "Fecha", "Estado"];
    let buffer;

    switch (formato?.toUpperCase()) {
      case "PDF":
        buffer = await generarPDF(titulo, result.rows, columnas);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_produccion.pdf");
        break;
      case "EXCEL":
        buffer = await generarExcel(titulo, result.rows, columnas);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_produccion.xlsx");
        break;
      case "TXT":
        buffer = await generarTXT(titulo, result.rows, columnas);
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_produccion.txt");
        break;
      default:
        return res.status(400).json({ message: "Formato no válido. Use PDF, EXCEL o TXT" });
    }

    await logEvent(bitacoraId, "GET", "api/reporte/produccion", `Reporte de producción generado en ${formato}`);
    res.send(buffer);
  } catch (error) {
    console.error("Error al generar reporte de producción:", error);
    res.status(500).json({ message: "Error al generar reporte" });
  }
};

// Genera reporte de inventario
const generarReporteInventario = async (req, res) => {
  const { formato } = req.query;
  const { bitacoraId } = req.user;

  try {
    const query = `SELECT i.id, i.nombre, i.medida, i.stock, i.stock_minimo,
                          CASE WHEN i.stock <= i.stock_minimo THEN 'Bajo' ELSE 'Normal' END as nivel
                   FROM insumo i
                   ORDER BY i.nombre ASC`;

    const result = await pool.query(query);

    const titulo = "Reporte de Inventario";
    const columnas = ["ID", "Nombre", "Medida", "Stock", "Stock Mínimo", "Nivel"];
    let buffer;

    switch (formato?.toUpperCase()) {
      case "PDF":
        buffer = await generarPDF(titulo, result.rows, columnas);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_inventario.pdf");
        break;
      case "EXCEL":
        buffer = await generarExcel(titulo, result.rows, columnas);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_inventario.xlsx");
        break;
      case "TXT":
        buffer = await generarTXT(titulo, result.rows, columnas);
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_inventario.txt");
        break;
      default:
        return res.status(400).json({ message: "Formato no válido. Use PDF, EXCEL o TXT" });
    }

    await logEvent(bitacoraId, "GET", "api/reporte/inventario", `Reporte de inventario generado en ${formato}`);
    res.send(buffer);
  } catch (error) {
    console.error("Error al generar reporte de inventario:", error);
    res.status(500).json({ message: "Error al generar reporte" });
  }
};

// Genera reporte de pedidos y clientes
const generarReportePedidosClientes = async (req, res) => {
  const { formato, fecha_inicio, fecha_fin } = req.query;
  const { bitacoraId } = req.user;

  try {
    let query = `SELECT p.id as pedido_id, c.ci, c.nombre as cliente, p.total, p.fecha_pedido,
                        CASE WHEN p.entregado = true THEN 'Entregado' ELSE 'Pendiente' END as estado
                 FROM pedido p
                 LEFT JOIN cliente c ON p.ci_cliente = c.ci
                 WHERE 1=1`;

    const params = [];

    if (fecha_inicio && fecha_fin) {
      query += ` AND p.fecha_pedido BETWEEN $${params.length + 1} AND $${params.length + 2}`;
      params.push(fecha_inicio, fecha_fin);
    }

    query += ` ORDER BY p.fecha_pedido DESC`;

    const result = await pool.query(query, params);

    const titulo = "Reporte de Pedidos y Clientes";
    const columnas = ["Pedido ID", "CI Cliente", "Cliente", "Total", "Fecha Pedido", "Estado"];
    let buffer;

    switch (formato?.toUpperCase()) {
      case "PDF":
        buffer = await generarPDF(titulo, result.rows, columnas);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_pedidos_clientes.pdf");
        break;
      case "EXCEL":
        buffer = await generarExcel(titulo, result.rows, columnas);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_pedidos_clientes.xlsx");
        break;
      case "TXT":
        buffer = await generarTXT(titulo, result.rows, columnas);
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_pedidos_clientes.txt");
        break;
      default:
        return res.status(400).json({ message: "Formato no válido. Use PDF, EXCEL o TXT" });
    }

    await logEvent(bitacoraId, "GET", "api/reporte/pedidos-clientes", `Reporte de pedidos y clientes generado en ${formato}`);
    res.send(buffer);
  } catch (error) {
    console.error("Error al generar reporte de pedidos y clientes:", error);
    res.status(500).json({ message: "Error al generar reporte" });
  }
};

module.exports = {
  generarReporteVentas,
  generarReporteProduccion,
  generarReporteInventario,
  generarReportePedidosClientes,
};
