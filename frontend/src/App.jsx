import React, { useState, useEffect } from "react";

export default function App() {
  const [nombre, setNombre] = useState("");
  const [sexo, setSexo] = useState("H");
  const [respuesta, setRespuesta] = useState("si");
  const [mensaje, setMensaje] = useState("");
  const [encuestas, setEncuestas] = useState([]);

  // Obtener encuestas existentes al cargar
  useEffect(() => {
    fetch("/api/encuestas")
      .then((res) => res.json())
      .then((data) => setEncuestas(data))
      .catch((err) => console.error("Error fetch encuestas:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    // Validación básica
    if (!nombre.trim()) {
      setMensaje("Ingresa tu nombre.");
      return;
    }

    try {
      const res = await fetch("/api/encuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, sexo, respuesta }),
      });
      const data = await res.json();
      if (data.status === "ok") {
        setMensaje("Encuesta enviada correctamente!");
        setEncuestas([data.data, ...encuestas]);
        setNombre("");
        setSexo("H");
        setRespuesta("si");
      } else {
        setMensaje("Error al enviar encuesta.");
      }
    } catch (error) {
      console.error("Error enviar encuesta:", error);
      setMensaje("Error al enviar encuesta.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>ENCUESTAS VOX DIGITAL HOY X MEXICO</h1>

     <form onSubmit={handleSubmit}> style={{ marginBottom: 20 }}>
        <div>
          <label>
            Nombre:
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ marginLeft: 10 }}
            />
          </label>
        </div>

        <div style={{ marginTop: 10 }}>
          <label>
            Sexo:
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              style={{ marginLeft: 10 }}
            >
              <option value="H">Hombre</option>
              <option value="M">Mujer</option>
              <option value="X">Indefinido</option>
            </select>
          </label>
        </div>

        <div style={{ marginTop: 10 }}>
          <label>
            ¿Quieres que siga el presidente municipal?
            <select
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              style={{ marginLeft: 10 }}
            >
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>

        <button type="submit" style={{ marginTop: 15 }}>
          Enviar
        </button>
      </form>

      {mensaje && <p>{mensaje}</p>}

      <h2>Encuestas enviadas</h2>
      {encuestas.length === 0 ? (
        <p>No hay encuestas aún.</p>
      ) : (
        <ul>
          {encuestas.map((e) => (
            <li key={e.id}>
              {e.nombre} ({e.sexo}) - {e.respuesta}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>ENCUESTAS VOX DIGITAL HOY X MEXICO</h2>

      <form onSubmit={handle
