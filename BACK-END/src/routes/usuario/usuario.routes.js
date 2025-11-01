const express = require("express");
const {
  createUser,
  readUser,
  readUserByNombre,
  updateUser,
  deleteUser,
} = require("../../controllers/usuario/usuario.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para agregar un usuario
router.post("/", verificarPermiso("CREAR_USUARIO"), createUser);

// Ruta para obtener todos los usuarios 
router.get("/", verificarPermiso("VER_USUARIO"),readUser);

// Ruta para obtener un usuario por su código
router.get("/:nombre", verificarPermiso("VER_USUARIO"), readUserByNombre);

// Ruta para modificar un usuario
router.put("/:nombre", verificarPermiso("MODIFICAR_USUARIO"), updateUser);

// Ruta para eliminar un usuario
router.delete("/:nombre", verificarPermiso("ELIMINAR_USUARIO"), deleteUser);

module.exports = router;