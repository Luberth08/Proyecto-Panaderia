const express = require("express");
const {
  createProveedor,
  readProveedor,
  readProveedorById,
  updateProveedor,
  deleteProveedor,
} = require("../../controllers/compra/proveedor.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para agregar un nuevo proveedor
router.post("/", verificarPermiso("CREAR_PROVEEDOR"), createProveedor);

// Ruta para obtener todos los proveedores
router.get("/", verificarPermiso("VER_PROVEEDOR"), readProveedor);

// Ruta para obtener un proveedor por su codigo
router.get("/:codigo", verificarPermiso("VER_PROVEEDOR"), readProveedorById);

// Ruta para actualizar un proveedor por su codigo
router.put("/:codigo", verificarPermiso("MODIFICAR_PROVEEDOR"), updateProveedor);

// Ruta para eliminar un proveedor por su codigo
router.delete("/:codigo", verificarPermiso("ELIMINAR_PROVEEDOR"), deleteProveedor);

module.exports = router;
