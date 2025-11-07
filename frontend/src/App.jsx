import React, { useState, useEffect } from "react";

export default function App() {
  const [firstInitial, setFirstInitial] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [motherInitial, setMotherInitial] = useState("");
  const [ineNumber, setIneNumber] = useState("");
  const [section, setSection] = useState("");
  const [cp, setCp] = useState("");
  const [gender, setGender] = useState("H"); // H / M / X
  const [answer, setAnswer] = useState(""); // "Sí" o "No"
  const [status, setStatus] = useState("");

  const surveyId = 1; // ID de la encuesta creada en la DB
  const questionId = 1; // ID de la pregunta "¿Quieres que siga el presidente municipal?"

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      identifier: `${ineNumber}${firstInitial}${lastInitial}${motherInitial}${section}${cp}`,
      first_initial: firstInitial,
      last_initial: lastInitial,
      mother_initial: motherInitial,
      section,
      cp,
      survey_id: surveyId,
      answers: [
        {
          question_id: questionId,
          text_answer: answer
        }
      ]
    };

    try {
      const res = await fetch("/api/encuestas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.status === "ok") {
        setStatus("✅ Encuesta enviada correctamente");
        // Limpiar formulario si quieres
      } else {
        setStatus("❌ Error al enviar la encuesta");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Error de conexión con el servidor");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>ENCUESTAS VOX DIGITAL HOY X MEXICO</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>INE: </label>
          <input value={ineNumber} onChange={(e) => setIneNumber(e.target.value)} required />
        </div>
        <div>
          <label>Inicial del primer nombre: </label>
          <input value={firstInitial} onChange={(e) => setFirstInitial(e.target.value)} required maxLength={1} />
        </div>
        <div>
          <label>Inicial del apellido paterno: </label>
          <input value={lastInitial} onChange={(e) => setLastInitial(e.target.value)} required maxLength={1} />
        </div>
        <div>
          <label>Inicial del apellido materno: </label>
          <input value={motherInitial} onChange={(e) => setMotherInitial(e.target.value)} maxLength={1} />
        </div>
        <div>
          <label>Sección del INE: </label>
          <input value={section} onChange={(e) => setSection(e.target.value)} required />
        </div>
        <div>
          <label>Código Postal: </label>
          <input value={cp} onChange={(e) => setCp(e.target.value)} required />
        </div>
        <div>
          <label>Sexo: </label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="H">Hombre</option>
            <option value="M">Mujer</option>
            <option value="X">Indefinido</option>
          </select>
        </div>
        <div>
          <label>¿Quieres que siga el presidente municipal? </label>
          <select value={answer} onChange={(e) => setAnswer(e.target.value)} required>
            <option value="">Selecciona</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Enviar encuesta</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
