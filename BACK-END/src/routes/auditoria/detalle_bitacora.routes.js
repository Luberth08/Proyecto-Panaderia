const express = require("express");
const { 
  readDetalleBitacoraByBitacora
} = require("../../controllers/auditoria/detalle_bitacora.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para obtener todos los detalles de acciones realizadas por un usuario
router.get("/:id_bitacora", verificarPermiso("VER_BITACORA"), readDetalleBitacoraByBitacora);

module.exports = router;
