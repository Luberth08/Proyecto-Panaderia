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

// Crear insumo
router.post("/create", verificarPermiso("CREAR_INSUMO"), createInsumo);

// Leer todos los insumos
router.get("/read", verificarPermiso("VER_INSUMO"), readInsumo);

// Leer insumo por ID
router.get("/read/:id", verificarPermiso("VER_INSUMO"), readInsumoById);

// Actualizar insumo
router.put("/update/:id", verificarPermiso("MODIFICAR_INSUMO"), updateInsumo);

// Eliminar insumo
router.delete("/delete/:id", verificarPermiso("ELIMINAR_INSUMO"), deleteInsumo);

module.exports = router;
