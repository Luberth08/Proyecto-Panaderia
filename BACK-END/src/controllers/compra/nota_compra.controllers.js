const pool = require("../../db.js");
const { logEvent } = require("../../middleware/bitacora.middleware.js");

// ----------------------------
// Controlador para crear una nueva nota de compra
// ----------------------------
const createNotaCompra = async (req, res) => {
  const { fecha_pedido, fecha_entrega, id_usuario, codigo_proveedor } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO nota_compra (fecha_pedido, fecha_entrega, id_usuario, codigo_proveedor)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [fecha_pedido, fecha_entrega, id_usuario, codigo_proveedor]
    );

    await logEvent(
      req.user.bitacoraId,
      "POST",
      "api/nota_compra/create",
      `Creación de nota de compra ID ${result.rows[0].id}`
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear nota de compra:", error);
    res.status(500).json({ message: "Error al crear nota de compra" });
  }
};

// ----------------------------
// Controlador para obtener todas las notas de compra
// ----------------------------
const readNotasCompra = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        nc.id, 
        nc.fecha_pedido, 
        nc.fecha_entrega, 
        u.nombre AS usuario, 
        p.nombre AS proveedor
      FROM nota_compra nc
      JOIN usuario u ON nc.id_usuario = u.id
      JOIN proveedor p ON nc.codigo_proveedor = p.codigo
      ORDER BY nc.id DESC;
    `);

    await logEvent(
      req.user.bitacoraId,
      "GET",
      "api/nota_compra/read",
      "Consulta de todas las notas de compra"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener notas de compra:", error);
    res.status(500).json({ message: "Error al obtener notas de compra" });
  }
};

// ----------------------------
// Controlador para obtener una nota de compra por ID
// ----------------------------
const readNotaCompraById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        nc.id, 
        nc.fecha_pedido, 
        nc.fecha_entrega, 
        nc.id_usuario, 
        u.nombre AS usuario, 
        nc.codigo_proveedor, 
        p.nombre AS proveedor
      FROM nota_compra nc
      JOIN usuario u ON nc.id_usuario = u.id
      JOIN proveedor p ON nc.codigo_proveedor = p.codigo
      WHERE nc.id = $1;
    `, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Nota de compra no encontrada." });

    await logEvent(
      req.user.bitacoraId,
      "GET",
      `api/nota_compra/read/:${id}`,
      `Consulta de nota de compra ${id}`
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener nota de compra por ID:", error);
    res.status(500).json({ message: "Error al obtener nota de compra" });
  }
};

// ----------------------------
// Controlador para actualizar una nota de compra
// ----------------------------
const updateNotaCompra = async (req, res) => {
  const { id } = req.params;
  const { fecha_pedido, fecha_entrega, id_usuario, codigo_proveedor } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE nota_compra
      SET fecha_pedido = $1, fecha_entrega = $2, id_usuario = $3, codigo_proveedor = $4
      WHERE id = $5
      RETURNING *;
      `,
      [fecha_pedido, fecha_entrega, id_usuario, codigo_proveedor, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Nota de compra no encontrada." });

    await logEvent(
      req.user.bitacoraId,
      "PUT",
      `api/nota_compra/update/:${id}`,
      `Actualización de nota de compra ${id}`
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar nota de compra:", error);
    res.status(500).json({ message: "Error al actualizar nota de compra" });
  }
};

// ----------------------------
// Controlador para eliminar una nota de compra
// ----------------------------
const deleteNotaCompra = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM nota_compra WHERE id = $1 RETURNING *;",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Nota de compra no encontrada." });

    await logEvent(
      req.user.bitacoraId,
      "DELETE",
      `api/nota_compra/delete/:${id}`,
      `Eliminación de nota de compra ${id}`
    );

    res.json({ message: "Nota de compra eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar nota de compra:", error);
    res.status(500).json({ message: "Error al eliminar nota de compra" });
  }
};

module.exports = {
  createNotaCompra,
  readNotasCompra,
  readNotaCompraById,
  updateNotaCompra,
  deleteNotaCompra
};
