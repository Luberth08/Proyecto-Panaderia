const pool = require("../../db.js");
const { logEvent } = require("../../utils/bitacoraUtils.js");

// ----------------------------
// Controlador para crear una producción
// ----------------------------
const createProduccion = async (req, res) => {
  const { descripcion, fecha, hora_inicio, terminado, id_receta } = req.body;

  try {
    const receta = await pool.query("SELECT * FROM receta WHERE id = $1", [id_receta]);
    if (receta.rows.length === 0) {
      return res.status(400).json({ message: "La receta especificada no existe." });
    }

    const result = await pool.query(
      `
      INSERT INTO produccion (descripcion, fecha, hora_inicio, terminado, id_receta)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [descripcion, fecha, hora_inicio, terminado, id_receta]
    );

    await logEvent(
      req.user.bitacoraId,
      "POST",
      "api/produccion/create",
      `Creación de producción para receta ID ${id_receta}`
    );

    res.status(201).json({ message: "Producción creada exitosamente", produccion: result.rows[0] });
  } catch (error) {
    console.error("Error al crear producción:", error);
    res.status(500).json({ message: "Error al crear producción" });
  }
};

// ----------------------------
// Controlador para obtener todas las producciones
// ----------------------------
const readProduccion = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        pr.id,
        pr.descripcion,
        pr.fecha,
        pr.hora_inicio,
        pr.terminado,
        pr.id_receta,
        r.id AS receta_id,
        p.nombre AS producto
      FROM produccion pr
      JOIN receta r ON pr.id_receta = r.id
      JOIN producto p ON r.id_producto = p.id
      ORDER BY pr.fecha DESC, pr.hora_inicio DESC;
    `);

    await logEvent(
      req.user.bitacoraId,
      "GET",
      "api/produccion/read",
      "Consulta de todas las producciones"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener producciones:", error);
    res.status(500).json({ message: "Error al obtener producciones" });
  }
};

// ----------------------------
// Controlador para obtener producción por ID
// ----------------------------
const readProduccionById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        pr.id,
        pr.descripcion,
        pr.fecha,
        pr.hora_inicio,
        pr.terminado,
        pr.id_receta,
        p.nombre AS producto
      FROM produccion pr
      JOIN receta r ON pr.id_receta = r.id
      JOIN producto p ON r.id_producto = p.id
      WHERE pr.id = $1;
    `, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Producción no encontrada." });

    await logEvent(
      req.user.bitacoraId,
      "GET",
      `api/produccion/read/:${id}`,
      `Consulta de producción ID ${id}`
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener producción por ID:", error);
    res.status(500).json({ message: "Error al obtener producción" });
  }
};

// ----------------------------
// Controlador para actualizar una producción
// ----------------------------
const updateProduccion = async (req, res) => {
  const { id } = req.params;
  const { descripcion, fecha, hora_inicio, terminado, id_receta } = req.body;

  try {
    // Validar existencia de la receta
    const receta = await pool.query("SELECT * FROM receta WHERE id = $1", [id_receta]);
    if (receta.rows.length === 0) {
      return res.status(400).json({ message: "La receta especificada no existe." });
    }

    const result = await pool.query(
      `
      UPDATE produccion
      SET descripcion = $1, fecha = $2, hora_inicio = $3, terminado = $4, id_receta = $5
      WHERE id = $6
      RETURNING *;
      `,
      [descripcion, fecha, hora_inicio, terminado, id_receta, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Producción no encontrada." });

    await logEvent(
      req.user.bitacoraId,
      "PUT",
      `api/produccion/update/:${id}`,
      `Actualización de producción ${id}`
    );

    res.json({ message: "Producción actualizada exitosamente", produccion: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar producción:", error);
    res.status(500).json({ message: "Error al actualizar producción" });
  }
};

// ----------------------------
// Controlador para eliminar una producción
// ----------------------------
const deleteProduccion = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM produccion WHERE id = $1 RETURNING *;", [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Producción no encontrada." });

    await logEvent(
      req.user.bitacoraId,
      "DELETE",
      `api/produccion/delete/:${id}`,
      `Eliminación de producción ID ${id}`
    );

    res.json({ message: "Producción eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar producción:", error);
    res.status(500).json({ message: "Error al eliminar producción" });
  }
};

module.exports = {
  createProduccion,
  readProduccion,
  readProduccionById,
  updateProduccion,
  deleteProduccion
};
