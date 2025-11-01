const pool = require("../../db.js");
const bcrypt = require("bcrypt");
const { logEvent } = require("../../utils/bitacoraUtils.js");

// ----------------------------
// Controlador para agregar un usuario
// ----------------------------
const createUser = async (req, res) => {
  const { nombre, email, contrasena, sexo, telefono, id_rol } = req.body;
  const { bitacoraId } = req.user;

  try {
    // Validar formato del nombre de usuario
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(nombre)){
      return res.status(400).json({
        message:
          "El nombre de usuario no es válido. Solo se permiten letras, números y guiones bajos, sin espacios (3 a 20 caracteres).",
      });
    }

    // Validar formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
      return res.status(400).json({
        message: "El formato del correo electrónico no es válido.",
      });
    }

    // Validar que no exista el nombre o el correo
    const existingUser = await pool.query(
      "SELECT * FROM usuario WHERE nombre = $1 OR email = $2",
      [nombre, email]
    );

    if (existingUser.rows.length > 0) {
      const conflict =
        existingUser.rows[0].nombre === nombre
          ? "El nombre de usuario ya existe."
          : "El correo electrónico ya está registrado.";

      return res.status(400).json({ message: conflict, success: false });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    // Insertar el nuevo usuario en la base de datos
    const result = await pool.query(
      "INSERT INTO usuario (nombre, email, contrasena, sexo, telefono, id_rol) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [nombre, email, hashedPassword, sexo, telefono, id_rol]
    );
    // Registrar en bitácora
    await logEvent(bitacoraId, "POST", "api/usuario/create", `Usuario ${nombre} creado`);

    // Devolver el usuario creado en la respuesta JSON
    res
      .status(201)
      .json({ message: "Usuario agregado exitosamente", user: result.rows[0] });
  } catch (error) {
    console.error("Error al agregar el usuario:", error);
    res.status(500).json({ message: "Error al agregar el usuario" });
  }
};

// ----------------------------
// Controlador para obtener todos los usuarios (solo para administradores)
// ----------------------------
const readUser = async (req, res) => {
  const { bitacoraId } = req.user;

  try {
    const result = await pool.query("SELECT * FROM usuario");

    await logEvent(bitacoraId, "GET", "api/usuario/read", "Se consultaron todos los usuarios");

    res.json(result.rows);
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
    res.status(500).json({ message: "Error al cargar los usuarios" });
  }
};

// ----------------------------
// Controlador para obtener un usuario por codigo
// ----------------------------
const readUserByNombre = async (req, res) => {
  const { nombre } = req.params;
  const { bitacoraId } = req.user;

  try {
    const result = await pool.query("SELECT * FROM usuario WHERE nombre = $1", [nombre]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await logEvent(bitacoraId, "GET", `api/usuario/read/:${nombre}`, `Se consultó el usuario ${nombre}`);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  } 
};

// ----------------------------
// Controlador para modificar un usuario
// ----------------------------
const updateUser = async (req, res) => {
  const { nombre } = req.params;
  const { new_nombre, email, contrasena, sexo, telefono, id_rol } = req.body;
  const { bitacoraId } = req.user;

  try {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(new_nombre)){
      return res.status(400).json({
        message:
          "El nombre de usuario no es válido. Solo se permiten letras, números y guiones bajos, sin espacios (3 a 20 caracteres).",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
      return res.status(400).json({
        message: "El formato del correo electrónico no es válido.",
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM usuario WHERE nombre = $1 OR email = $2",
      [new_nombre, email]
    );

    if (existingUser.rows.length > 0) {
      const conflict =
        existingUser.rows[0].nombre === new_nombre
          ? "El nombre de usuario ya existe."
          : "El correo electrónico ya está registrado.";

      return res.status(400).json({ message: conflict, success: false });
    }

    // Encriptar la contraseña si se proporciona una nueva
    let hashedPassword;
    if (contrasena) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(contrasena, salt);
    }
    // Actualizar el usuario en la base de datos
    const result = await pool.query(
      `
      UPDATE usuario
      SET nombre = $1,
          email = $2,
          contrasena = COALESCE($3, contrasena),
          sexo = $4,
          telefono = $5,
          id_rol = $6
      WHERE nombre = $7
      RETURNING *
      `,
      [new_nombre, email, hashedPassword, sexo, telefono, id_rol, nombre]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await logEvent(bitacoraId, "PUT", `api/usuario/update/:${nombre}`, `Usuario ${nombre} modificado`);
    
    res.json({ message: "Usuario modificado exitosamente", user: result.rows[0] });
  } catch (error) {
    console.error("Error al modificar el usuario:", error);
    res.status(500).json({ message: "Error al modificar el usuario" });
  }
};

// ----------------------------
// Controlador para eliminar un usuario
// ----------------------------
const deleteUser = async (req, res) => {
  const { nombre } = req.params; 
  const { bitacoraId } = req.user;

  try {
    const result = await pool.query("DELETE FROM usuario WHERE nombre = $1", [
      nombre,
    ]);

    await logEvent(bitacoraId, "DELETE", `api/usuario/delete/:${nombre}`, `Usuario ${nombre} eliminado`);

    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

module.exports = {
  createUser,
  readUser,
  readUserByNombre,
  updateUser,
  deleteUser,
};
