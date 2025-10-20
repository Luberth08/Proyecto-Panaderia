const pool = require("../../db.js");
const { logEvent } = require("../../middleware/bitacora.middleware.js");

// ----------------------------
// Crear un nuevo proveedor
// ----------------------------
const createProveedor = async (req, res) => {
  const { codigo, nombre, sexo, telefono, estado, empresa } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM proveedor WHERE codigo = $1", [codigo]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "El código del proveedor ya existe." });
    }

    await pool.query(
      `INSERT INTO proveedor (codigo, nombre, sexo, telefono, estado, empresa)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [codigo, nombre, sexo, telefono, estado, empresa]
    );

    await logEvent(
      req.user.bitacoraId,
      "POST",
      "api/proveedor/create",
      `Proveedor '${nombre}' creado`
    );

    res.json({ message: "Proveedor creado exitosamente" });
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    res.status(500).json({ message: "Error al crear proveedor" });
  }
};

// ----------------------------
// Obtener todos los proveedores
// ----------------------------
const readProveedor = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM proveedor ORDER BY codigo ASC");

    await logEvent(req.user.bitacoraId, "GET", "api/proveedor/read", "Consulta de proveedores");

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    res.status(500).json({ message: "Error al obtener proveedores" });
  }
};

// ----------------------------
// Obtener proveedor por código
// ----------------------------
const readProveedorById = async (req, res) => {
  const { codigo } = req.params;

  try {
    const result = await pool.query("SELECT * FROM proveedor WHERE codigo = $1", [codigo]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Proveedor no encontrado" });

    await logEvent(
      req.user.bitacoraId,
      "GET",
      `api/proveedor/read/:${codigo}`,
      `Consulta del proveedor ${codigo}`
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener proveedor:", error);
    res.status(500).json({ message: "Error al obtener proveedor" });
  }
};

// ----------------------------
// Actualizar un proveedor
// ----------------------------
const updateProveedor = async (req, res) => {
  const { codigo } = req.params;
  const { nombre, sexo, telefono, estado, empresa } = req.body;

  try {
    await pool.query(
      `UPDATE proveedor 
       SET nombre = $1, sexo = $2, telefono = $3, estado = $4, empresa = $5
       WHERE codigo = $6`,
      [nombre, sexo, telefono, estado, empresa, codigo]
    );

    await logEvent(
      req.user.bitacoraId,
      "PUT",
      `api/proveedor/update/:${codigo}`,
      `Proveedor ${codigo} actualizado`
    );

    res.json({ message: "Proveedor actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    res.status(500).json({ message: "Error al actualizar proveedor" });
  }
};

// ----------------------------
// Eliminar un proveedor
// ----------------------------
const deleteProveedor = async (req, res) => {
  const { codigo } = req.params;

  try {
    await pool.query("DELETE FROM proveedor WHERE codigo = $1", [codigo]);

    await logEvent(
      req.user.bitacoraId,
      "DELETE",
      `api/proveedor/delete/:${codigo}`,
      `Proveedor ${codigo} eliminado`
    );

    res.json({ message: "Proveedor eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    res.status(500).json({ message: "Error al eliminar proveedor" });
  }
};

module.exports = {
  createProveedor,
  readProveedor,
  readProveedorById,
  updateProveedor,
  deleteProveedor,
};
