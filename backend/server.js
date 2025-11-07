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

// Conexión a PostgreSQL
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

// ✅ Ruta para guardar la encuesta
app.post("/api/encuestas", async (req, res) => {
  try {
    const {
      ine,
      first_initial,
      last_initial,
      mother_initial,
      section,
      cp,
      birth_year,
      sex,
      answer
    } = req.body;

    // 1️⃣ Insertar o buscar usuario
    let personResult = await pool.query(
      "SELECT id FROM persons WHERE identifier=$1",
      [ine]
    );

    let personId;
    if (personResult.rows.length === 0) {
      const insertPerson = await pool.query(
        `INSERT INTO persons
          (identifier, first_initial, last_initial, mother_initial, section, cp, birth_year)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING id`,
        [ine, first_initial, last_initial, mother_initial, section, cp, birth_year]
      );
      personId = insertPerson.rows[0].id;
    } else {
      personId = personResult.rows[0].id;
    }

    // 2️⃣ Obtener encuesta activa
    const surveyResult = await pool.query(
      "SELECT id FROM surveys WHERE title=$1 AND active=true LIMIT 1",
      ["¿Quieres que siga el presidente municipal?"]
    );

    if (surveyResult.rows.length === 0) {
      return res.status(400).json({ error: "Encuesta no encontrada" });
    }
    const surveyId = surveyResult.rows[0].id;

    // 3️⃣ Crear respuesta
    const responseResult = await pool.query(
      "INSERT INTO responses (survey_id, person_id, cp) VALUES ($1,$2,$3) RETURNING id",
      [surveyId, personId, cp]
    );
    const responseId = responseResult.rows[0].id;

    // 4️⃣ Obtener pregunta
    const questionResult = await pool.query(
      "SELECT id FROM questions WHERE survey_id=$1 LIMIT 1",
      [surveyId]
    );
    const questionId = questionResult.rows[0].id;

    // 5️⃣ Obtener opción según respuesta
    const optionResult = await pool.query(
      "SELECT id FROM question_options WHERE question_id=$1 AND text=$2 LIMIT 1",
      [questionId, answer]
    );
    const optionId = optionResult.rows.length > 0 ? optionResult.rows[0].id : null;

    // 6️⃣ Guardar respuesta
    await pool.query(
      "INSERT INTO answers (response_id, question_id, option_id) VALUES ($1,$2,$3)",
      [responseId, questionId, optionId]
    );

    res.json({ status: "ok", message: "Encuesta enviada correctamente" });

  } catch (error) {
    console.error("❌ Error al guardar encuesta:", error);
    res.status(500).json({ error: "Database insert failed" });
  }
});

// ✅ Servir frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
