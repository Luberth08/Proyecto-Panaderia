const pool = require("../../db.js");
const { logEvent } = require("../../utils/bitacoraUtils.js");

// Crea un nuevo pedido
const createPedido = async (req, res) => {
  const { fecha_pedido, pagado, fecha_entrega, tipo, total, ci_cliente } = req.body;
  const { bitacoraId } = req.user;

  try {
    const clienteExisting = await pool.query("SELECT * FROM cliente WHERE ci = $1", [ci_cliente]);
    if (clienteExisting.rows.length === 0) {
      return res.status(400).json({ message: "Cliente no existe" });
    }

    const result = await pool.query(
      `INSERT INTO pedido (fecha_pedido, pagado, fecha_entrega, tipo, total, ci_cliente, entregado)
       VALUES ($1, $2, $3, $4, $5, $6, false)
       RETURNING *`,
      [fecha_pedido, pagado, fecha_entrega, tipo, total, ci_cliente]
    );

    await logEvent(bitacoraId, "POST", "api/pedido", `Pedido ${result.rows[0].id} creado para cliente ${ci_cliente}`);
    res.json({ message: "Pedido creado exitosamente", pedido: result.rows[0] });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ message: "Error al crear pedido" });
  }
};

// Obtiene todos los pedidos con sus detalles
const readPedido = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.nombre as cliente_nombre 
       FROM pedido p
       LEFT JOIN cliente c ON p.ci_cliente = c.ci
       ORDER BY p.fecha_pedido DESC`
    );

    // Obtener detalles para cada pedido
    const pedidosConDetalles = await Promise.all(
      result.rows.map(async (pedido) => {
        const detalles = await pool.query(
          `SELECT pp.id_producto, pp.id_pedido, pp.cantidad, pp.precio, pp.total,
                  prod.nombre as producto_nombre
           FROM pedido_producto pp
           LEFT JOIN producto prod ON pp.id_producto = prod.id
           WHERE pp.id_pedido = $1`,
          [pedido.id]
        );
        return {
          ...pedido,
          detalles: detalles.rows
        };
      })
    );

    await logEvent(req.user.bitacoraId, "GET", "api/pedido", "Consulta de pedidos");
    res.json(pedidosConDetalles);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};

// Obtiene un pedido por ID con sus detalles
const readPedidoById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT p.*, c.nombre as cliente_nombre 
       FROM pedido p
       LEFT JOIN cliente c ON p.ci_cliente = c.ci
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Obtener detalles del pedido
    const detalles = await pool.query(
      `SELECT pp.id_producto, pp.id_pedido, pp.cantidad, pp.precio, pp.total,
              prod.nombre as producto_nombre
       FROM pedido_producto pp
       LEFT JOIN producto prod ON pp.id_producto = prod.id
       WHERE pp.id_pedido = $1`,
      [id]
    );

    const pedidoConDetalles = {
      ...result.rows[0],
      detalles: detalles.rows
    };

    await logEvent(req.user.bitacoraId, "GET", `api/pedido/${id}`, `Consulta del pedido ${id}`);
    res.json(pedidoConDetalles);
  } catch (error) {
    console.error("Error al obtener pedido:", error);
    res.status(500).json({ message: "Error al obtener pedido" });
  }
};

// Actualiza un pedido existente
const updatePedido = async (req, res) => {
  const { id } = req.params;
  const { fecha_pedido, pagado, fecha_entrega, tipo, total, ci_cliente } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM pedido WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    await pool.query(
      `UPDATE pedido 
       SET fecha_pedido = $1, pagado = $2, fecha_entrega = $3, tipo = $4, total = $5, ci_cliente = $6
       WHERE id = $7`,
      [fecha_pedido, pagado, fecha_entrega, tipo, total, ci_cliente, id]
    );

    await logEvent(req.user.bitacoraId, "PUT", `api/pedido/${id}`, `Pedido ${id} actualizado`);
    res.json({ message: "Pedido actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    res.status(500).json({ message: "Error al actualizar pedido" });
  }
};

// Confirma la entrega de un pedido
const confirmarEntregaPedido = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await pool.query("SELECT * FROM pedido WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    await pool.query(
      "UPDATE pedido SET entregado = true WHERE id = $1",
      [id]
    );

    // Obtener pedido actualizado con detalles
    const resultado = await pool.query(
      `SELECT p.*, c.nombre as cliente_nombre 
       FROM pedido p
       LEFT JOIN cliente c ON p.ci_cliente = c.ci
       WHERE p.id = $1`,
      [id]
    );

    const detalles = await pool.query(
      `SELECT pp.id_producto, pp.id_pedido, pp.cantidad, pp.precio, pp.total,
              prod.nombre as producto_nombre
       FROM pedido_producto pp
       LEFT JOIN producto prod ON pp.id_producto = prod.id
       WHERE pp.id_pedido = $1`,
      [id]
    );

    const pedidoConDetalles = {
      ...resultado.rows[0],
      detalles: detalles.rows
    };

    await logEvent(req.user.bitacoraId, "PUT", `api/pedido/${id}/confirmar-entrega`, `Entrega del pedido ${id} confirmada`);
    res.json({ message: "Entrega del pedido confirmada exitosamente", pedido: pedidoConDetalles });
  } catch (error) {
    console.error("Error al confirmar entrega:", error);
    res.status(500).json({ message: "Error al confirmar entrega" });
  }
};

// Obtiene el estado de un pedido con sus detalles
const obtenerEstadoPedido = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, fecha_pedido, fecha_entrega, pagado, entregado,
              CASE 
                WHEN entregado = true THEN 'Entregado'
                WHEN pagado = true THEN 'Confirmado'
                ELSE 'Pendiente'
              END as estado
       FROM pedido WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Obtener detalles del pedido
    const detalles = await pool.query(
      `SELECT pp.id_producto, pp.id_pedido, pp.cantidad, pp.precio, pp.total,
              prod.nombre as producto_nombre
       FROM pedido_producto pp
       LEFT JOIN producto prod ON pp.id_producto = prod.id
       WHERE pp.id_pedido = $1`,
      [id]
    );

    const estadoConDetalles = {
      ...result.rows[0],
      detalles: detalles.rows
    };

    await logEvent(req.user.bitacoraId, "GET", `api/pedido/${id}/estado`, `Consulta de estado del pedido ${id}`);
    res.json(estadoConDetalles);
  } catch (error) {
    console.error("Error al obtener estado:", error);
    res.status(500).json({ message: "Error al obtener estado del pedido" });
  }
};

// Elimina un pedido
const deletePedido = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await pool.query("SELECT * FROM pedido WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    await pool.query("DELETE FROM pedido WHERE id = $1", [id]);

    await logEvent(req.user.bitacoraId, "DELETE", `api/pedido/${id}`, `Pedido ${id} eliminado`);
    res.json({ message: "Pedido eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    res.status(500).json({ message: "Error al eliminar pedido" });
  }
};

module.exports = {
  createPedido,
  readPedido,
  readPedidoById,
  updatePedido,
  confirmarEntregaPedido,
  obtenerEstadoPedido,
  deletePedido,
};
