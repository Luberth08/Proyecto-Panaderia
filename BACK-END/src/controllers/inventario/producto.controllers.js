const pool = require("../../db.js");
const { logEvent } = require("../../middleware/bitacora.middleware.js");

// ----------------------------
// Crear un nuevo producto
// ----------------------------
const createProducto = async (req, res) => {
  const { nombre, precio, stock, stock_minimo, id_categoria } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM producto WHERE nombre = $1", [nombre]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "El nombre del producto ya existe." });
    }

    await pool.query(
      `INSERT INTO producto (nombre, precio, stock, stock_minimo, id_categoria)
       VALUES ($1, $2, $3, $4, $5)`,
      [nombre, precio, stock, stock_minimo, id_categoria]
    );

    await logEvent(
      req.user.bitacoraId,
      "POST",
      "api/producto/create",
      `Producto '${nombre}' creado`
    );

    res.json({ message: "Producto creado exitosamente" });
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ message: "Error al crear el producto" });
  }
};

// ----------------------------
// Obtener todos los productos (con nombre de categoría)
// ----------------------------
const readProducto = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.nombre, p.precio, p.stock, p.stock_minimo, 
             c.nombre AS categoria
      FROM producto p
      INNER JOIN categoria c ON p.id_categoria = c.id
      ORDER BY p.id ASC
    `);

    await logEvent(req.user.bitacoraId, "GET", "api/producto/read", "Consulta de productos");

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// ----------------------------
// Obtener producto por ID
// ----------------------------
const readProductoById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT p.id, p.nombre, p.precio, p.stock, p.stock_minimo, 
              c.nombre AS categoria
       FROM producto p
       INNER JOIN categoria c ON p.id_categoria = c.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Producto no encontrado" });

    await logEvent(
      req.user.bitacoraId,
      "GET",
      `api/producto/read/:${id}`,
      `Consulta del producto ${id}`
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
};

// ----------------------------
// Actualizar producto
// ----------------------------
const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock, stock_minimo, id_categoria } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM producto WHERE nombre = $1 AND id <> $2", [nombre, id]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "El nombre del producto ya existe." });
    }

    await pool.query(
      `UPDATE producto 
       SET nombre = $1, precio = $2, stock = $3, stock_minimo = $4, id_categoria = $5
       WHERE id = $6`,
      [nombre, precio, stock, stock_minimo, id_categoria, id]
    );

    await logEvent(
      req.user.bitacoraId,
      "PUT",
      `api/producto/update/:${id}`,
      `Producto ${id} actualizado`
    );

    res.json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};

// ----------------------------
// Eliminar producto
// ----------------------------
const deleteProducto = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM producto WHERE id = $1", [id]);

    await logEvent(
      req.user.bitacoraId,
      "DELETE",
      `api/producto/delete/:${id}`,
      `Producto ${id} eliminado`
    );

    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};

module.exports = {
  createProducto,
  readProducto,
  readProductoById,
  updateProducto,
  deleteProducto,
};