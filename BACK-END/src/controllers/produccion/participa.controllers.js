const pool = require("../../db.js");
const { logEvent } = require("../../utils/bitacoraUtils.js");

// ----------------------------
// Controlador para crear un registro de participación
// ----------------------------
const createParticipa = async (req, res) => {
  const { id_usuario, id_produccion, fecha } = req.body;

  try {
    const usuario = await pool.query("SELECT * FROM usuario WHERE id = $1", [id_usuario]);
    if (usuario.rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado." });
    }

    const produccion = await pool.query("SELECT * FROM produccion WHERE id = $1", [id_produccion]);
    if (produccion.rows.length === 0) {
      return res.status(400).json({ message: "Producción no encontrada." });
    }

    const result = await pool.query(
      `
      INSERT INTO participa (id_usuario, id_produccion, fecha)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [id_usuario, id_produccion, fecha]
    );

    await logEvent(
      req.user.bitacoraId,
      "POST",
      "api/participa/create",
      `Usuario ${id_usuario} registrado en producción ${id_produccion}`
    );

    res.status(201).json({ message: "Participación registrada exitosamente", participa: result.rows[0] });
  } catch (error) {
    console.error("Error al crear participación:", error);
    res.status(500).json({ message: "Error al registrar participación" });
  }
};

// ----------------------------
// Controlador para obtener todas las participaciones
// ----------------------------
const readParticipa = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        pa.id_usuario,
        u.nombre AS usuario,
        pa.id_produccion,
        pr.descripcion AS produccion,
        pa.fecha
      FROM participa pa
      JOIN usuario u ON pa.id_usuario = u.id
      JOIN produccion pr ON pa.id_produccion = pr.id
      ORDER BY pa.fecha DESC;
    `);

    await logEvent(
      req.user.bitacoraId,
      "GET",
      "api/participa/read",
      "Consulta de todas las participaciones"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener participaciones:", error);
    res.status(500).json({ message: "Error al obtener participaciones" });
  }
};

// ----------------------------
// Controlador para obtener participación por IDs (usuario + producción)
// ----------------------------
const readParticipaByIds = async (req, res) => {
  const { id_usuario, id_produccion } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        pa.id_usuario,
        u.nombre AS usuario,
        pa.id_produccion,
        pr.descripcion AS produccion,
        pa.fecha
      FROM participa pa
      JOIN usuario u ON pa.id_usuario = u.id
      JOIN produccion pr ON pa.id_produccion = pr.id
      WHERE pa.id_usuario = $1 AND pa.id_produccion = $2;
    `, [id_usuario, id_produccion]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Participación no encontrada." });

    await logEvent(
      req.user.bitacoraId,
      "GET",
      `api/participa/read/:${id_usuario}/${id_produccion}`,
      `Consulta de participación usuario ${id_usuario}, producción ${id_produccion}`
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener participación por IDs:", error);
    res.status(500).json({ message: "Error al obtener participación" });
  }
};

// ----------------------------
// Controlador para actualizar participación
// ----------------------------
const updateParticipa = async (req, res) => {
  const { id_usuario, id_produccion } = req.params;
  const { fecha } = req.body;

  try {
    const result = await pool.query(`
      UPDATE participa
      SET fecha = $1
      WHERE id_usuario = $2 AND id_produccion = $3
      RETURNING *;
    `, [fecha, id_usuario, id_produccion]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Participación no encontrada." });

    await logEvent(
      req.user.bitacoraId,
      "PUT",
      `api/participa/update/:${id_usuario}/${id_produccion}`,
      `Actualización de participación usuario ${id_usuario}, producción ${id_produccion}`
    );

    res.json({ message: "Participación actualizada correctamente", participa: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar participación:", error);
    res.status(500).json({ message: "Error al actualizar participación" });
  }
};

// ----------------------------
// Controlador para eliminar participación
// ----------------------------
const deleteParticipa = async (req, res) => {
  const { id_usuario, id_produccion } = req.params;

  try {
    const result = await pool.query(`
      DELETE FROM participa
      WHERE id_usuario = $1 AND id_produccion = $2
      RETURNING *;
    `, [id_usuario, id_produccion]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Participación no encontrada." });

    await logEvent(
      req.user.bitacoraId,
      "DELETE",
      `api/participa/delete/:${id_usuario}/${id_produccion}`,
      `Eliminación de participación usuario ${id_usuario}, producción ${id_produccion}`
    );

    res.json({ message: "Participación eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar participación:", error);
    res.status(500).json({ message: "Error al eliminar participación" });
  }
};

module.exports = {
  createParticipa,
  readParticipa,
  readParticipaByIds,
  updateParticipa,
  deleteParticipa
};
