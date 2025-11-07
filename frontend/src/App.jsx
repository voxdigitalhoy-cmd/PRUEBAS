import React, { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    ine: "",
    first_initial: "",
    last_initial: "",
    mother_initial: "",
    section: "",
    cp: "",
    sex: "H",
    answer: ""
  });

  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "/api";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/encuestas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (data.status === "ok") {
        setMessage("✅ Encuesta enviada correctamente");
        setForm({
          ine: "",
          first_initial: "",
          last_initial: "",
          mother_initial: "",
          section: "",
          cp: "",
          sex: "H",
          answer: ""
        });
      } else {
        setMessage("❌ Error al enviar encuesta");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error al enviar encuesta");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>ENCUESTAS VOX DIGITAL HOY X MEXICO</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="text"
          name="ine"
          placeholder="Número de INE"
          value={form.ine}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="first_initial"
          placeholder="Inicial del primer nombre"
          value={form.first_initial}
          onChange={handleChange}
          maxLength={1}
          required
        />
        <input
          type="text"
          name="last_initial"
          placeholder="Inicial del apellido paterno"
          value={form.last_initial}
          onChange={handleChange}
          maxLength={1}
          required
        />
        <input
          type="text"
          name="mother_initial"
          placeholder="Inicial del apellido materno (opcional)"
          value={form.mother_initial}
          onChange={handleChange}
          maxLength={1}
        />
        <input
          type="text"
          name="section"
          placeholder="Sección del INE"
          value={form.section}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cp"
          placeholder="Código postal"
          value={form.cp}
          onChange={handleChange}
          required
        />
        <select name="sex" value={form.sex} onChange={handleChange}>
          <option value="H">Hombre</option>
          <option value="M">Mujer</option>
          <option value="X">Indefinido</option>
        </select>

        <label>¿Quieres que siga el presidente municipal?</label>
        <select name="answer" value={form.answer} onChange={handleChange} required>
          <option value="">Selecciona una opción</option>
          <option value="Sí">Sí</option>
          <option value="No">No</option>
        </select>

        <button type="submit">Enviar encuesta</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
