const express = require("express");
const {
  createPedido,
  readPedido,
  readPedidoById,
  updatePedido,
  confirmarEntregaPedido,
  obtenerEstadoPedido,
  deletePedido,
} = require("../../controllers/venta/pedido.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para crear un pedido
router.post("/", verificarPermiso("CREAR_PEDIDO"), createPedido);

// Ruta para obtener todos los pedidos
router.get("/", verificarPermiso("VER_PEDIDO"), readPedido);

// Ruta para obtener estado de un pedido
router.get("/:id/estado", verificarPermiso("VER_PEDIDO"), obtenerEstadoPedido);

// Ruta para confirmar entrega de un pedido
router.put("/:id/confirmar-entrega", verificarPermiso("CONFIRMAR_ENTREGA_PEDIDO"), confirmarEntregaPedido);

// Ruta para obtener un pedido por ID
router.get("/:id", verificarPermiso("VER_PEDIDO"), readPedidoById);

// Ruta para actualizar un pedido
router.put("/:id", verificarPermiso("MODIFICAR_PEDIDO"), updatePedido);

// Ruta para eliminar un pedido
router.delete("/:id", verificarPermiso("ELIMINAR_PEDIDO"), deletePedido);

module.exports = router;
