const express = require("express");
const {
  createPermiso,
  readPermiso,
  readPermisoById,
  updatePermiso,
  deletePermiso,
} = require("../../controllers/usuario/permiso.controllers");
const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para agregar un permiso
router.post("/create", verificarPermiso("CREAR_PERMISO"), createPermiso);

// Ruta para obtener todos los permisos
router.get("/read", verificarPermiso("VER_PERMISO"), readPermiso);

// Ruta para obtener un permiso por ID
router.get("/read/:id", verificarPermiso("VER_PERMISO"), readPermisoById);

// Ruta para modificar un permiso
router.put("/update/:id", verificarPermiso("MODIFICAR_PERMISO"), updatePermiso);

// Ruta para eliminar un permiso
router.delete("/delete/:id", verificarPermiso("ELIMINAR_PERMISO"), deletePermiso);

module.exports = router;