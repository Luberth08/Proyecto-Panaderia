// routers/usuario/perfil.routers.js
const express = require("express");
const { getPerfil, updatePerfil } = require("../../controllers/usuario/perfil.controllers");
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

const router = express.Router();

// Ruta para obtener los datos del usuario actualmente logueado 
router.get("/", verificarPermiso("VER_USUARIO"), getPerfil);

// Ruta para cambiar los datos del usuario actualmente logueado
router.put("/", verificarPermiso("MODIFICAR_USUARIO"), updatePerfil);

module.exports = router;