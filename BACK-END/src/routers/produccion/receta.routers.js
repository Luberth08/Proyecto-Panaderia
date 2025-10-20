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

// Crear receta
router.post("/create", verificarPermiso("CREAR_RECETA"), createReceta);

// Leer todas las recetas
router.get("/read", verificarPermiso("VER_RECETA"), readReceta);

// Leer receta por ID
router.get("/read/:id", verificarPermiso("VER_RECETA"), readRecetaById);

// Actualizar receta
router.put("/update/:id", verificarPermiso("MODIFICAR_RECETA"), updateReceta);

// Eliminar receta
router.delete("/delete/:id", verificarPermiso("ELIMINAR_RECETA"), deleteReceta);

module.exports = router;
