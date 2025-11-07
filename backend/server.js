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

// ✅ Nueva ruta para guardar encuestas (Formulario)
app.post("/api/encuestas", async (req, res) => {
  try {
    const {
      identifier,
      first_initial,
      last_initial,
      mother_initial,
      section,
      cp,
      sex,
      answer // "Sí" o "No"
    } = req.body;

    // 🔹 Verificar si el usuario ya existe
    let person = await pool.query(
      "SELECT * FROM persons WHERE identifier = $1",
      [identifier]
    );

    if (person.rows.length === 0) {
      const result = await pool.query(
        `INSERT INTO persons 
          (identifier, first_initial, last_initial, mother_initial, section, cp, sex)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [identifier, first_initial, last_initial, mother_initial, section, cp, sex]
      );
      person = { rows: [result.rows[0]] };
    }

    // 🔹 Crear respuesta para encuesta 1 (presidente municipal)
    const response = await pool.query(
      "INSERT INTO responses (survey_id, person_id, cp) VALUES ($1,$2,$3) RETURNING *",
      [1, person.rows[0].id, cp]
    );

    // 🔹 Guardar la respuesta
    const optionId = answer.toLowerCase() === "sí" ? 1 : 2; // suponiendo opciones 1=Sí, 2=No
    await pool.query(
      "INSERT INTO answers (response_id, question_id, option_id) VALUES ($1,$2,$3)",
      [response.rows[0].id, 1, optionId] // question_id = 1
    );

    res.json({ status: "ok" });
  } catch (error) {
    console.error("❌ Error al guardar encuesta:", error);
    res.status(500).json({ error: "Database insert failed" });
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

