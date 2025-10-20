const express = require("express");
const {
  createRol,
  readRol,
  readRolById,
  updateRol,
  deleteRol,
} = require("../../controllers/usuario/rol.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para agregar un rol
router.post("/create", verificarPermiso("CREAR_ROL"), createRol);

// Ruta para obtener todos los roles
router.get("/read", verificarPermiso("VER_ROL"), readRol);

// Ruta para obtener un rol por ID
router.get("/read/:ide", verificarPermiso("VER_ROL"), readRolById);

// Ruta para modificar un rol
router.put("/update/:ide", verificarPermiso("MODIFICAR_ROL"), updateRol);

// Ruta para eliminar un rol
router.delete("/delete/:ide", verificarPermiso("ELIMINAR_ROL"), deleteRol);

module.exports = router;
