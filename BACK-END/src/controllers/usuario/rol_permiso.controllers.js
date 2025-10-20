const pool = require("../../db");
const { logEvent } = require("../../middleware/bitacora.middleware.js");

// ----------------------------
// Controlador para crear una asociación rol-permiso
// ----------------------------
const createRolPermiso = async (req, res) => {
  const { id_rol, id_permiso } = req.body;
  const { bitacoraId } = req.user;

  try {
    const existing = await pool.query(
      "SELECT * FROM rol_permiso WHERE id_rol = $1 AND id_permiso = $2",
      [id_rol, id_permiso]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Esta asociación ya existe" });
    }

    await pool.query(
      "INSERT INTO rol_permiso (id_rol, id_permiso) VALUES ($1, $2)",
      [id_rol, id_permiso]
    );

    await logEvent(bitacoraId, "POST", "api/rol_permiso/create", `Asociación Rol ${id_rol} - Permiso ${id_permiso} creada`);

    res.status(201).json({ message: "Asociación creada exitosamente", id_rol, id_permiso });
  } catch (error) {
    console.error("Error al crear asociación rol-permiso:", error);
    res.status(500).json({ message: "Error al crear asociación rol-permiso" });
  }
};

// ----------------------------
// Controlador para obtener todas las asociaciones (con nombres de rol y permiso)
// ----------------------------
const readRolPermiso = async (req, res) => {
  const { bitacoraId } = req.user;

  try {
    const result = await pool.query(`
      SELECT rp.id_rol, r.nombre AS rol_nombre, rp.id_permiso, p.nombre AS permiso_nombre
      FROM rol_permiso rp, rol r, permiso p
      WHERE rp.id_rol = r.id AND rp.id_permiso = p.id
    `);

    await logEvent(bitacoraId, "GET", "api/rol_permiso/read", "Se consultaron todas las asociaciones rol-permiso");

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener asociaciones rol-permiso:", error);
    res.status(500).json({ message: "Error al obtener asociaciones rol-permiso" });
  }
};

// ----------------------------
// Controlador para obtener una asociación por Rol y Permiso
// ----------------------------
const readRolPermisoByIds = async (req, res) => {
  const { id_rol, id_permiso } = req.params;
  const { bitacoraId } = req.user;

  try {
    const result = await pool.query(
      `
      SELECT rp.id_rol, r.nombre AS rol_nombre, rp.id_permiso, p.nombre AS permiso_nombre
      FROM rol_permiso rp, rol r, permiso p
      WHERE rp.id_rol = r.id AND rp.id_permiso = p.id AND 
      rp.id_rol = $1 AND rp.id_permiso = $2
      `,[id_rol, id_permiso]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Asociación no encontrada" });
    }

    await logEvent(bitacoraId, "GET", `api/rol_permiso/read/:${id_rol}/:${id_permiso}`, `Se consultó la asociación Rol ${id_rol} - Permiso ${id_permiso}`);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener asociación rol-permiso:", error);
    res.status(500).json({ message: "Error al obtener asociación rol-permiso" });
  }
};

// ----------------------------
// Controlador para eliminar una asociación por Rol y Permiso
// ----------------------------
const deleteRolPermiso = async (req, res) => {
  const { id_rol, id_permiso } = req.params;
  const { bitacoraId } = req.user;

  try {
    const result = await pool.query(
      "DELETE FROM rol_permiso WHERE id_rol = $1 AND id_permiso = $2 RETURNING *",
      [id_rol, id_permiso]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Asociación no encontrada" });
    }

    await logEvent(bitacoraId, "DELETE", `api/rol_permiso/read/:${id_rol}/:${id_permiso}`, `Asociación Rol ${id_rol} - Permiso ${id_permiso} eliminada`);

    res.json({ message: "Asociación eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar asociación rol-permiso:", error);
    res.status(500).json({ message: "Error al eliminar asociación rol-permiso" });
  }
};

module.exports = {
  createRolPermiso,
  readRolPermiso,
  readRolPermisoByIds,
  deleteRolPermiso
};
