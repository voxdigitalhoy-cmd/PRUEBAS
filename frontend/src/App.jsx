import React, { useState } from "react";
import "./index.css";

function App() {
  const [firstInitial, setFirstInitial] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [motherInitial, setMotherInitial] = useState("");
  const [section, setSection] = useState("");
  const [cp, setCp] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Puedes agregar validaciones aquí
    if (!firstInitial || !lastInitial || !motherInitial || !section || !cp || !answer) {
      setMessage("Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch("/api/encuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_initial: firstInitial,
          last_initial: lastInitial,
          mother_initial: motherInitial,
          section,
          cp,
          answer,
        }),
      });

      const data = await response.json();
      if (data.status === "ok") {
        setMessage("Encuesta guardada correctamente");
        // Resetear campos
        setFirstInitial("");
        setLastInitial("");
        setMotherInitial("");
        setSection("");
        setCp("");
        setAnswer("");
      } else {
        setMessage("Error al guardar la encuesta");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al guardar la encuesta");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <img src="/logo.png" alt="Logo" />
      <h2>¿Quieres que siga de presidente municipal, Luis Ernesto Munguia Gonzales?</h2>

      {/* Iniciales */}
      <div className="form-group">
        <label>Iniciales</label>
        <div className="initial-container">
          <input
            type="text"
            maxLength="1"
            className="initial"
            placeholder="P"
            value={firstInitial}
            onChange={(e) => setFirstInitial(e.target.value.toUpperCase())}
          />
          <input
            type="text"
            maxLength="1"
            className="initial"
            placeholder="L"
            value={lastInitial}
            onChange={(e) => setLastInitial(e.target.value.toUpperCase())}
          />
          <input
            type="text"
            maxLength="1"
            className="initial"
            placeholder="M"
            value={motherInitial}
            onChange={(e) => setMotherInitial(e.target.value.toUpperCase())}
          />
        </div>
      </div>

      {/* Sección / INE */}
      <div className="form-group">
        <label>Sección / INE</label>
        <input
          type="text"
          maxLength="6"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        />
      </div>

      {/* Código Postal */}
      <div className="form-group">
        <label>Código Postal</label>
        <input
          type="text"
          maxLength="10"
          value={cp}
          onChange={(e) => setCp(e.target.value)}
        />
      </div>

      {/* Respuesta */}
      <div className="form-group">
        <label>Respuesta</label>
        <div>
          <label>
            <input
              type="radio"
              value="Sí"
              checked={answer === "Sí"}
              onChange={(e) => setAnswer(e.target.value)}
            />
            Sí
          </label>
          <label>
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

      <button type="submit">Enviar</button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default App;
