import React, { useState } from "react";

export default function App() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState({
    identifier: "",
    first_initial: "",
    last_initial: "",
    mother_initial: "",
    section: "",
    cp: "",
    sexo: "H",
  });

  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!answer) {
      setStatus("Por favor selecciona una respuesta a la encuesta.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/encuestas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...user,
          survey_id: 1, // ID de la encuesta "Presidente municipal"
          answers: [{ question_id: 1, option_id: answer === "Sí" ? 1 : 2 }],
        }),
      });

      const data = await response.json();

      if (data.status === "ok") {
        setStatus("✅ Encuesta enviada correctamente.");
        setAnswer("");
      } else {
        setStatus("❌ Error al enviar la encuesta.");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Error de conexión con el servidor.");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>ENCUESTAS VOX DIGITAL HOY X MEXICO</h2>

      <form onSubmit={handle
