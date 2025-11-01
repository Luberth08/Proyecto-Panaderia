const pool = require("../../db.js");
const { logEvent } = require("../../middleware/bitacora.middleware.js");

// ----------------------------
// Controlador para crear una nueva compra de insumo
// ----------------------------
const createCompraInsumo = async (req, res) => {
  const { id_insumo, id_nota_compra, cantidad, precio, total } = req.body;

  try {
    const insumo = await pool.query("SELECT id FROM insumo WHERE id = $1", [id_insumo]);
    const nota = await pool.query("SELECT id FROM nota_compra WHERE id = $1", [id_nota_compra]);

    if (insumo.rows.length === 0)
      return res.status(400).json({ message: "El insumo asociado no existe." });
    if (nota.rows.length === 0)
      return res.status(400).json({ message: "La nota de compra asociada no existe." });

    const existing = await pool.query(
      "SELECT * FROM compra_insumo WHERE id_insumo = $1 AND id_nota_compra = $2",
      [id_insumo, id_nota_compra]
    );
    if (existing.rows.length > 0)
      return res.status(400).json({ message: "Este insumo ya está registrado en esta nota de compra." });

    await pool.query(
      `INSERT INTO compra_insumo (id_insumo, id_nota_compra, cantidad, precio, total)
       VALUES ($1, $2, $3, $4, $5)`,
      [id_insumo, id_nota_compra, cantidad, precio, total]
    );

    await logEvent(
      req.user.bitacoraId,
      "POST",
      "api/compra_insumo/create",
      `Compra de insumo ${id_insumo} registrada en nota ${id_nota_compra}`
    );

    res.status(201).json({ message: "Compra de insumo registrada exitosamente" });
  } catch (error) {
    console.error("Error al crear compra de insumo:", error);
    res.status(500).json({ message: "Error al crear compra de insumo" });
  }
};

// ----------------------------
// Controlador para obtener todas las compras de insumos
// ----------------------------
const readCompraInsumo = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        ci.id_nota_compra,
        nc.fecha_pedido,
        nc.fecha_entrega,
        ci.id_insumo,
        i.nombre AS insumo,
        ci.cantidad,
        ci.precio,
        ci.total
      FROM compra_insumo ci
      JOIN insumo i ON ci.id_insumo = i.id
      JOIN nota_compra nc ON ci.id_nota_compra = nc.id
      ORDER BY ci.id_nota_compra, ci.id_insumo;
    `);

    await logEvent(
      req.user.bitacoraId,
      "GET",
      "api/compra_insumo/read",
      "Consulta de compras de insumos"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener compras de insumos:", error);
    res.status(500).json({ message: "Error al obtener compras de insumos" });
  }
};


// ----------------------------
// Controlador para obtener una compra específica por IDs
// ----------------------------
const readCompraInsumoByIds = async (req, res) => {
  const { id_nota_compra, id_insumo } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        ci.id_nota_compra,
        ci.id_insumo,
        i.nombre AS insumo,
        ci.cantidad,
        ci.precio,
        ci.total
      FROM compra_insumo ci
      JOIN insumo i ON ci.id_insumo = i.id
      WHERE ci.id_nota_compra = $1 AND ci.id_insumo = $2
    `, [id_nota_compra, id_insumo]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Compra de insumo no encontrada." });

    await logEvent(
      req.user.bitacoraId,
      "GET",
      `api/compra_insumo/read/:${id_nota_compra}/${id_insumo}`,
      `Consulta de compra ${id_nota_compra}-${id_insumo}`
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener compra por IDs:", error);
    res.status(500).json({ message: "Error al obtener compra de insumo" });
  }
};

// ----------------------------
// Controlador para actualizar una compra de insumo
// ----------------------------
const updateCompraInsumo = async (req, res) => {
  const { id_nota_compra, id_insumo } = req.params;
  const { cantidad, precio, total } = req.body;

  try {
    const result = await pool.query(
      `UPDATE compra_insumo
       SET cantidad = $1, precio = $2, total = $3
       WHERE id_nota_compra = $4 AND id_insumo = $5`,
      [cantidad, precio, total, id_nota_compra, id_insumo]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Compra de insumo no encontrada para actualizar." });

    await logEvent(
      req.user.bitacoraId,
      "PUT",
      `api/compra_insumo/update/:${id_nota_compra}/${id_insumo}`,
      `Compra ${id_nota_compra}-${id_insumo} actualizada`
    );

    res.json({ message: "Compra de insumo actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar compra de insumo:", error);
    res.status(500).json({ message: "Error al actualizar compra de insumo" });
  }
};

// ------------------------------
// Controlador para eliminar una compra de insumo
// ------------------------------
const deleteCompraInsumo = async (req, res) => {
  const { id_nota_compra, id_insumo } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM compra_insumo WHERE id_nota_compra = $1 AND id_insumo = $2",
      [id_nota_compra, id_insumo]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Compra de insumo no encontrada para eliminar." });

    await logEvent(
      req.user.bitacoraId,
      "DELETE",
      `api/compra_insumo/delete/:${id_nota_compra}/${id_insumo}`,
      `Compra ${id_nota_compra}-${id_insumo} eliminada`
    );

    res.json({ message: "Compra de insumo eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar compra de insumo:", error);
    res.status(500).json({ message: "Error al eliminar compra de insumo" });
  }
};

module.exports = {
  createCompraInsumo,
  readCompraInsumo,
  readCompraInsumoByIds,
  updateCompraInsumo,
  deleteCompraInsumo,
};
