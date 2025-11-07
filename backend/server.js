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

// Configuración rutas absolutas para producción (Render)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexión a PostgreSQL (Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🔹 Ruta de prueba para verificar conexión
app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", time: result.rows[0] });
  } catch (error) {
    console.error("❌ Error DB:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// ✅ Ruta para guardar encuestas (Formulario)
app.post("/api/encuestas", async (req, res) => {
  try {
    const { nombre, edad, preferencia } = req.body;

    const result = await pool.query(
      "INSERT INTO encuestas (nombre, edad, preferencia) VALUES ($1, $2, $3) RETURNING *",
      [nombre, edad, preferencia]
    );

    res.json({ status: "ok", data: result.rows[0] });
  } catch (error) {
    console.error("❌ Error al guardar encuesta:", error);
    res.status(500).json({ error: "Database insert failed" });
  }
});

// ✅ Ruta para obtener las encuestas
app.get("/api/encuestas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM encuestas ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener encuestas:", error);
    res.status(500).json({ error: "Database fetch failed" });
  }
});

// ✅ Servir el frontend (React build)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
