const express = require("express");
const {
  generarReporteVentas,
  generarReporteProduccion,
  generarReporteInventario,
  generarReportePedidosClientes,
} = require("../../controllers/auditoria/reportes.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para generar reporte de ventas
router.get("/ventas", verificarPermiso("VER_REPORTE_VENTAS"), generarReporteVentas);

// Ruta para generar reporte de producción
router.get("/produccion", verificarPermiso("VER_REPORTE_PRODUCCION"), generarReporteProduccion);

// Ruta para generar reporte de inventario
router.get("/inventario", verificarPermiso("VER_REPORTE_INVENTARIO"), generarReporteInventario);

// Ruta para generar reporte de pedidos y clientes
router.get("/pedidos-clientes", verificarPermiso("VER_REPORTE_PEDIDOS"), generarReportePedidosClientes);

module.exports = router;
