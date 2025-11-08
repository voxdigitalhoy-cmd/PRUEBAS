import React, { useState } from "react";
import logo from "/logo.png";

export default function App() {
  const [ine, setIne] = useState("");
  const [firstInitial, setFirstInitial] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [motherInitial, setMotherInitial] = useState("");
  const [section, setSection] = useState("");
  const [cp, setCp] = useState("");
  const [sex, setSex] = useState("X");
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  // Puedes cambiar el contexto según la ubicación
  const context = "Puerto Vallarta, Jalisco";

  // La pregunta puede modificarse fácilmente aquí
  const question =
    "¿Quieres que siga de presidente municipal Luis Ernesto Munguía González?";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ine,
      first_initial: firstInitial,
      last_initial: lastInitial,
      mother_initial: motherInitial,
      section,
      cp,
      sex,
      context,
      question,
      answer,
    };

    try {
      const res = await fetch("/api/encuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setMessage("✅ ¡Gracias por participar en la encuesta!");
      } else {
        setMessage("❌ Error al guardar encuesta: " + result.error);
      }
    } catch (error) {
      setMessage("❌ Error de conexión con el servidor.");
      console.error(error);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "sans-serif" }}>
        <img src={logo} alt="Logo" style={{ width: "120px", marginBottom: "20px" }} />
        <h2>✅ Gracias por tu participación</h2>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 10,
        fontFamily: "sans-serif",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <img src={logo} alt="Logo" style={{ width: "120px", marginBottom: "15px" }} />
        <h2>ENCUESTA VOX DIGITAL HOY X MÉXICO</h2>
        <p style={{ color: "#555" }}>{context}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label>Número de INE (OCR):</label>
        <input
          type="text"
          value={ine}
          onChange={(e) => setIne(e.target.value)}
          required
          maxLength={13}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Inicial nombre:</label>
        <input
          type="text"
          value={firstInitial}
          onChange={(e) => setFirstInitial(e.target.value.toUpperCase())}
          required
          maxLength={1}
          style={{ width: "30%", marginRight: 5 }}
        />

        <label>Inicial apellido paterno:</label>
        <input
          type="text"
          value={lastInitial}
          onChange={(e) => setLastInitial(e.target.value.toUpperCase())}
          required
          maxLength={1}
          style={{ width: "30%", marginRight: 5 }}
        />

        <label>Inicial apellido materno:</label>
        <input
          type="text"
          value={motherInitial}
          onChange={(e) => setMotherInitial(e.target.value.toUpperCase())}
          maxLength={1}
          style={{ width: "30%" }}
        />

        <label>Sección INE:</label>
        <input
          type="text"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Código Postal:</label>
        <input
          type="text"
          value={cp}
          onChange={(e) => setCp(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Sexo:</label>
        <select
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        >
          <option value="H">Hombre</option>
          <option value="M">Mujer</option>
          <option value="X">Indefinido</option>
        </select>

        <h3 style={{ marginTop: 20 }}>{question}</h3>

        <div style={{ display: "flex", justifyContent: "space-around", marginTop: 10 }}>
          <label>
            <input
              type="radio"
              name="answer"
              value="Sí"
              checked={answer === "Sí"}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />{" "}
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="answer"
              value="No"
              checked={answer === "No"}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />{" "}
            No
          </label>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: 20,
            padding: 10,
            backgroundColor: "#2c3e50",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Enviar respuesta
        </button>

        {message && <p style={{ color: "red", marginTop: 10 }}>{message}</p>}
      </form>
    </div>
  );
}

