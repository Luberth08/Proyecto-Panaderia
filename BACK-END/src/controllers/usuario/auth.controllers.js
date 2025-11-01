const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../db.js");
const { iniciarBitacora, logEvent, cerrarBitacora } = require("../../utils/bitacoraUtils.js");

// ----------------------------
// Controlador de login
// ----------------------------
const login = async (req, res) => {
  const { nombre, contrasena } = req.body;

  try {
    // Verificar que el usuario existe
    const result = await pool.query(
      `
      SELECT * FROM usuario WHERE nombre = $1
      `, 
      [nombre]
    );
    
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    // Iniciar la bitacora
    const bitacoraId = await iniciarBitacora(user.id, req.ip);

    // Verificar la contraseña cifrada
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!isMatch) {
      await logEvent(bitacoraId, "POST", "/login", "contraseña incorrecta");

      return res
        .status(401)
        .json({ success: false, message: "Contraseña incorrecta" });
    }

    // Generar el token JWT
    const token = jwt.sign(
      {
        id_user: user.id,
        id_rol: user.id_rol,
        bitacoraId: bitacoraId
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Registrar el login exitoso en la bitácora
    await logEvent(bitacoraId, "POST", "/login", "Login exitoso");

    // Devolver el usuario autenticado y el token en la respuesta JSON
    res.status(200).json({
      message: "Login exitoso",
      token: token,
      user: user,
    });
  } 
  catch (error) {
    console.error("Error al iniciar sesión:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al iniciar sesión" });
  }
};

// ----------------------------
// Controlador de logout
// ----------------------------
const logout = async (req, res) => {
  try {
    const {bitacoraId} = req.user;

    if (!bitacoraId) {
      return res.status(400).json({
        success: false,
        message: "No se encontró bitácora activa en el token"
      });
    }

    // cerrar la bitacora correctamente
    await cerrarBitacora(bitacoraId, "Logout exitoso");

    res.status(200).json({
      success: true,
      message: "Logout exitoso" 
    });
  } catch (error) {
    console.error("Error en logout:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al cerrar sesión" });
  }
};

module.exports = {
  login,
  logout,
};
