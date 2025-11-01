const express = require("express");
const { login, logout } = require("../../controllers/usuario/auth.controllers");
const { verificarToken } = require("../../middleware/verificar_token.middleware");

const router = express.Router();

// Ruta para hacer login 
router.post("/login", login);

// Ruta para hacer logout
router.post("/logout", verificarToken, logout);

module.exports = router;
