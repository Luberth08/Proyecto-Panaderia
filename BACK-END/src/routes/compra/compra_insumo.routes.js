const express = require("express");
const {
  createCompraInsumo,
  readCompraInsumo,
  readCompraInsumoByIds,
  updateCompraInsumo,
  deleteCompraInsumo,
} = require("../../controllers/compra/compra_insumo.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para agregar una compra de un insumo realizado
router.post("/", verificarPermiso("CREAR_COMPRA_INSUMO"), createCompraInsumo);

// Ruta para obtener todas las compras de insumos realizados
router.get("/", verificarPermiso("VER_COMPRA_INSUMO"), readCompraInsumo);

// Ruta para obtene una compra de insumo realizado por su ID
router.get("/:id_nota_compra/:id_insumo", verificarPermiso("VER_COMPRA_INSUMO"), readCompraInsumoByIds);

// Ruta para actualizar una compra de insumo realizado por su ID
router.put("/:id_nota_compra/:id_insumo", verificarPermiso("MODIFICAR_COMPRA_INSUMO"), updateCompraInsumo);

// Ruta para eliminar una compra de insumo realizado por su ID
router.delete("/:id_nota_compra/:id_insumo", verificarPermiso("ELIMINAR_COMPRA_INSUMO"), deleteCompraInsumo);

module.exports = router;
