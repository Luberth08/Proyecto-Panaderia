const express = require("express");
const {
  createInsumo,
  readInsumo,
  readInsumoById,
  updateInsumo,
  deleteInsumo,
} = require("../../controllers/inventario/insumo.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para agregar un nuevo insumo
router.post("/", verificarPermiso("CREAR_INSUMO"), createInsumo);

// Ruta para leer todos los insumos
router.get("/", verificarPermiso("VER_INSUMO"), readInsumo);

// Ruta para leer un insumo por su ID
router.get("/:id", verificarPermiso("VER_INSUMO"), readInsumoById);

// Ruta para actualizar un insumo por su ID
router.put("/:id", verificarPermiso("MODIFICAR_INSUMO"), updateInsumo);

// Ruta para eliminar un insumo por su ID
router.delete("/:id", verificarPermiso("ELIMINAR_INSUMO"), deleteInsumo);

module.exports = router;
