// src/controllers/bitacora.controller.js
const pool = require("../../db.js");

// ----------------------------
// Controladaor para obtener todas las bitácoras
// ----------------------------
const readBitacora = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.id_usuario,
        u.nombre AS usuario,
        b.ip,
        b.fecha_inicio,
        b.fecha_fin,
        b.hora_inicio,
        b.hora_fin
      FROM bitacora b
      JOIN usuario u ON b.id_usuario = u.id
      ORDER BY b.fecha_inicio DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener las bitácoras:", error);
    res.status(500).json({ message: "Error al obtener las bitácoras" });
  }
};

// ----------------------------
// Controlador para obtener una bitácora por ID
// ----------------------------
const readBitacoraById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.id_usuario,
        u.nombre AS usuario,
        b.ip,
        b.fecha_inicio,
        b.fecha_fin,
        b.hora_inicio,
        b.hora_fin
      FROM bitacora b
      JOIN usuario u ON b.id_usuario = u.id
      WHERE b.id = $1;
    `, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Bitácora no encontrada." });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener la bitácora:", error);
    res.status(500).json({ message: "Error al obtener la bitácora" });
  }
};

module.exports = {
  readBitacora,
  readBitacoraById
};
