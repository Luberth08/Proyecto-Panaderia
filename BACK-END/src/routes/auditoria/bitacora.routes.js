const express = require("express");
const { 
  readBitacora,
  readBitacoraById
} = require("../../controllers/auditoria/bitacora.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para obtener todas las acciones realizadas en el sistema
router.get("/", verificarPermiso("VER_BITACORA"), readBitacora);

// Ruta para obtener una accion en especifico mediante su ID
router.get("/:id", verificarPermiso("VER_BITACORA"), readBitacoraById);

module.exports = router;
