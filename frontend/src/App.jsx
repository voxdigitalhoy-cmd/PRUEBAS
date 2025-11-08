import React, { useState } from "react";
import "./index.css";

export default function App() {
  const [formData, setFormData] = useState({
    first_initial: "",
    last_initial: "",
    mother_initial: "",
    section: "",
    cp: "",
    answer: "",
  });
  const [showINE, setShowINE] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    alert("Formulario enviado!"); // temporal
  };

  return (
    <div className="app-container">
      {/* Encabezado con logo y título */}
      <header className="app-header">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1>ENCUESTAS VOX DIGITAL HOY</h1>
        <p className="subtitle">La Voz de la Información en Línea</p>
      </header>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="survey-form">
        <div className="field-group">
          <label>Código Postal:</label>
          <input
            type="text"
            name="cp"
            maxLength="10"
            value={formData.cp}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-group">
          <label>Número de INE (OCR):</label>
          <input
            type="text"
            name="ine_number"
            maxLength="13"
            value={formData.ine_number}
            onChange={handleChange}
          />
        </div>

        <div className="initials-group">
          <div>
            <label>Inicial Primer Nombre:</label>
            <input
              type="text"
              name="first_initial"
              maxLength="1"
              value={formData.first_initial}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Inicial Apellido Paterno:</label>
            <input
              type="text"
              name="last_initial"
              maxLength="1"
              value={formData.last_initial}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Inicial Apellido Materno:</label>
            <input
              type="text"
              name="mother_initial"
              maxLength="1"
              value={formData.mother_initial}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="field-group">
          <label>Sección INE:</label>
          <input
            type="text"
            name="section"
            maxLength="6"
            value={formData.section}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-group">
          <label>Sexo:</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        <div className="field-group">
          <label>¿Quieres que siga como presidente municipal, Luis Ernesto Munguia Gonzales?</label>
          <div>
            <label>
              <input
                type="radio"
                name="answer"
                value="Si"
                checked={formData.answer === "Si"}
                onChange={handleChange}
                required
              />{" "}
              Sí
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                name="answer"
                value="No"
                checked={formData.answer === "No"}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>
        </div>

        <button type="button" onClick={() => setShowINE(!showINE)}>
          Ver ejemplo INE
        </button>

        {showINE && (
          <div className="ine-example">
            <img
              src="/ine_example.png"
              alt="Ejemplo INE"
            />
          </div>
        )}

        <button type="submit">Enviar Encuesta</button>
      </form>
    </div>
  );
}
