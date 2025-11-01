const express = require("express");
const {
  createProduccion,
  readProduccion,
  readProduccionById,
  updateProduccion,
  deleteProduccion
} = require("../../controllers/produccion/produccion.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para agregar una nueva produccion
router.post("/", verificarPermiso("CREAR_PRODUCCION"), createProduccion);

// Ruta para obtener todas las producciones
router.get("/", verificarPermiso("VER_PRODUCCION"), readProduccion);

// Ruta para obtener una produccion por su ID
router.get("/:id", verificarPermiso("VER_PRODUCCION"), readProduccionById);

// Ruta para actualizar la informacion de una produccion por su ID
router.put("/:id", verificarPermiso("MODIFICAR_PRODUCCION"), updateProduccion);

// Ruta para eliminar una produccion por su ID
router.delete("/:id", verificarPermiso("ELIMINAR_PRODUCCION"), deleteProduccion);

module.exports = router;
