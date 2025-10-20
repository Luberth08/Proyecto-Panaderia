const pool = require("../../db.js");
const { logEvent } = require("../../middleware/bitacora.middleware.js");

// ----------------------------
// Crear un nuevo insumo
// ----------------------------
const createInsumo = async (req, res) => {
  const { nombre, medida, stock, stock_minimo } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM insumo WHERE nombre = $1", [nombre]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "El nombre del insumo ya existe." });
    }

    // Insertar nuevo insumo
    await pool.query(
      `INSERT INTO insumo (nombre, medida, stock, stock_minimo)
       VALUES ($1, $2, $3, $4)`,
      [nombre, medida, stock, stock_minimo]
    );

    await logEvent(
      req.user.bitacoraId,
      "POST",
      "api/insumo/create",
      `Insumo '${nombre}' creado`
    );

    res.json({ message: "Insumo creado exitosamente" });
  } catch (error) {
    console.error("Error al crear el insumo:", error);
    res.status(500).json({ message: "Error al crear el insumo" });
  }
};

// ----------------------------
// Obtener todos los insumos
// ----------------------------
const readInsumo = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM insumo ORDER BY id ASC"
    );

    await logEvent(req.user.bitacoraId, "GET", "api/insumo/read", "Consulta de insumos");

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener insumos:", error);
    res.status(500).json({ message: "Error al obtener insumos" });
  }
};

// ----------------------------
// Obtener insumo por ID
// ----------------------------
const readInsumoById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM insumo WHERE id = $1", [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Insumo no encontrado" });

    await logEvent(
      req.user.bitacoraId,
      "GET",
      `api/insumo/read/:${id}`,
      `Consulta del insumo ${id}`
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener insumo:", error);
    res.status(500).json({ message: "Error al obtener insumo" });
  }
};

// ----------------------------
// Actualizar un insumo
// ----------------------------
const updateInsumo = async (req, res) => {
  const { id } = req.params;
  const { nombre, medida, stock, stock_minimo } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM insumo WHERE nombre = $1 AND id != $2", [nombre, id]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "El nombre del insumo ya existe." });
    }
    await pool.query(
      `UPDATE insumo 
       SET nombre = $1, medida = $2, stock = $3, stock_minimo = $4
       WHERE id = $5`,
      [nombre, medida, stock, stock_minimo, id]
    );

    await logEvent(
      req.user.bitacoraId,
      "PUT",
      `api/insumo/update/:${id}`,
      `Insumo ${id} actualizado`
    );

    res.json({ message: "Insumo actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar insumo:", error);
    res.status(500).json({ message: "Error al actualizar insumo" });
  }
};

// ----------------------------
// Eliminar un insumo
// ----------------------------
const deleteInsumo = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM insumo WHERE id = $1", [id]);

    await logEvent(
      req.user.bitacoraId,
      "DELETE",
      `api/insumo/delete/:${id}`,
      `Insumo ${id} eliminado`
    );

    res.json({ message: "Insumo eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar insumo:", error);
    res.status(500).json({ message: "Error al eliminar insumo" });
  }
};

module.exports = {
  createInsumo,
  readInsumo,
  readInsumoById,
  updateInsumo,
  deleteInsumo,
};
