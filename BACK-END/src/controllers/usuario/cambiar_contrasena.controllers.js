const pool = require("../../db.js");
const bcrypt = require("bcrypt");
const { logEvent } = require("../../middleware/bitacora.middleware.js");

// ----------------------------
// Controlador para cambiar la contraseña
// ----------------------------
const cambiarContrasena = async (req, res) => {
  const { contrasena_actual, nueva_contrasena } = req.body;
  const { id_user, bitacoraId } = req.user; // Del token JWT

  try {
    // Validar que se envíen ambos campos
    if (!contrasena_actual || !nueva_contrasena) {
      return res.status(400).json({
        success: false,
        message: "La contraseña actual y nueva contraseña son requeridas"
      });
    }

    // Validar longitud de nueva contraseña
    if (nueva_contrasena.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña debe tener al menos 6 caracteres"
      });
    }

    // Obtener usuario actual
    const userResult = await pool.query(
      "SELECT * FROM usuario WHERE id = $1",
      [id_user]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    const usuario = userResult.rows[0];

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(contrasena_actual, usuario.contrasena);
    if (!isMatch) {
      await logEvent(bitacoraId, "PUT", "/api/usuario/cambiar-contrasena", "Intento fallido: contraseña actual incorrecta");
      
      return res.status(400).json({
        success: false,
        message: "La contraseña actual es incorrecta"
      });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nueva_contrasena, salt);

    // Actualizar contraseña en la base de datos
    await pool.query(
      "UPDATE usuario SET contrasena = $1 WHERE id = $2",
      [hashedPassword, id_user]
    );

    // Registrar en bitácora
    await logEvent(bitacoraId, "PUT", "/api/usuario/cambiar-contrasena", "Contraseña cambiada exitosamente");

    res.status(200).json({
      success: true,
      message: "Contraseña cambiada exitosamente"
    });

  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    await logEvent(bitacoraId, "PUT", "/api/usuario/cambiar-contrasena", "Error al cambiar contraseña");
    
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al cambiar contraseña"
    });
  }
};

module.exports = {
  cambiarContrasena
};