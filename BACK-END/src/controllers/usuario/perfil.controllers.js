const pool = require("../../db.js");
const { logEvent } = require("../../utils/bitacoraUtils.js");

// ----------------------------
// Controlador para obtener los datos del usuario logueado
// ----------------------------
const getPerfil = async (req, res) => {
  const { id_user, bitacoraId } = req.user;

  try {
    const result = await pool.query(
      "SELECT id, nombre, email, sexo, telefono, id_rol FROM usuario WHERE id = $1",
      [id_user]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    await logEvent(bitacoraId, "GET", "/api/perfil/read", "Consulta de perfil de usuario");

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener perfil"
    });
  }
};

// ----------------------------
// Controlador para actualizar los datos del usuario logueado
// ----------------------------
const updatePerfil = async (req, res) => {
  const { id_user, bitacoraId } = req.user;
  const { nombre, email, sexo, telefono } = req.body;

  try {
    // Validaciones básicas
    if (!nombre || !email) {
      return res.status(400).json({
        success: false,
        message: "Nombre y email son requeridos"
      });
    }

    // Verificar que el email no esté en uso por otro usuario
    const emailCheck = await pool.query(
      "SELECT id FROM usuario WHERE email = $1 AND id != $2",
      [email, id_user]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "El email ya está en uso por otro usuario"
      });
    }

    // Actualizar perfil
    const result = await pool.query(
      `UPDATE usuario 
       SET nombre = $1, email = $2, sexo = $3, telefono = $4 
       WHERE id = $5 
       RETURNING id, nombre, email, sexo, telefono, id_rol`,
      [nombre, email, sexo, telefono, id_user]
    );

    await logEvent(bitacoraId, "PUT", "/api/usuario/perfil", "Perfil de usuario actualizado");

    res.json({
      success: true,
      message: "Perfil actualizado exitosamente",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al actualizar perfil"
    });
  }
};

module.exports = {
  getPerfil,
  updatePerfil
};