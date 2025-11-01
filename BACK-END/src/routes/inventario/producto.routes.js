const express = require("express");
const {
  createProducto,
  readProducto,
  readProductoById,
  updateProducto,
  deleteProducto,
} = require("../../controllers/inventario/producto.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para agregar un nuevo producto
router.post("/", verificarPermiso("CREAR_PRODUCTO"), createProducto);

// Ruta para obtener todos los productos
router.get("/", verificarPermiso("VER_PRODUCTO"), readProducto);

// Ruta para obtener un producto por su ID
router.get("/:id", verificarPermiso("VER_PRODUCTO"), readProductoById);

// Ruta para actualizar un producto por su ID
router.put("/:id", verificarPermiso("MODIFICAR_PRODUCTO"), updateProducto);

// Ruta para eliminar un producto por su ID
router.delete("/:id", verificarPermiso("ELIMINAR_PRODUCTO"), deleteProducto);

module.exports = router;