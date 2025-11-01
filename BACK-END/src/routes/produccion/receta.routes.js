const express = require("express");
const {
  createReceta,
  readReceta,
  readRecetaById,
  updateReceta,
  deleteReceta,
} = require("../../controllers/produccion/receta.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para añadir una nueva receta
router.post("/", verificarPermiso("CREAR_RECETA"), createReceta);

// Ruta para obtener todas las recetas
router.get("/", verificarPermiso("VER_RECETA"), readReceta);

// Ruta para obtener una receta por su ID
router.get("/:id", verificarPermiso("VER_RECETA"), readRecetaById);

// Ruta para actualizar una receta por su ID
router.put("/:id", verificarPermiso("MODIFICAR_RECETA"), updateReceta);

// Ruta para eliminar una receta por su ID
router.delete("/:id", verificarPermiso("ELIMINAR_RECETA"), deleteReceta);

module.exports = router;
