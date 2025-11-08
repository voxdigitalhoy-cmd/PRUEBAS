import React, { useState } from "react";
import logo from "../public/logo.png"; // asegúrate que el logo esté en /frontend/public/logo.png

export default function App() {
  const [initials, setInitials] = useState({ first: "", last: "", mother: "" });
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInitials({ ...initials, [name]: value.toUpperCase().slice(0, 1) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!initials.first || !initials.last || !initials.mother || !answer) {
      alert("Por favor completa tus iniciales y selecciona una respuesta.");
      return;
    }

    const data = {
      initials: `${initials.first}${initials.last}${initials.mother}`,
      answer,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/encuestas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error al guardar encuesta");

      setSubmitted(true);
    } catch (err) {
      alert("❌ Error al guardar encuesta");
      console.error(err);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        padding: "30px",
      }}
    >
      <img
        src={logo}
        alt="Logo Vox Digital Hoy"
        style={{ width: "150px", marginBottom: "20px" }}
      />
      <h1>Encuestas Vox Digital Hoy</h1>

      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              name="first"
              placeholder="Inicial Nombre"
              value={initials.first}
              onChange={handleChange}
              style={{ width: "80px", textAlign: "center", marginRight: "5px" }}
            />
            <input
              type="text"
              name="last"
              placeholder="Inicial Paterno"
              value={initials.last}
              onChange={handleChange}
              style={{ width: "80px", textAlign: "center", marginRight: "5px" }}
            />
            <input
              type="text"
              name="mother"
              placeholder="Inicial Materno"
              value={initials.mother}
              onChange={handleChange}
              style={{ width: "80px", textAlign: "center" }}
            />
          </div>

          <h2>¿Quieres que siga de presidente municipal, Luis Ernesto Munguía González?</h2>

          <div style={{ marginTop: "10px" }}>
            <label style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name="answer"
                value="Sí"
                onChange={(e) => setAnswer(e.target.value)}
              />{" "}
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="answer"
                value="No"
                onChange={(e) => setAnswer(e.target.value)}
              />{" "}
              No
            </label>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Enviar
          </button>
        </form>
      ) : (
        <h3 style={{ color: "green", marginTop: "20px" }}>
          ✅ Gracias por participar.
        </h3>
      )}
    </div>
  );
}
