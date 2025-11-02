require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");

const pool = require("./db");
const getClientIp = require("./middleware/get_client_ip.middleware");
const { verificarToken } = require("./middleware/verificar_token.middleware");

const app = express();
const PORT = process.env.PORT;

// Autorizacion al frontend del puerto 3000
const allowedOrigins = [
  "http://localhost:5173",
  "http://frontend:5173",
  "http://localhost:3000",
  "https://proyecto-panaderia-frontend.vercel.app", 
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ Bloqueado por CORS: ${origin}`);
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Preflight
app.options('*', cors());


app.use(express.json());
app.use(getClientIp);

app.use("/auth", require("./routes/usuario/auth.routes"));

// Aplica el middleware a todas las rutas /api
app.use("/api", verificarToken);

// Rutas protegidas de Usuarios y permisos
app.use("/api/usuario", require("./routes/usuario/usuario.routes"));
app.use("/api/permiso", require("./routes/usuario/permiso.routes"));
app.use("/api/rol", require("./routes/usuario/rol.routes"));
app.use("/api/rol_permiso", require("./routes/usuario/rol_permiso.routes"));
app.use("/api/perfil", require("./routes/usuario/perfil.routes"));
app.use("/api/cambiar_contrasena", require("./routes/usuario/cambiar_contrasena.routes"));

// Rutas protegidas de Inventario
app.use("/api/categoria", require("./routes/inventario/categoria.routes"));
app.use("/api/producto", require("./routes/inventario/producto.routes"));
app.use("/api/insumo", require("./routes/inventario/insumo.routes"));

// Rutas protegidas de Producción
app.use("/api/receta", require("./routes/produccion/receta.routes"));
app.use("/api/detalle_receta", require("./routes/produccion/detalle_receta.routes"));
app.use("/api/produccion", require("./routes/produccion/produccion.routes"));
app.use("/api/participa", require("./routes/produccion/participa.routes"));

// Rutas protegidas de Compra
app.use("/api/proveedor", require("./routes/compra/proveedor.routes"));
app.use("/api/nota_compra", require("./routes/compra/nota_compra.routes"));
app.use("/api/compra_insumo", require("./routes/compra/compra_insumo.routes"));
app.use("/api/compra_producto", require("./routes/compra/compra_producto.routes"));

// Rutas protegidas de Auditoria
app.use("/api/bitacora", require("./routes/auditoria/bitacora.routes"));
app.use("/api/detalle_bitacora", require("./routes/auditoria/detalle_bitacora.routes"));

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
    console.log("Servidor corriendo en http://localhost:3001");
    client.release();
  } catch (error) {
    console.error("❌ Error al conectar con la BD:", error.message);
  }
});

module.exports = pool;