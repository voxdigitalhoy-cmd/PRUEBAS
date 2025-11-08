import React, { useState } from "react";
import "./index.css";

export default function App() {
  const [formData, setFormData] = useState({
    cp: "",
    ine: "",
    first_initial: "",
    last_initial: "",
    mother_initial: "",
    section: "",
    sex: "",
    answer: "",
  });

  const [showINEExample, setShowINEExample] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    alert("Encuesta enviada");
    setFormData({
      cp: "",
      ine: "",
      first_initial: "",
      last_initial: "",
      mother_initial: "",
      section: "",
      sex: "",
      answer: "",
    });
  };

  return (
    <div className="container">
      <div className="header">
        <img src="/logo.png" alt="Logo" />
        <h1>ENCUESTAS</h1>
        <h2>VOX DIGITAL HOY</h2>
        <p className="subtitle">La Voz de la Información en Línea</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Código Postal:</label>
          <input
            type="text"
            name="cp"
            maxLength={10}
            value={formData.cp}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Número de INE (OCR):</label>
          <input
            type="text"
            name="ine"
            maxLength={13}
            value={formData.ine}
            onChange={handleChange}
            required
          />
        </div>

        <div className="initials">
          <div>
            <label>Inicial Primer Nombre:</label>
            <input
              type="text"
              name="first_initial"
              maxLength={1}
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
              maxLength={1}
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
              maxLength={1}
              value={formData.mother_initial}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="field">
          <label>Sección INE:</label>
          <input
            type="text"
            name="section"
            maxLength={6}
            value={formData.section}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
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

        <div className="field">
          <p>¿Quieres que siga de presidente municipal, Luis Ernesto Munguia Gonzales?</p>
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
          <label>
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

        <div className="field">
          <button type="button" onClick={() => setShowINEExample(!showINEExample)}>
            Ver ejemplo de INE
          </button>
          {showINEExample && (
            <img
              src="/ine_example.png"
              alt="Ejemplo INE"
              className="ine-example"
            />
          )}
        </div>

        <button type="submit">Enviar Encuesta</button>
      </form>
    </div>
  );
}

