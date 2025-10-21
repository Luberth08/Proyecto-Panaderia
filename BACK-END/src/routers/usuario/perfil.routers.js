// routers/usuario/perfil.routers.js
const express = require("express");
const { getPerfil, updatePerfil } = require("../../controllers/usuario/perfil.controllers");
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

const router = express.Router();

router.get("/read", verificarPermiso("VER_USUARIO"), getPerfil);
router.put("/update", verificarPermiso("MODIFICAR_USUARIO"), updatePerfil);

module.exports = router;