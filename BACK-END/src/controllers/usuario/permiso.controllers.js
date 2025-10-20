const pool = require("../../db.js");
const { logEvent } = require("../../middleware/bitacora.middleware.js");

// ----------------------------
// Controlador para crear un nuevo permiso
// ----------------------------
const createPermiso = async (req, res) => {
  const { nombre } = req.body;
  const { bitacoraId } = req.user;

  try {
    const existingPermiso = await pool.query(
      "SELECT * FROM permiso WHERE nombre = $1",
      [nombre]
    );
    if (existingPermiso.rows.length > 0) {
      return res.status(400).json({ message: "El permiso ya existe" });
    }
    
    const newPermiso = await pool.query(
      "INSERT INTO permiso (nombre) VALUES ($1) RETURNING *",
      [nombre]
    );

    await logEvent(bitacoraId, "POST", "api/permiso/create", `Permiso ${nombre} creado`);

    res.json(newPermiso.rows[0]);
  } catch (error) {
    console.error("Error al crear permiso:", error);
    res.status(500).json({ message: "Error al crear permiso" });
  }
};

// ----------------------------
// Controlador para obtener todos los permisos
// ----------------------------
const readPermiso = async (req, res) => {
  const { bitacoraId } = req.user;

  try {
    const permisos = await pool.query("SELECT * FROM permiso"); 

    await logEvent(bitacoraId, "GET", "api/permiso/read", "Se consultaron todos los permisos");

    return res.json(permisos.rows);
  } catch (error) {
    console.error("Error al obtener permisos:", error);
    return res.status(500).json({ message: "Error al obtener permisos" });
  }
};

// ----------------------------
// Controlador para obtener un permiso por ID
// ----------------------------
const readPermisoById = async (req, res) => {
  const { id } = req.params;
  const { bitacoraId } = req.user;

  try {
    const permiso = await pool.query(
        "SELECT * FROM permiso WHERE id = $1", 
        [id]
    );

    if (permiso.rows.length === 0) {
      return res.status(404).json({ message: "Permiso no encontrado" });
    }

    await logEvent(bitacoraId, "GET", `api/permiso/read/:${id}`, `Se consulto el permiso ${id}`);

    res.json(permiso.rows[0]);
  } catch (error) {
  console.error("Error al obtener permiso:", error);
  res.status(500).json({ message: "Error al obtener permiso" });
  }
};

// ----------------------------
// Controlador para actualizar un permiso 
// ----------------------------
const updatePermiso = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  const { bitacoraId } = req.user;

  try {
    const updatedPermiso = await pool.query(
      "UPDATE permiso SET nombre = $1 WHERE id = $2 RETURNING *",
      [nombre, id]
    );

    await logEvent(bitacoraId, "PUT", `api/permiso/update/:${id}`, `Permiso ${id} actualizado`);

    res.json(updatedPermiso.rows[0]);
  } catch (error) {
    console.error("Error al actualizar permiso:", error);
    res.status(500).json({ message: "Error al actualizar permiso" });
  }
};

// ----------------------------
// Controlador para eliminar un permiso 
// ----------------------------
const deletePermiso = async (req, res) => {
  const { id } = req.params;
  const { bitacoraId } = req.user;

  try {
    const deletedPermiso = await pool.query(
      "DELETE FROM permiso WHERE id = $1 RETURNING *",
      [id]
    );

    await logEvent(bitacoraId, "DELETE", `api/permiso/delete/:${id}`, `Permiso ${id} eliminado`);

    res.json(deletedPermiso.rows[0]);
  } catch (error) {
    console.error("Error al eliminar permiso:", error);
    res.status(500).json({ message: "Error al eliminar permiso" });
  }
};

module.exports = {
  createPermiso,
  readPermiso,
  readPermisoById,
  updatePermiso,
  deletePermiso,
};