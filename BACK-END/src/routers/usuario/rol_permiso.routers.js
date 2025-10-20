const express = require("express");
const {
  createRolPermiso,
  readRolPermiso,
  readRolPermisoByIds,
  deleteRolPermiso,
} = require("../../controllers/usuario/rol_permiso.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Rutas para gestionar la relación entre roles y permisos
router.post("/create", verificarPermiso("CREAR_ROL_PERMISO"), createRolPermiso);

// Ruta para obtener todos los roles con sus permisos
router.get("/read", verificarPermiso("VER_ROL_PERMISO"), readRolPermiso);

// Ruta para obtener un rol_permiso por IDs
router.get("/read/:id_rol/:id_permiso", verificarPermiso("VER_ROL_PERMISO"), readRolPermisoByIds);

// Ruta para eliminar un rol_permiso por IDs
router.delete("/delete/:id_rol/:id_permiso", verificarPermiso("ELIMINAR_ROL_PERMISO"), deleteRolPermiso);

module.exports = router;