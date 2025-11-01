const express = require("express");
const {
  createDetalleReceta,
  readDetalleReceta,
  readDetalleRecetaByIds,
  updateDetalleReceta,
  deleteDetalleReceta,
} = require("../../controllers/produccion/detalle_receta.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para agregar un detalle_receta
router.post("/", verificarPermiso("CREAR_DETALLE_RECETA"), createDetalleReceta);

// Ruta para obtener todos los detalle_recetas
router.get("/", verificarPermiso("VER_DETALLE_RECETA"), readDetalleReceta);

// Ruta para obtener un detalle_receta por sus IDs
router.get("/:id_receta/:id_insumo", verificarPermiso("VER_DETALLE_RECETA"), readDetalleRecetaByIds);

// Ruta para actualizar un detalle_receta por sus IDs
router.put("/:id_receta/:id_insumo", verificarPermiso("MODIFICAR_DETALLE_RECETA"), updateDetalleReceta);

// Ruta para eliminar un detalle_receta por sus IDs
router.delete("/:id_receta/:id_insumo", verificarPermiso("ELIMINAR_DETALLE_RECETA"), deleteDetalleReceta);

module.exports = router;
