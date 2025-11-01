const express = require("express");

const {
  createCategoria,
  readCategoria,
  readCategoriaById,
  updateCategoria,
  deleteCategoria,
} = require("../../controllers/inventario/categoria.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para agregar una nueva categoría
router.post("/", verificarPermiso("CREAR_CATEGORIA"), createCategoria);

// Ruta para obtener todas las categorías
router.get("/", verificarPermiso("VER_CATEGORIA"), readCategoria);

// Ruta para obtener una categoría por su ID
router.get("/:id", verificarPermiso("VER_CATEGORIA"), readCategoriaById);

// Ruta para actualizar una categoría por su ID
router.put("/:id", verificarPermiso("MODIFICAR_CATEGORIA"), updateCategoria);

// Ruta para eliminar una categoría por su ID
router.delete("/:id", verificarPermiso("ELIMINAR_CATEGORIA"), deleteCategoria);

module.exports = router;