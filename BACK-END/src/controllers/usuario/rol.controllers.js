const pool = require("../../db.js");
const { logEvent } = require("../../utils/bitacoraUtils.js");

// ----------------------------
// Controlador para crear un nuevo rol
// ----------------------------
const createRol = async (req, res) => {
  const { nombre } = req.body;
  const { bitacoraId } = req.user;

  try {
    const existingRole = await pool.query(
      "SELECT * FROM rol WHERE nombre = $1", 
      [nombre]
    );
    if (existingRole.rows.length > 0) {
      return res.json({ message: "Este rol ya existe" });
    }
    
    await pool.query(
      "INSERT INTO rol (nombre) VALUES ($1)", 
      [nombre]
    );

    await logEvent(bitacoraId, "POST", "api/rol/create", `Rol ${nombre} creado`);

    return res.json({ message: "Rol creado exitosamente" });
  } catch (error) {
    console.error("Error al crear rol:", error);
    res.status(500).json({ message: "Error al crear rol" });
  }
};

// ----------------------------
// Controlador para obtener todos los roles
// ----------------------------
const readRol = async (req, res) => {
  const { bitacoraId } = req.user;

  try {
    const result = await pool.query("SELECT * FROM rol");

    await logEvent(bitacoraId, "GET", "api/rol/read", "Se consultaron todos los roles");

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener roles:", error);
    res.status(500).json({ message: "Error al obtener roles" });
  }
};

// ----------------------------
// Controlador para obtener un rol por ID
// ----------------------------
const readRolById = async (req, res) => {
  const { ide } = req.params;
  const { bitacoraId } = req.user;

  try {
    const result = await pool.query("SELECT * FROM rol WHERE id = $1", [ide]);

    await logEvent(bitacoraId, "GET", `api/rol/read/:${ide}`, `Se consultó el rol ${ide}`);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener rol:", error);
    res.status(500).json({ message: "Error al obtener rol" });
  }
};

// ----------------------------
// Controlador para actualizar un rol
// ----------------------------
const updateRol = async (req, res) => {
  const { ide } = req.params;
  const { nombre } = req.body;
  const { bitacoraId } = req.user;

  try {
    await pool.query(
      "UPDATE rol SET nombre = $1 WHERE id = $2", 
      [nombre, ide]
    );

    await logEvent(bitacoraId, "PUT", `api/rol/update/:${ide}`, `Rol ${ide} actualizado a ${nombre}`);

    return res.json({ message: "Rol actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    res.status(500).json({ message: "Error al actualizar rol" });
  }
};

// ----------------------------
// Controlador para eliminar un rol
// ----------------------------
const deleteRol = async (req, res) => {
  const { ide } = req.params;
  const { bitacoraId } = req.user;

  try {
    await pool.query(
      "DELETE FROM rol WHERE id = $1", 
      [ide]
    );

    await logEvent(bitacoraId, "DELETE", `api/rol/delete/:${ide}`, `Rol ${ide} eliminado`);

    return res.json({ message: "eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el rol:", error);
    return res.status(500).json({ message: "Error al eliminar el rol" });
  }
};

module.exports = {
  deleteRol,
  readRol,
  readRolById,
  createRol,
  updateRol,
};
