import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Configuración de rutas absolutas (para servir frontend React)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Conexión a PostgreSQL (Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ✅ Ruta de prueba: verificar conexión con la base de datos
app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", time: result.rows[0] });
  } catch (error) {
    console.error("❌ Error DB:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// ✅ Ruta para insertar usuarios en la base de datos
app.post("/api/usuarios", async (req, res) => {
  const { nombre, email } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *",
      [nombre, email]
    );

    res.json({
      status: "success",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("❌ Error al insertar usuario:", error);
    res.status(500).json({ error: "Error al insertar en la base de datos" });
  }
});

// ✅ Servir el frontend (React build)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ✅ Iniciar servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
