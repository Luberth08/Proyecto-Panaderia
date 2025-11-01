// routers/usuario/cambiar_contrasena.routers.js
const express = require("express");
const { cambiarContrasena } = require("../../controllers/usuario/cambiar_contrasena.controllers");
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

const router = express.Router();

// Ruta para cambiar la contraseña del usuario actualmente logueado
router.put("/", verificarPermiso("MODIFICAR_USUARIO"), cambiarContrasena);

module.exports = router;