const pool = require("../../db.js");
const { logEvent } = require("../../utils/bitacoraUtils.js");

// ----------------------------
// Controlador para crear una nueva categoria
// ----------------------------
const createCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    await pool.query(
      "INSERT INTO categoria (nombre, descripcion) VALUES ($1, $2)",
      [nombre, descripcion]
    );

    await logEvent(req.user.bitacoraId, "POST", "api/categoria/create", `Categoria ${nombre} creada`);

    res.json({ message: "Categoria creada exitosamente" });
  } catch (error) {
    console.error("Error al crear la categoria:", error);
    res.status(500).json({ message: "Error al crear la categoria" });
  }
};

// ----------------------------
// Controlador para obtener todas las categorias
// ----------------------------
const readCategoria = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categoria");

    await logEvent(req.user.bitacoraId, "GET", "api/categoria/read", "Se consultaron todas las categorias");

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener categorias:", error);
    res.status(500).json({ message: "Error al obtener categorias" });
  }
};

// ----------------------------
// Controlador para obtener una categoria por ID
// ----------------------------
const readCategoriaById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
        "SELECT * FROM categoria WHERE id = $1", 
        [id]
    );

    await logEvent(req.user.bitacoraId, "GET", `api/categoria/read/:${id}`, `Se consulto la categoria ${id}`);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener categoria:", error);
    res.status(500).json({ message: "Error al obtener categoria" });
  }
};

// ----------------------------
// Controlador para actualizar una categoria por ID
// ----------------------------
const updateCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  try {
    await pool.query(
      "UPDATE categoria SET nombre = $1, descripcion = $2 WHERE id = $3",
      [nombre, descripcion, id]
    );

    await logEvent(req.user.bitacoraId, "PUT", `api/categoria/update/:${id}`, `Categoria ${id} actualizada`);

    res.json({ message: "Categoria actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar la categoria:", error);
    res.status(500).json({ message: "Error al actualizar la categoria" });
  }
};

// ----------------------------
// Controlador para eliminar una categoria por ID
// ----------------------------
const deleteCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
        "DELETE FROM categoria WHERE id = $1", 
        [id]
    );

    await logEvent(req.user.bitacoraId, "DELETE", `api/categoria/delete/:${id}`, `Categoria ${id} eliminada`);

    res.json({ message: "Categoria eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la categoria:", error);
    res.status(500).json({ message: "Error al eliminar la categoria" });
  }
};

module.exports = {
  createCategoria,
  readCategoria,
  readCategoriaById,
  updateCategoria,
  deleteCategoria,
};
