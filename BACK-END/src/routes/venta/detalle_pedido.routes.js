const express = require("express");
const {
  createDetallePedido,
  readDetallePedido,
  readDetallePedidoByPedidoId,
  readDetallePedidoByIds,
  updateDetallePedido,
  deleteDetallePedido,
} = require("../../controllers/venta/detalle_pedido.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para crear un detalle de pedido
router.post("/", verificarPermiso("CREAR_DETALLE_PEDIDO"), createDetallePedido);

// Ruta para obtener todos los detalles de pedidos
router.get("/", verificarPermiso("VER_DETALLE_PEDIDO"), readDetallePedido);

// Ruta para obtener detalles de un pedido específico
router.get("/pedido/:id_pedido", verificarPermiso("VER_DETALLE_PEDIDO"), readDetallePedidoByPedidoId);

// Ruta para obtener un detalle específico
router.get("/:id_producto/:id_pedido", verificarPermiso("VER_DETALLE_PEDIDO"), readDetallePedidoByIds);

// Ruta para actualizar un detalle de pedido
router.put("/:id_producto/:id_pedido", verificarPermiso("MODIFICAR_DETALLE_PEDIDO"), updateDetallePedido);

// Ruta para eliminar un detalle de pedido
router.delete("/:id_producto/:id_pedido", verificarPermiso("ELIMINAR_DETALLE_PEDIDO"), deleteDetallePedido);

module.exports = router;
