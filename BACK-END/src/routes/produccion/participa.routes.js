const express = require("express");
const {
  createParticipa,
  readParticipa,
  readParticipaByIds,
  updateParticipa,
  deleteParticipa
} = require("../../controllers/produccion/participa.controllers");

const router = express.Router();
const verificarPermiso = require("../../middleware/verificar_permiso.middleware");

// Ruta para agregar la participacion de un usuario a una produccion
router.post("/", verificarPermiso("CREAR_PARTICIPA"), createParticipa);

// Ruta para obtener las participaciones en las producciones
router.get("/", verificarPermiso("VER_PARTICIPA"), readParticipa);

// Ruta para obtener una participacion de un usuario en una produccion por su IDs
router.get("/:id_usuario/:id_produccion", verificarPermiso("VER_PARTICIPA"), readParticipaByIds);

// Ruta para actualizar la informacion de una participacion de un usuario en una produccion por su IDs
router.put("/:id_usuario/:id_produccion", verificarPermiso("MODIFICAR_PARTICIPA"), updateParticipa);

// Ruta para eliminar la participacion de un usuario en una produccion por su IDs
router.delete("/:id_usuario/:id_produccion", verificarPermiso("ELIMINAR_PARTICIPA"), deleteParticipa);

module.exports = router;
