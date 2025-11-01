const pool = require("../../db.js");
const { logEvent } = require("../../utils/bitacoraUtils.js");

// ----------------------------
// Controlador para crear una relación de compra-producto
// ----------------------------
const createCompraProducto = async (req, res) => {
  const { id_producto, id_nota_compra, cantidad, precio, total } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO compra_producto (id_producto, id_nota_compra, cantidad, precio, total)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [id_producto, id_nota_compra, cantidad, precio, total]
    );

    await logEvent(
      req.user.bitacoraId,
      "POST",
      "api/compra_producto/create",
      `Creación de compra_producto para nota ${id_nota_compra}, producto ${id_producto}`
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear compra_producto:", error);
    res.status(500).json({ message: "Error al crear compra_producto" });
  }
};

// ----------------------------
// Controlador para obtener todas las compras de productos
// ----------------------------
const readComprasProducto = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        cp.id_nota_compra,
        cp.id_producto,
        p.nombre AS producto,
        cp.cantidad,
        cp.precio,
        cp.total
      FROM compra_producto cp
      JOIN producto p ON cp.id_producto = p.id
      ORDER BY cp.id_nota_compra DESC, cp.id_producto;
    `);

    await logEvent(
      req.user.bitacoraId,
      "GET",
      "api/compra_producto/read",
      "Consulta de todas las compras de productos"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener compras de productos:", error);
    res.status(500).json({ message: "Error al obtener compras de productos" });
  }
};

// ----------------------------
// Controlador para obtener un registro específico por ID de nota y producto
// ----------------------------
const readCompraProductoByIds = async (req, res) => {
  const { id_nota_compra, id_producto } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        cp.id_nota_compra,
        cp.id_producto,
        p.nombre AS producto,
        cp.cantidad,
        cp.precio,
        cp.total
      FROM compra_producto cp
      JOIN producto p ON cp.id_producto = p.id
      WHERE cp.id_nota_compra = $1 AND cp.id_producto = $2;
    `, [id_nota_compra, id_producto]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Compra de producto no encontrada." });

    await logEvent(
      req.user.bitacoraId,
      "GET",
      `api/compra_producto/read/:${id_nota_compra}/${id_producto}`,
      `Consulta de compra_producto nota ${id_nota_compra}, producto ${id_producto}`
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener compra_producto por IDs:", error);
    res.status(500).json({ message: "Error al obtener compra_producto" });
  }
};

// ----------------------------
// Controlador para actualizar una compra de producto
// ----------------------------
const updateCompraProducto = async (req, res) => {
  const { id_nota_compra, id_producto } = req.params;
  const { cantidad, precio, total } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE compra_producto
      SET cantidad = $1, precio = $2, total = $3
      WHERE id_nota_compra = $4 AND id_producto = $5
      RETURNING *;
      `,
      [cantidad, precio, total, id_nota_compra, id_producto]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Compra de producto no encontrada." });

    await logEvent(
      req.user.bitacoraId,
      "PUT",
      `api/compra_producto/update/:${id_nota_compra}/${id_producto}`,
      `Actualización de compra_producto nota ${id_nota_compra}, producto ${id_producto}`
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar compra_producto:", error);
    res.status(500).json({ message: "Error al actualizar compra_producto" });
  }
};

// ----------------------------
// Controlador para eliminar una compra de producto
// ----------------------------
const deleteCompraProducto = async (req, res) => {
  const { id_nota_compra, id_producto } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM compra_producto
      WHERE id_nota_compra = $1 AND id_producto = $2
      RETURNING *;
      `,
      [id_nota_compra, id_producto]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Compra de producto no encontrada." });

    await logEvent(
      req.user.bitacoraId,
      "DELETE",
      `api/compra_producto/delete/:${id_nota_compra}/${id_producto}`,
      `Eliminación de compra_producto nota ${id_nota_compra}, producto ${id_producto}`
    );

    res.json({ message: "Compra de producto eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar compra_producto:", error);
    res.status(500).json({ message: "Error al eliminar compra_producto" });
  }
};

module.exports = {
  createCompraProducto,
  readComprasProducto,
  readCompraProductoByIds,
  updateCompraProducto,
  deleteCompraProducto,
};
