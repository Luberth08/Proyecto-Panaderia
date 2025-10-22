const pool = require("../db.js");
const { logEvent } = require("../middleware/bitacora.middleware.js");

// ----------------------------
// Controlador para obtener todas las bitácoras
// ----------------------------
const readBitacoras = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        u.nombre AS usuario,
        b.ip,
        b.fecha_inicio,
        b.fecha_fin,
        b.hora_inicio,
        b.hora_fin
      FROM bitacora b
      JOIN usuario u ON b.id_usuario = u.id
      ORDER BY b.fecha_inicio DESC
    `);

    await logEvent(req.user.bitacoraId, "GET", "api/bitacora/read", "Consulta de bitácoras");

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener bitácoras:", error);
    res.status(500).json({ message: "Error al obtener bitácoras" });
  }
};

// ----------------------------
// Controlador para obtener detalles de una bitácora específica
// ----------------------------
const readDetalleByBitacora = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        d.id,
        d.metodo,
        d.ruta,
        d.mensaje,
        d.fecha
      FROM detalle_bitacora d
      WHERE d.id_bitacora = $1
      ORDER BY d.fecha DESC
    `, [id]);

    await logEvent(req.user.bitacoraId, "GET", `api/bitacora/detalle/${id}`, `Consulta de detalles de bitácora ${id}`);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener detalle de bitácora:", error);
    res.status(500).json({ message: "Error al obtener detalle de bitácora" });
  }
};

// ----------------------------
// Controlador para obtener todos los detalles (modo general tipo historial)
// ----------------------------
const readAllDetalles = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.id,
        b.id AS id_bitacora,
        u.nombre AS usuario,
        d.metodo,
        d.ruta,
        d.mensaje,
        d.fecha
      FROM detalle_bitacora d
      JOIN bitacora b ON d.id_bitacora = b.id
      JOIN usuario u ON b.id_usuario = u.id
      ORDER BY d.fecha DESC
    `);

    await logEvent(req.user.bitacoraId, "GET", "api/bitacora/detalles", "Consulta de todos los detalles de bitácora");

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener detalles:", error);
    res.status(500).json({ message: "Error al obtener detalles de bitácora" });
  }
};

module.exports = {
  readBitacoras,
  readDetalleByBitacora,
  readAllDetalles,
};
