const pool = require("../../db.js");
const { logEvent } = require("../../middleware/bitacora.middleware.js");

// ----------------------------
// Controlador para crear un nuevo detalle de receta
// ----------------------------
const createDetalleReceta = async (req, res) => {
  const { id_receta, id_insumo, cantidad, medida } = req.body;

  try {
    const receta = await pool.query("SELECT id FROM receta WHERE id = $1", [id_receta]);
    const insumo = await pool.query("SELECT id FROM insumo WHERE id = $1", [id_insumo]);

    if (receta.rows.length === 0) return res.status(400).json({ message: "La receta asociada no existe." });
    if (insumo.rows.length === 0) return res.status(400).json({ message: "El insumo asociado no existe." });

    const existing = await pool.query(
      "SELECT * FROM detalle_receta WHERE id_receta = $1 AND id_insumo = $2",
      [id_receta, id_insumo]
    );
    if (existing.rows.length > 0)
      return res.status(400).json({ message: "Este insumo ya está asociado a la receta." });

    await pool.query(
      `INSERT INTO detalle_receta (id_receta, id_insumo, cantidad, medida)
       VALUES ($1, $2, $3, $4)`,
      [id_receta, id_insumo, cantidad, medida]
    );

    await logEvent(
      req.user.bitacoraId,
      "POST",
      "api/detalle_receta/create",
      `Detalle agregado a receta ${id_receta} con insumo ${id_insumo}`
    );

    res.status(201).json({ message: "Detalle de receta creado exitosamente" });
  } catch (error) {
    console.error("Error al crear detalle de receta:", error);
    res.status(500).json({ message: "Error al crear detalle de receta" });
  }
};

// ----------------------------
// Controlador para obtener todos los detalles de receta
// ----------------------------
const readDetalleReceta = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT dr.id_receta, r.id_producto, p.nombre AS producto,
             dr.id_insumo, i.nombre AS insumo,
             dr.cantidad, dr.medida
      FROM detalle_receta dr
      JOIN receta r ON dr.id_receta = r.id
      JOIN producto p ON r.id_producto = p.id
      JOIN insumo i ON dr.id_insumo = i.id
      ORDER BY dr.id_receta, dr.id_insumo
    `);

    await logEvent(req.user.bitacoraId, "GET", "api/detalle_receta/read", "Consulta de detalles de receta");

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener detalles de receta:", error);
    res.status(500).json({ message: "Error al obtener detalles de receta" });
  }
};

// ----------------------------
// Controlador para obtener detalles por ID de receta
// ----------------------------
const readDetalleRecetaByIds = async (req, res) => {
  const { id_receta, id_insumo } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        dr.id_receta, 
        dr.id_insumo, 
        i.nombre AS insumo, 
        dr.cantidad, 
        dr.medida
      FROM detalle_receta dr
      JOIN insumo i ON dr.id_insumo = i.id
      WHERE dr.id_receta = $1 AND dr.id_insumo = $2
    `, [id_receta, id_insumo]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Detalle de receta no encontrado." });

    await logEvent(
      req.user.bitacoraId,
      "GET",
      `api/detalle_receta/read/:${id_receta}/${id_insumo}`,
      `Consulta del detalle de receta ${id_receta}-${id_insumo}`
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener detalle de receta por IDs:", error);
    res.status(500).json({ message: "Error al obtener detalle de receta" });
  }
};


// ----------------------------
// Controlador para actualizar un detalle de receta
// ----------------------------
const updateDetalleReceta = async (req, res) => {
  const { id_receta, id_insumo } = req.params;
  const { cantidad, medida } = req.body;

  try {
    const result = await pool.query(
      `UPDATE detalle_receta
       SET cantidad = $1, medida = $2
       WHERE id_receta = $3 AND id_insumo = $4`,
      [cantidad, medida, id_receta, id_insumo]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Detalle no encontrado para actualizar." });

    await logEvent(
      req.user.bitacoraId,
      "PUT",
      `api/detalle_receta/update/:${id_receta}/${id_insumo}`,
      `Detalle de receta ${id_receta}-${id_insumo} actualizado`
    );

    res.json({ message: "Detalle de receta actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar detalle de receta:", error);
    res.status(500).json({ message: "Error al actualizar detalle de receta" });
  }
};

// ----------------------------
// Controlador para eliminar un detalle de receta
// ----------------------------
const deleteDetalleReceta = async (req, res) => {
  const { id_receta, id_insumo } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM detalle_receta WHERE id_receta = $1 AND id_insumo = $2",
      [id_receta, id_insumo]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Detalle no encontrado para eliminar." });

    await logEvent(
      req.user.bitacoraId,
      "DELETE",
      `api/detalle_receta/delete/:${id_receta}/${id_insumo}`,
      `Detalle de receta ${id_receta}-${id_insumo} eliminado`
    );

    res.json({ message: "Detalle de receta eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar detalle de receta:", error);
    res.status(500).json({ message: "Error al eliminar detalle de receta" });
  }
};

module.exports = {
  createDetalleReceta,
  readDetalleReceta,
  readDetalleRecetaByIds,
  updateDetalleReceta,
  deleteDetalleReceta,
};
