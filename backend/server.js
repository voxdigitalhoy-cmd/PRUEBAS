// -------------------------------
// ENCUESTAS VOX DIGITAL HOY MÉXICO
// Backend principal para Render
// -------------------------------

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Inicializar configuración
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------
// RUTAS DE API (puedes agregar las tuyas aquí)
// Ejemplo:
// app.get("/api/hello", (req, res) => {
//   res.json({ message: "Hola desde el backend!" });
// });
// -------------------------------

// -------------------------------
// SERVIR FRONTEND COMPILADO
// -------------------------------

// Detectar ruta absoluta actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Si la ruta no coincide con ninguna API, enviar index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// -------------------------------
// INICIAR SERVIDOR
// -------------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on ${PORT}`);
});
