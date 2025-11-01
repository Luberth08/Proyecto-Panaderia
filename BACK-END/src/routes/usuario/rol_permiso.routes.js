const express = require("express");
const {
  createRolPermiso,
  readRolPermiso,
  readRolPermisoByIds,
  deleteRolPermiso,
} = require("../../controllers/usuario/rol_permiso.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para asignar un permiso a un rol
router.post("/", verificarPermiso("CREAR_ROL_PERMISO"), createRolPermiso);

// Ruta para obtener todos los roles con sus permisos
router.get("/", verificarPermiso("VER_ROL_PERMISO"), readRolPermiso);

// Ruta para obtener una asocion entre un rol y un permiso por sus IDs
router.get("/:id_rol/:id_permiso", verificarPermiso("VER_ROL_PERMISO"), readRolPermisoByIds);

// Ruta para eliminar un permiso de un rol por sus IDs
router.delete("/:id_rol/:id_permiso", verificarPermiso("ELIMINAR_ROL_PERMISO"), deleteRolPermiso);

module.exports = router;