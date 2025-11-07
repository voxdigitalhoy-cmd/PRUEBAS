import React, { useState, useEffect } from "react";

// URL de tu backend
const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [userId, setUserId] = useState("");
  const [loginData, setLoginData] = useState({ codigoOCR: "", iniciales: "", seccion: "", cp: "" });
  const [encuestas, setEncuestas] = useState([]);
  const [respuesta, setRespuesta] = useState("");
  const [sexo, setSexo] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Verificar si ya hay usuario logueado
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) setUserId(id);
  }, []);

  // Cargar encuestas
  useEffect(() => {
    if (!userId) return;
    const fetchEncuestas = async () => {
      try {
        const res = await fetch(`${API_URL}/api/encuestas`);
        const data = await res.json();
        setEncuestas(data);
      } catch (error) {
        console.error("Error al cargar encuestas:", error);
      }
    };
    fetchEncuestas();
  }, [userId]);

  // Manejo del login
  const handleLogin = (e) => {
    e.preventDefault();
    const { codigoOCR, iniciales, seccion, cp } = loginData;
    if (!codigoOCR || !iniciales || !seccion || !cp) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    // Generar user_id
    const id = `${codigoOCR}-${iniciales}-${seccion}-${cp}`;
    localStorage.setItem("userId", id);
    setUserId(id);
    setMensaje("");
  };

  // Manejo del submit de la encuesta
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!respuesta || !sexo) {
      setMensaje("Seleccione respuesta y sexo");
      return;
    }

    // Verificar si ya votó
    const yaVoto = encuestas.find((e) => e.user_id === userId);
    if (yaVoto) {
      setMensaje("Ya ha votado esta encuesta");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/encuestas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          nombre: "Encuesta Presidencia Municipal",
          edad: 0,
          preferencia: respuesta,
          sexo: sexo,
        }),
      });
      const data = await res.json();
      setEncuestas([data.data, ...encuestas]);
      setRespuesta("");
      setSexo("");
      setMensaje("Voto registrado correctamente ✅");
    } catch (error) {
      console.error("Error al guardar encuesta:", error);
      setMensaje("Error al registrar voto");
    }
  };

  // Conteo de votos
  const conteo = encuestas.reduce(
    (acc, e) => {
      if (e.preferencia === "Sí") acc.Sí += 1;
      if (e.preferencia === "No") acc.No += 1;
      return acc;
    },
    { Sí: 0, No: 0 }
  );

  // Si no hay login, mostrar formulario de login
  if (!userId) {
    return (
      <form onSubmit={handleLogin} style={{ padding: 20 }}>
        <h2>Ingrese sus datos de INE para votar</h2>
        <input
          type="text"
          placeholder="Código OCR"
          value={loginData.codigoOCR}
          onChange={(e) => setLoginData({ ...loginData, codigoOCR: e.target.value })}
        />
        <br />
        <input
          type="text"
          placeholder="Iniciales (Nombre + Apellido P + Apellido M)"
          value={loginData.iniciales}
          onChange={(e) => setLoginData({ ...loginData, iniciales: e.target.value })}
        />
        <br />
        <input
          type="text"
          placeholder="Sección INE"
          value={loginData.seccion}
          onChange={(e) => setLoginData({ ...loginData, seccion: e.target.value })}
        />
        <br />
        <input
          type="text"
          placeholder="Código postal"
          value={loginData.cp}
          onChange={(e) => setLoginData({ ...loginData, cp: e.target.value })}
        />
        <br />
        <button type="submit">Entrar a la encuesta</button>
        <p style={{ color: "red" }}>{mensaje}</p>
      </form>
    );
  }

  // Si hay login, mostrar encuesta
  return (
    <div style={{ padding: 20 }}>
      <h1>ENCUESTAS VOX DIGITAL HOY X MEXICO</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <p>¿Quieres que siga el presidente municipal?</p>
        <label>
          <input
            type="radio"
            name="respuesta"
            value="Sí"
            checked={respuesta === "Sí"}
            onChange={(e) => setRespuesta(e.target.value)}
          />{" "}
          Sí
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="respuesta"
            value="No"
            checked={respuesta === "No"}
            onChange={(e) => setRespuesta(e.target.value)}
          />{" "}
          No
        </label>

        <p>Sexo:</p>
        <label>
          <input
            type="radio"
            name="sexo"
            value="H"
            checked={sexo === "H"}
            onChange={(e) => setSexo(e.target.value)}
          />{" "}
          Hombre
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="sexo"
            value="M"
            checked={sexo === "M"}
            onChange={(e) => setSexo(e.target.value)}
          />{" "}
          Mujer
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="sexo"
            value="X"
            checked={sexo === "X"}
            onChange={(e) => setSexo(e.target.value)}
          />{" "}
          Indefinido
        </label>
        <br />
        <button type="submit">Enviar Encuesta</button>
        <p style={{ color: "green" }}>{mensaje}</p>
      </form>

      <h2>Resultados</h2>
      <p>Sí: {conteo.Sí} | No: {conteo.No}</p>

      <h3>Detalle de encuestas:</h3>
      {encuestas.length === 0 ? (
        <p>No hay encuestas aún.</p>
      ) : (
        encuestas.map((e) => (
          <div key={e.id}>
            <strong>ID:</strong> {e.user_id} - <strong>Sexo:</strong> {e.sexo} - <strong>Respuesta:</strong> {e.preferencia}
          </div>
        ))
      )}
    </div>
  );
}

