import React, { useState, useEffect } from "react";

export default function App() {
  const [encuestas, setEncuestas] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
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
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>ENCUESTAS VOX DIGITAL HOY X MEXICO</h1>
      {encuestas.length === 0 ? (
        <p>No hay encuestas aún.</p>
      ) : (
        encuestas.map((e) => (
          <div key={e.id}>
            <strong>{e.nombre}</strong> - Edad: {e.edad} - Preferencia: {e.preferencia}
          </div>
        ))
      )}
    </div>
  );
}
