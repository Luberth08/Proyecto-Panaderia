const pool = require("../../db.js");
const { logEvent } = require("../../utils/bitacoraUtils.js");

// Crea un nuevo cliente en la base de datos
const createCliente = async (req, res) => {
  const { ci, nombre, sexo, telefono } = req.body;
  const { bitacoraId } = req.user;

  try {
    const existing = await pool.query("SELECT * FROM cliente WHERE ci = $1", [ci]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "El cliente con este CI ya existe." });
    }

    await pool.query(
      "INSERT INTO cliente (ci, nombre, sexo, telefono) VALUES ($1, $2, $3, $4)",
      [ci, nombre, sexo, telefono]
    );

    await logEvent(bitacoraId, "POST", "api/cliente", `Cliente '${nombre}' creado`);
    res.json({ message: "Cliente creado exitosamente" });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ message: "Error al crear cliente" });
  }
};

// Obtiene todos los clientes
const readCliente = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cliente ORDER BY nombre ASC"
    );

    await logEvent(req.user.bitacoraId, "GET", "api/cliente", "Consulta de clientes");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

// Obtiene un cliente por su CI
const readClienteByCi = async (req, res) => {
  const { ci } = req.params;

  try {
    const result = await pool.query("SELECT * FROM cliente WHERE ci = $1", [ci]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    await logEvent(req.user.bitacoraId, "GET", `api/cliente/${ci}`, `Consulta del cliente ${ci}`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({ message: "Error al obtener cliente" });
  }
};

// Actualiza un cliente existente
const updateCliente = async (req, res) => {
  const { ci } = req.params;
  const { nombre, sexo, telefono } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM cliente WHERE ci = $1", [ci]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    await pool.query(
      "UPDATE cliente SET nombre = $1, sexo = $2, telefono = $3 WHERE ci = $4",
      [nombre, sexo, telefono, ci]
    );

    await logEvent(req.user.bitacoraId, "PUT", `api/cliente/${ci}`, `Cliente '${nombre}' actualizado`);
    res.json({ message: "Cliente actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar cliente" });
  }
};

// Elimina un cliente
const deleteCliente = async (req, res) => {
  const { ci } = req.params;

  try {
    const existing = await pool.query("SELECT * FROM cliente WHERE ci = $1", [ci]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    await pool.query("DELETE FROM cliente WHERE ci = $1", [ci]);

    await logEvent(req.user.bitacoraId, "DELETE", `api/cliente/${ci}`, `Cliente '${ci}' eliminado`);
    res.json({ message: "Cliente eliminado exitosamente" });
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
