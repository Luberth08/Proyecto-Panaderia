const pool = require('../db');

// ----------------------------
// Función para iniciar una bitácora
// ----------------------------
const iniciarBitacora = async (id_usuario, ip) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO bitacora (id_usuario, ip)
      VALUES ($1, $2)
      RETURNING id
      `,
      [id_usuario, ip]
    );
    return result.rows[0].id;
  } catch (error) {
    console.error('Error al iniciar bitácora:', error);
    throw error;
  }
};

// ----------------------------
// Función para registrar un evento en detalle_bitacora
// ----------------------------
const logEvent = async (id_bitacora, metodo, ruta, mensaje) => {
  try {
    await pool.query(
      `
      INSERT INTO detalle_bitacora (id_bitacora, metodo, ruta, mensaje)
      VALUES ($1, $2, $3, $4)
      `,
      [id_bitacora, metodo, ruta, mensaje]
    );
  } catch (error) {
    console.error('Error al registrar en detalle_bitacora:', error);
  }
};

// ----------------------------
// Función para cerrar una bitácora
// ----------------------------
const cerrarBitacora = async (id_bitacora, mensaje = 'Logout') => {
  try {
    await pool.query(
      `
      UPDATE bitacora
      SET fecha_fin = CURRENT_TIMESTAMP, hora_fin = CURRENT_TIME
      WHERE id = $1
      `,
      [id_bitacora]
    );

    // Registrar el detalle de cierre
    await logEvent(id_bitacora, 'POST', '/auth/logout', mensaje);
  } catch (error) {
    console.error('Error al cerrar bitácora:', error);
  }
};

module.exports = {
  iniciarBitacora,
  logEvent,
  cerrarBitacora,
};