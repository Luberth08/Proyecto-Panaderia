require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");

const pool = require("./db");
const getClientIp = require("./middleware/get_client_ip.middleware");
const { verificarToken } = require("./middleware/verificar_token.middleware");

const app = express();
const PORT = process.env.PORT;

// Autorizacion al frontend del puerto 3000
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(getClientIp);

app.use("/auth", require("./routers/usuario/auth.routers"));

// Aplica el middleware a todas las rutas /api
app.use("/api", verificarToken);

// Rutas protegidas de Usuarios y permisos
app.use("/api/usuario", require("./routers/usuario/usuario.routers"));
app.use("/api/permiso", require("./routers/usuario/permiso.routers"));
app.use("/api/rol", require("./routers/usuario/rol.routers"));
app.use("/api/rol_permiso", require("./routers/usuario/rol_permiso.routers"));
app.use("/api/perfil", require("./routers/usuario/perfil.routers"));
app.use("/api/cambiar_contrasena", require("./routers/usuario/cambiar_contrasena.routers"));

// Rutas protegidas de Inventario
app.use("/api/categoria", require("./routers/inventario/categoria.routers"));
app.use("/api/producto", require("./routers/inventario/producto.routers"));
app.use("/api/insumo", require("./routers/inventario/insumo.routers"));

// Rutas protegidas de Producción
app.use("/api/receta", require("./routers/produccion/receta.routers"));

// Rutas protegidas de Compra
app.use("/api/proveedor", require("./routers/compra/proveedor.routers"));

// Ruta de prueba para verificar que el servidor está activo
app.get("/ping", (req, res) => {
  res.json({ message: "pong 🏓, servidor activo!" });
});

app.listen(PORT, async () => {
    
  console.log(`Servidor corriendo en el puerto: ${PORT}`);

  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log(`✅ BD conectada correctamente. Hora del servidor PostgreSQL: ${result.rows[0].now}`);
    client.release();
  } catch (error) {
    console.error("❌ Error al conectar con la BD:", error.message);
  }
});

module.exports = pool;