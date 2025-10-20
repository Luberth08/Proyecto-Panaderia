const pool = require('../db');

// Middleware de autorización por permisos
const verificarPermiso = (permiso_requerido) => {
  return async (req, res, next) => {
    try {
      const { id_rol } = req.user; 
      // Consultar si el rol tiene asignado el permiso
      const result = await pool.query(
        `
        SELECT 1
        FROM rol_permiso rp, permiso p
        WHERE rp.id_permiso = p.id AND
        rp.id_rol = $1 AND p.nombre = $2
        `,
        [id_rol, permiso_requerido]
      );

      if (result.rowCount === 0) {
        return res.status(403).json({ 
          message: `Acceso denegado. No tienes el permiso: ${permiso_requerido}` 
        });
      }

      next();
    } catch (error) {
      console.error('Error al verificar permiso:', error);
      res.status(500).json({ message: `Error interno al verificar permisos` });
    }
  };
};

module.exports = verificarPermiso;