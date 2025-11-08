import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "pg";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const { Pool } = pkg;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

let liveResults = { Si: 0, No: 0, total: 0 };

// Test de conexión
app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", time: result.rows[0] });
  } catch (error) {
    console.error("❌ Error DB:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Guardar encuesta
app.post("/api/encuestas", async (req, res) => {
  const { ine, first_initial, last_initial, mother_initial, section, cp, context, question, answer } = req.body;

  try {
    // Verificar persona
    let personResult = await pool.query("SELECT id FROM persons WHERE identifier=$1", [ine]);
    let personId;
    if (personResult.rows.length === 0) {
      const insertPerson = await pool.query(
        "INSERT INTO persons (identifier, first_initial, last_initial, mother_initial, section, cp) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id",
        [ine, first_initial, last_initial, mother_initial, section, cp]
      );
      personId = insertPerson.rows[0].id;
    } else {
      personId = personResult.rows[0].id;
    }

    // Verificar encuesta
    const surveyResult = await pool.query("SELECT id FROM surveys WHERE title=$1 LIMIT 1", [context]);
    let surveyId;
    if (surveyResult.rows.length === 0) {
      const insertSurvey = await pool.query(
        "INSERT INTO surveys (title, description, active) VALUES ($1,$2,$3) RETURNING id",
        [context, `Encuesta en ${context}`, true]
      );
      surveyId = insertSurvey.rows[0].id;

      await pool.query(
        "INSERT INTO questions (survey_id, type, text, required, position) VALUES ($1,$2,$3,$4,$5)",
        [surveyId, "single-choice", question, true, 0]
      );
    } else surveyId = surveyResult.rows[0].id;

    // Guardar respuesta
    const responseInsert = await pool.query(
      "INSERT INTO responses (survey_id, person_id, cp) VALUES ($1,$2,$3) RETURNING id",
      [surveyId, personId, cp]
    );
    const responseId = responseInsert.rows[0].id;

    const questionResult = await pool.query("SELECT id FROM questions WHERE survey_id=$1 LIMIT 1", [surveyId]);
    const questionId = questionResult.rows[0].id;

    await pool.query(
      "INSERT INTO answers (response_id, question_id, text_answer) VALUES ($1,$2,$3)",
      [responseId, questionId, answer]
    );

    // Actualizar resultados en vivo
    if (answer === "Si") liveResults.Si++;
    if (answer === "No") liveResults.No++;
    liveResults.total++;

    io.emit("updateResults", liveResults);

    res.json({ status: "ok", message: "Encuesta guardada correctamente", results: liveResults });
  } catch (error) {
    console.error("❌ Error al guardar encuesta:", error);
    res.status(500).json({ error: "Error al guardar encuesta" });
  }
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
  socket.emit("updateResults", liveResults);
});

// Servir frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
