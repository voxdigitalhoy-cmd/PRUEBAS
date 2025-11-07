import React, { useState } from "react";

export default function App() {
  const [identifier, setIdentifier] = useState(""); // # de INE
  const [firstInitial, setFirstInitial] = useState(""); // Inicial del primer nombre
  const [lastInitial, setLastInitial] = useState(""); // Inicial del apellido paterno
  const [motherInitial, setMotherInitial] = useState(""); // Inicial del apellido materno
  const [section, setSection] = useState(""); // Sección del INE
  const [cp, setCp] = useState(""); // Código postal
  const [sex, setSex] = useState("X"); // H/M/X
  const [answer, setAnswer] = useState(""); // Sí / No
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier || !firstInitial || !lastInitial || !section || !cp || !answer) {
      setMessage("❌ Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      const res = await fetch("/api/encuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          first_initial: firstInitial.toUpperCase(),
          last_initial: lastInitial.toUpperCase(),
          mother_initial: motherInitial.toUpperCase(),
          section,
          cp,
          sex,
          answer
        })
      });

      const data = await res.json();
      if (data.status === "ok") {
        setMessage("✅ Encuesta enviada correctamente. ¡Gracias!");
        // limpiar formulario
        setIdentifier("");
        setFirstInitial("");
        setLastInitial("");
        setMotherInitial("");
        setSection("");
        setCp("");
        setSex("X");
        setAnswer("");
      } else {
        setMessage("❌ Error al enviar la encuesta.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error de conexión con el servidor.");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h2>ENCUESTAS VOX DIGITAL HOY X MEXICO</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label># de INE (OCR): </label>
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
        </div>
        <div>
          <label>Inicial primer nombre: </label>
          <input value={firstInitial} onChange={(e) => setFirstInitial(e.target.value)} maxLength={1} required />
        </div>
        <div>
          <label>Inicial apellido paterno: </label>
          <input value={lastInitial} onChange={(e) => setLastInitial(e.target.value)} maxLength={1} required />
        </div>
        <div>
          <label>Inicial apellido materno: </label>
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
          <select value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="H">Hombre</option>
            <option value="M">Mujer</option>
            <option value="X">Indefinido</option>
          </select>
        </div>
        <div>
          <label>¿Quieres que siga el presidente municipal?: </label>
          <select value={answer} onChange={(e) => setAnswer(e.target.value)} required>
            <option value="">-- Selecciona --</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Enviar Encuesta</button>
      </form>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
