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

// Crear producto
router.post("/create", verificarPermiso("CREAR_PRODUCTO"), createProducto);

// Leer todos los productos
router.get("/read", verificarPermiso("VER_PRODUCTO"), readProducto);

// Leer producto por ID
router.get("/read/:id", verificarPermiso("VER_PRODUCTO"), readProductoById);

// Actualizar producto
router.put("/update/:id", verificarPermiso("MODIFICAR_PRODUCTO"), updateProducto);

// Eliminar producto
router.delete("/delete/:id", verificarPermiso("ELIMINAR_PRODUCTO"), deleteProducto);

module.exports = router;