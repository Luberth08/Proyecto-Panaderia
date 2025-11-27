const pool = require("../../db.js");
const { logEvent } = require("../../utils/bitacoraUtils.js");

// --------------------------------------------------
// Crear cliente
// --------------------------------------------------
const createCliente = async (req, res) => {
  const { ci, nombre, sexo, telefono } = req.body;
  const { bitacoraId } = req.user;

  try {
    const existing = await pool.query(
      "SELECT 1 FROM cliente WHERE ci = $1",
      [ci]
    );

    if (existing.rowCount > 0) {
      return res.status(400).json({ message: "El cliente con este CI ya existe." });
    }

    const newCliente = await pool.query(
      `INSERT INTO cliente (ci, nombre, sexo, telefono)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [ci, nombre, sexo, telefono]
    );

    await logEvent(bitacoraId, "POST", "api/cliente", `Cliente '${nombre}' creado`);

    res.json(newCliente.rows[0]);
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ message: "Error al crear cliente" });
  }
};

// --------------------------------------------------
// Obtener todos los clientes
// --------------------------------------------------
const readCliente = async (req, res) => {
  const { bitacoraId } = req.user;

  try {
    const result = await pool.query(
      "SELECT * FROM cliente ORDER BY nombre ASC"
    );

    await logEvent(bitacoraId, "GET", "api/cliente", "Consulta de todos los clientes");

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

// --------------------------------------------------
// Obtener cliente por CI
// --------------------------------------------------
const readClienteByCi = async (req, res) => {
  const { ci } = req.params;
  const { bitacoraId } = req.user;

  try {
    const cliente = await pool.query(
      "SELECT * FROM cliente WHERE ci = $1",
      [ci]
    );

    if (cliente.rowCount === 0) {
      await logEvent(bitacoraId, "GET", `api/cliente/${ci}`, `Cliente ${ci} no encontrado`);
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    await logEvent(bitacoraId, "GET", `api/cliente/${ci}`, `Consulta del cliente ${ci}`);

    res.json(cliente.rows[0]);
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({ message: "Error al obtener cliente" });
  }
};

// --------------------------------------------------
// Actualizar cliente
// --------------------------------------------------
const updateCliente = async (req, res) => {
  const { ci } = req.params;
  const { nombre, sexo, telefono } = req.body;
  const { bitacoraId } = req.user;

  try {
    const updatedCliente = await pool.query(
      `UPDATE cliente
       SET nombre = $1, sexo = $2, telefono = $3
       WHERE ci = $4
       RETURNING *`,
      [nombre, sexo, telefono, ci]
    );

    if (updatedCliente.rowCount === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    await logEvent(bitacoraId, "PUT", `api/cliente/${ci}`, `Cliente '${ci}' actualizado`);

    res.json(updatedCliente.rows[0]);
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar cliente" });
  }
};

// --------------------------------------------------
// Eliminar cliente
// --------------------------------------------------
const deleteCliente = async (req, res) => {
  const { ci } = req.params;
  const { bitacoraId } = req.user;

  try {
    const deletedCliente = await pool.query(
      "DELETE FROM cliente WHERE ci = $1 RETURNING *",
      [ci]
    );

    if (deletedCliente.rowCount === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    await logEvent(bitacoraId, "DELETE", `api/cliente/${ci}`, `Cliente '${ci}' eliminado`);

    res.json({
      message: "Cliente eliminado exitosamente",
      deleted: deletedCliente.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ message: "Error al eliminar cliente" });
  }
};

module.exports = {
  createCliente,
  readCliente,
  readClienteByCi,
  updateCliente,
  deleteCliente,
};
