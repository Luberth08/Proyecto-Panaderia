const pool = require("../../db.js");

// ---------------------------
// Controlador para Leer todos los detalles de una bitácora específica
// ---------------------------
const readDetalleBitacoraByBitacora = async (req, res) => {
  const { id_bitacora } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        db.id,
        db.id_bitacora,
        db.metodo,
        db.ruta,
        db.mensaje,
        db.fecha,
        b.id_usuario,
        u.nombre AS usuario
      FROM detalle_bitacora db
      JOIN bitacora b ON db.id_bitacora = b.id
      JOIN usuario u ON b.id_usuario = u.id
      WHERE db.id_bitacora = $1
      ORDER BY db.fecha DESC;
    `, [id_bitacora]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "No se encontraron detalles para esta bitácora." });

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener los detalles por ID de bitácora:", error);
    res.status(500).json({ message: "Error al obtener los detalles de bitácora" });
  }
};

module.exports = {
  readDetalleBitacoraByBitacora
};
