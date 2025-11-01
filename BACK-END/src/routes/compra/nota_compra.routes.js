const express = require("express");
const {
  createNotaCompra,
  readNotasCompra,
  readNotaCompraById,
  updateNotaCompra,
  deleteNotaCompra
} = require("../../controllers/compra/nota_compra.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para agregar una nueva nota de compra
router.post("/", verificarPermiso("CREAR_NOTA_COMPRA"), createNotaCompra);

// Ruta para obtener todas las notas de compra realizadas
router.get("/", verificarPermiso("VER_NOTA_COMPRA"), readNotasCompra);

// Ruta para obtener una nota de compra por su ID
router.get("/:id", verificarPermiso("VER_NOTA_COMPRA"), readNotaCompraById);

// Ruta para actualizar una nota de compra por su ID
router.put("/:id", verificarPermiso("MODIFICAR_NOTA_COMPRA"), updateNotaCompra);

// Ruta para eliminar una nota de compra por su ID
router.delete("/:id", verificarPermiso("ELIMINAR_NOTA_COMPRA"), deleteNotaCompra);

module.exports = router;
