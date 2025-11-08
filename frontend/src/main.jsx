import React, { useState } from "react";
import "./index.css";

function App() {
  const [ine, setIne] = useState("");
  const [firstInitial, setFirstInitial] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [motherInitial, setMotherInitial] = useState("");
  const [section, setSection] = useState("");
  const [cp, setCp] = useState("");
  const [sex, setSex] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/encuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ine,
          first_initial: firstInitial,
          last_initial: lastInitial,
          mother_initial: motherInitial,
          section,
          cp,
          sex,
          answer,
        }),
      });
      const data = await res.json();
      if (data.status === "ok") {
        setMessage("Encuesta guardada correctamente");
        setIne("");
        setFirstInitial("");
        setLastInitial("");
        setMotherInitial("");
        setSection("");
        setCp("");
        setSex("");
        setAnswer("");
      } else {
        setMessage("Error al guardar encuesta");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al guardar encuesta");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <img src="/logo.png" alt="Logo" />
      <h2>Encuesta Presidente Municipal</h2>

      <div className="form-group">
        <label>Sección INE:</label>
        <input
          className="section"
          maxLength={6}
          value={section}
          onChange={(e) => setSection(e.target.value.toUpperCase())}
          required
        />
      </div>

      <div className="form-group">
        <label>Código Postal:</label>
        <input
          className="cp"
          maxLength={10}
          value={cp}
          onChange={(e) => setCp(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Iniciales:</label>
        <input
          className="initial"
          maxLength={1}
          value={firstInitial}
          onChange={(e) => setFirstInitial(e.target.value.toUpperCase())}
          required
        />
        <input
          className="initial"
          maxLength={1}
          value={lastInitial}
          onChange={(e) => setLastInitial(e.target.value.toUpperCase())}
          required
        />
        <input
          className="initial"
          maxLength={1}
          value={motherInitial}
          onChange={(e) => setMotherInitial(e.target.value.toUpperCase())}
          required
        />
      </div>

      <div className="form-group">
        <label>Sexo:</label>
        <select value={sex} onChange={(e) => setSex(e.target.value)} required>
          <option value="">Selecciona</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
      </div>

      <div className="form-group">
        <label>¿Quieres que siga como presidente municipal, Luis Ernesto Munguia Gonzales?</label>
        <div>
          <label>
            <input
              type="radio"
              value="Sí"
              checked={answer === "Sí"}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
            Sí
          </label>
          <label style={{ marginLeft: "1rem" }}>
            <input
              type="radio"
              value="No"
              checked={answer === "No"}
              onChange={(e) => setAnswer(e.target.value)}
            />
            No
          </label>
        </div>
      </div>

      <button type="submit">Enviar Encuesta</button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default App;
