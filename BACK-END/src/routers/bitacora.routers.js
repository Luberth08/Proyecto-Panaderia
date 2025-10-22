const express = require("express");
const { 
  readBitacoras,
  readDetalleByBitacora,
  readAllDetalles
} = require("../controllers/bitacora.controllers");

const router = express.Router();
const verificarPermiso = require("../middleware/verificar_permiso.middleware");

// Obtener todas las bitácoras
router.get("/read", verificarPermiso("VER_BITACORA"), readBitacoras);

// Obtener los detalles de una bitácora específica
router.get("/detalle/:id", verificarPermiso("VER_BITACORA"), readDetalleByBitacora);

// Obtener todos los detalles (modo histórico)
router.get("/detalles", verificarPermiso("VER_BITACORA"), readAllDetalles);

module.exports = router;
