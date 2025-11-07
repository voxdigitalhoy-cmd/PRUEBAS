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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🔹 Ruta de prueba
app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", time: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// ✅ Guardar encuesta
app.post("/api/encuestas", async (req, res) => {
  const {
    ine,
    first_initial,
    last_initial,
    mother_initial,
    section,
    cp,
    sex,
    answer
  } = req.body;

  try {
    // 1️⃣ Verificar si la persona ya existe
    let personResult = await pool.query(
      "SELECT id FROM persons WHERE identifier=$1",
      [ine]
    );

    let personId;
    if (personResult.rows.length === 0) {
      // Insertar nueva persona
      const insertPerson = await pool.query(
        "INSERT INTO persons (identifier, first_initial, last_initial, mother_initial, section, cp) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id",
        [ine, first_initial, last_initial, mother_initial, section, cp]
      );
      personId = insertPerson.rows[0].id;
    } else {
      personId = personResult.rows[0].id;
    }

    // 2️⃣ Crear respuesta en responses (encuesta "única")
    const surveyResult = await pool.query(
      "SELECT id FROM surveys WHERE title='Presidente Municipal' LIMIT 1"
    );

    let surveyId;
    if (surveyResult.rows.length === 0) {
      // Crear encuesta si no existe
      const insertSurvey = await pool.query(
        "INSERT INTO surveys (title, description, active) VALUES ($1,$2,$3) RETURNING id",
        ["Presidente Municipal", "Encuesta sobre el presidente municipal", true]
      );
      surveyId = insertSurvey.rows[0].id;

      // Crear pregunta
      await pool.query(
        "INSERT INTO questions (survey_id, type, text, required, position) VALUES ($1,$2,$3,$4,$5)",
        [surveyId, "single-choice", "¿Quieres que siga el presidente municipal?", true, 0]
      );
    } else {
      surveyId = surveyResult.rows[0].id;
    }

    // Insertar response
    const responseInsert = await pool.query(
      "INSERT INTO responses (survey_id, person_id, cp) VALUES ($1,$2,$3) RETURNING id",
      [surveyId, personId, cp]
    );
    const responseId = responseInsert.rows[0].id;

    // Obtener la pregunta
    const questionResult = await pool.query(
      "SELECT id FROM questions WHERE survey_id=$1 LIMIT 1",
      [surveyId]
    );
    const questionId = questionResult.rows[0].id;

    // Insertar la respuesta
    await pool.query(
      "INSERT INTO answers (response_id, question_id, text_answer) VALUES ($1,$2,$3)",
      [responseId, questionId, answer]
    );

    res.json({ status: "ok", message: "Encuesta guardada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar encuesta" });
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

