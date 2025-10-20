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

// Crear proveedor
router.post("/create", verificarPermiso("CREAR_PROVEEDOR"), createProveedor);

// Leer todos los proveedores
router.get("/read", verificarPermiso("VER_PROVEEDOR"), readProveedor);

// Leer proveedor por código
router.get("/read/:codigo", verificarPermiso("VER_PROVEEDOR"), readProveedorById);

// Actualizar proveedor
router.put("/update/:codigo", verificarPermiso("MODIFICAR_PROVEEDOR"), updateProveedor);

// Eliminar proveedor
router.delete("/delete/:codigo", verificarPermiso("ELIMINAR_PROVEEDOR"), deleteProveedor);

module.exports = router;
