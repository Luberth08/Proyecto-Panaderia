const express = require("express");
const {
  createCompraProducto,
  readComprasProducto,
  readCompraProductoByIds,
  updateCompraProducto,
  deleteCompraProducto,
} = require("../../controllers/compra/compra_producto.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para agregar una compra de un producto realizada
router.post("/", verificarPermiso("CREAR_COMPRA_PRODUCTO"), createCompraProducto);

// Ruta para obtener todas las compras de productos realizados
router.get("/", verificarPermiso("VER_COMPRA_PRODUCTO"), readComprasProducto);

// Ruta para obtener una compra de un producto por su ID
router.get("/:id_nota_compra/:id_producto", verificarPermiso("VER_COMPRA_PRODUCTO"), readCompraProductoByIds);

// Ruta para actualizar una compra de un producto por su ID
router.put("/:id_nota_compra/:id_producto", verificarPermiso("MODIFICAR_COMPRA_PRODUCTO"), updateCompraProducto);

// Ruta para eliminar una compra de un producto por su ID
router.delete("/:id_nota_compra/:id_producto", verificarPermiso("ELIMINAR_COMPRA_PRODUCTO"), deleteCompraProducto);

module.exports = router;
