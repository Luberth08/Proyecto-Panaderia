const pool = require("../../db.js");
const { logEvent } = require("../../utils/bitacoraUtils.js");

// Crea un detalle de pedido (producto en el pedido)
const createDetallePedido = async (req, res) => {
  const { id_producto, id_pedido, cantidad, precio } = req.body;
  const { bitacoraId } = req.user;

  try {
    const productoExisting = await pool.query("SELECT * FROM producto WHERE id = $1", [id_producto]);
    if (productoExisting.rows.length === 0) {
      return res.status(400).json({ message: "Producto no existe" });
    }

    const pedidoExisting = await pool.query("SELECT * FROM pedido WHERE id = $1", [id_pedido]);
    if (pedidoExisting.rows.length === 0) {
      return res.status(400).json({ message: "Pedido no existe" });
    }

    const total = cantidad * precio;

    const result = await pool.query(
      `INSERT INTO pedido_producto (id_producto, id_pedido, cantidad, precio, total)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id_producto, id_pedido, cantidad, precio, total]
    );

    await logEvent(bitacoraId, "POST", "api/detalle_pedido", `Producto ${id_producto} agregado al pedido ${id_pedido}`);
    res.json({ message: "Detalle de pedido creado exitosamente", detalle: result.rows[0] });
  } catch (error) {
    console.error("Error al crear detalle de pedido:", error);
    res.status(500).json({ message: "Error al crear detalle de pedido" });
  }
};

// Obtiene todos los detalles de pedidos
const readDetallePedido = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pp.*, p.nombre as producto_nombre, p.precio as precio_producto
       FROM pedido_producto pp
       LEFT JOIN producto p ON pp.id_producto = p.id
       ORDER BY pp.id_pedido DESC`
    );

    await logEvent(req.user.bitacoraId, "GET", "api/detalle_pedido", "Consulta de detalles de pedidos");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener detalles de pedidos:", error);
    res.status(500).json({ message: "Error al obtener detalles de pedidos" });
  }
};

// Obtiene los detalles de un pedido específico
const readDetallePedidoByPedidoId = async (req, res) => {
  const { id_pedido } = req.params;

  try {
    const result = await pool.query(
      `SELECT pp.*, p.nombre as producto_nombre
       FROM pedido_producto pp
       LEFT JOIN producto p ON pp.id_producto = p.id
       WHERE pp.id_pedido = $1`,
      [id_pedido]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No hay detalles para este pedido" });
    }

    await logEvent(req.user.bitacoraId, "GET", `api/detalle_pedido/${id_pedido}`, `Consulta de detalles del pedido ${id_pedido}`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener detalle del pedido:", error);
    res.status(500).json({ message: "Error al obtener detalle del pedido" });
  }
};

// Obtiene un detalle específico de un pedido
const readDetallePedidoByIds = async (req, res) => {
  const { id_producto, id_pedido } = req.params;

  try {
    const result = await pool.query(
      `SELECT pp.*, p.nombre as producto_nombre
       FROM pedido_producto pp
       LEFT JOIN producto p ON pp.id_producto = p.id
       WHERE pp.id_producto = $1 AND pp.id_pedido = $2`,
      [id_producto, id_pedido]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Detalle de pedido no encontrado" });
    }

    await logEvent(req.user.bitacoraId, "GET", `api/detalle_pedido/${id_producto}/${id_pedido}`, `Consulta de detalle específico`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener detalle:", error);
    res.status(500).json({ message: "Error al obtener detalle de pedido" });
  }
};

// Actualiza un detalle de pedido
const updateDetallePedido = async (req, res) => {
  const { id_producto, id_pedido } = req.params;
  const { cantidad, precio } = req.body;

  try {
    const existing = await pool.query(
      "SELECT * FROM pedido_producto WHERE id_producto = $1 AND id_pedido = $2",
      [id_producto, id_pedido]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Detalle de pedido no encontrado" });
    }

    const total = cantidad * precio;

    await pool.query(
      `UPDATE pedido_producto 
       SET cantidad = $1, precio = $2, total = $3
       WHERE id_producto = $4 AND id_pedido = $5`,
      [cantidad, precio, total, id_producto, id_pedido]
    );

    await logEvent(req.user.bitacoraId, "PUT", `api/detalle_pedido/${id_producto}/${id_pedido}`, `Detalle actualizado`);
    res.json({ message: "Detalle de pedido actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar detalle:", error);
    res.status(500).json({ message: "Error al actualizar detalle de pedido" });
  }
};

// Elimina un detalle de pedido
const deleteDetallePedido = async (req, res) => {
  const { id_producto, id_pedido } = req.params;

  try {
    const existing = await pool.query(
      "SELECT * FROM pedido_producto WHERE id_producto = $1 AND id_pedido = $2",
      [id_producto, id_pedido]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Detalle de pedido no encontrado" });
    }

    await pool.query(
      "DELETE FROM pedido_producto WHERE id_producto = $1 AND id_pedido = $2",
      [id_producto, id_pedido]
    );

    await logEvent(req.user.bitacoraId, "DELETE", `api/detalle_pedido/${id_producto}/${id_pedido}`, `Detalle eliminado`);
    res.json({ message: "Detalle de pedido eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar detalle:", error);
    res.status(500).json({ message: "Error al eliminar detalle de pedido" });
  }
};

module.exports = {
  createDetallePedido,
  readDetallePedido,
  readDetallePedidoByPedidoId,
  readDetallePedidoByIds,
  updateDetallePedido,
  deleteDetallePedido,
};
