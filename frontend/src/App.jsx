import React, { useState } from "react";

export default function App() {
  const [ine, setIne] = useState("");
  const [firstInitial, setFirstInitial] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [motherInitial, setMotherInitial] = useState("");
  const [section, setSection] = useState("");
  const [cp, setCp] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ine || !firstInitial || !lastInitial || !section || !cp || !birthYear || !answer) {
      setMessage("Por favor completa todos los campos.");
      return;
    }

    try {
      const res = await fetch("/api/encuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ine_identifier: ine,
          first_initial: firstInitial.toUpperCase(),
          last_initial: lastInitial.toUpperCase(),
          mother_initial: motherInitial ? motherInitial.toUpperCase() : null,
          section,
          cp,
          birth_year: parseInt(birthYear),
          survey_id: 1,      // ID de la encuesta creada en 003_seed_survey.sql
          question_id: 1,    // ID de la pregunta
          option_id: answer === "si" ? 1 : 2 // 1=Sí, 2=No
        })
      });

      const data = await res.json();
      if (data.status === "ok") {
        setMessage("✅ Encuesta enviada correctamente");
        // Limpiar formulario
        setIne(""); setFirstInitial(""); setLastInitial(""); setMotherInitial("");
        setSection(""); setCp(""); setBirthYear(""); setAnswer("");
      } else {
        setMessage("❌ Error al enviar la encuesta");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h2>ENCUESTAS VOX DIGITAL HOY X MEXICO</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>INE (# OCR): </label>
          <input value={ine} onChange={(e) => setIne(e.target.value)} />
        </div>
        <div>
          <label>Inicial del primer nombre: </label>
          <input value={firstInitial} onChange={(e) => setFirstInitial(e.target.value)} maxLength={1}/>
        </div>
        <div>
          <label>Inicial del apellido paterno: </label>
          <input value={lastInitial} onChange={(e) => setLastInitial(e.target.value)} maxLength={1}/>
        </div>
        <div>
          <label>Inicial del apellido materno (X si indefinido): </label>
          <input value={motherInitial} onChange={(e) => setMotherInitial(e.target.value)} maxLength={1}/>
        </div>
        <div>
          <label>Sección del INE: </label>
          <input value={section} onChange={(e) => setSection(e.target.value)} />
        </div>
        <div>
          <label>Código postal: </label>
          <input value={cp} onChange={(e) => setCp(e.target.value)} />
        </div>
        <div>
          <label>Año de nacimiento: </label>
          <input type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} />
        </div>
        <div>
          <label>¿Quieres que siga el presidente municipal?</label><br/>
          <label>
            <input
              type="radio"
              value="si"
              checked={answer === "si"}
              onChange={(e) => setAnswer(e.target.value)}
            /> Sí
          </label>
          <label style={{ marginLeft: 10 }}>
            <input
              type="radio"
              value="no"
              checked={answer === "no"}
              onChange={(e) => setAnswer(e.target.value)}
            /> No
          </label>
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Enviar encuesta</button>
      </form>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
