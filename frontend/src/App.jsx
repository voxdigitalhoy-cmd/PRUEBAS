import React, { useState } from "react";
import "./index.css";

export default function App() {
  const [formData, setFormData] = useState({
    first_initial: "",
    last_initial: "",
    mother_initial: "",
    section: "",
    cp: "",
    answer: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/encuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status === "ok") {
        alert("Encuesta guardada correctamente");
        setFormData({
          first_initial: "",
          last_initial: "",
          mother_initial: "",
          section: "",
          cp: "",
          answer: ""
        });
      } else {
        alert("Error al guardar encuesta");
      }
    } catch (err) {
      console.error(err);
      alert("Error al guardar encuesta");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <img src="/logo.png" alt="Logo" className="logo" />
        <h2>Encuesta Presidente Municipal</h2>

        <div className="initials">
          <input
            type="text"
            name="first_initial"
            maxLength="1"
            placeholder="F"
            value={formData.first_initial}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_initial"
            maxLength="1"
            placeholder="L"
            value={formData.last_initial}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="mother_initial"
            maxLength="1"
            placeholder="M"
            value={formData.mother_initial}
            onChange={handleChange}
            required
          />
        </div>

        <div className="fields">
          <label>
            Sección INE:
            <input
              type="text"
              name="section"
              maxLength="6"
              value={formData.section}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Código Postal:
            <input
              type="text"
              name="cp"
              maxLength="10"
              value={formData.cp}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="question">
          <p>¿Quieres que siga de presidente municipal, Luis Ernesto Munguia Gonzales?</p>
          <label>
            <input
              type="radio"
              name="answer"
              value="Si"
              checked={formData.answer === "Si"}
              onChange={handleChange}
              required
            /> Si
          </label>
          <label style={{ marginLeft: "1rem" }}>
            <input
              type="radio"
              name="answer"
              value="No"
              checked={formData.answer === "No"}
              onChange={handleChange}
            /> No
          </label>
        </div>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

