// src/App.jsx
import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [preferencia, setPreferencia] = useState("");
  const [encuestas, setEncuestas] = useState([]);

  // Obtener encuestas al cargar la página
  useEffect(() => {
    fetch("/api/encuestas")
      .then((res) => res.json())
      .then((data) => setEncuestas(data))
      .catch((err) => console.error("Error fetching encuestas:", err));
  }, []);

  // Guardar nueva encuesta
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !edad || !preferencia) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch("/api/encuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, edad, preferencia }),
      });
      const data = await res.json();

      if (data.status === "ok") {
        setEncuestas([data.data, ...encuestas]);
        setNombre("");
        setEdad("");
        setPreferencia("");
      } else {
        alert("Error al guardar encuesta");
      }
    } catch (error) {
      console.error("Error saving encuesta:", error);
      alert("Error al guardar encuesta");
    }
  };

  return (
    <div className="App">
      <h1>Encuestas Vox Digital Hoy</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
        />
        <input
          type="text"
          placeholder="Preferencia"
          value={preferencia}
          onChange={(e) => setPreferencia(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>

      <h2>Encuestas Recientes</h2>
      <ul>
        {encuestas.map((encuesta) => (
          <li key={encuesta.id}>
            {encuesta.nombre} ({encuesta.edad}) - {encuesta.preferencia}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

