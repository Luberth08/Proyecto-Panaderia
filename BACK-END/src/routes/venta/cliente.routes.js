const express = require("express");
const {
  createCliente,
  readCliente,
  readClienteByCi,
  updateCliente,
  deleteCliente,
} = require("../../controllers/venta/cliente.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para crear un cliente
router.post("/", verificarPermiso("CREAR_CLIENTE"), createCliente);

// Ruta para obtener todos los clientes
router.get("/", verificarPermiso("VER_CLIENTE"), readCliente);

// Ruta para obtener un cliente por CI
router.get("/:ci", verificarPermiso("VER_CLIENTE"), readClienteByCi);

// Ruta para actualizar un cliente
router.put("/:ci", verificarPermiso("MODIFICAR_CLIENTE"), updateCliente);

// Ruta para eliminar un cliente
router.delete("/:ci", verificarPermiso("ELIMINAR_CLIENTE"), deleteCliente);

module.exports = router;
