import React, { useState } from "react";
import "./index.css";
import logo from "../public/logo.png";
import ineExample from "../public/ine_example.png";

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
    setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    alert("Encuesta enviada!");
    setFormData({
      first_initial: "",
      last_initial: "",
      mother_initial: "",
      section: "",
      cp: "",
      answer: "",
    });
  };

  return (
    <div className="container">
      <header>
        <img src={logo} alt="Logo" className="logo" />
        <h1>ENCUESTAS</h1>
        <h2>VOX DIGITAL HOY</h2>
        <p className="subtitulo">La Voz de la Información en Línea</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Código Postal:</label>
          <input
            type="text"
            name="cp"
            value={formData.cp}
            onChange={handleChange}
            maxLength={10}
            required
          />
        </div>

        <div className="field">
          <label>Número de INE (OCR):</label>
          <input
            type="text"
            name="ocr"
            placeholder="13 letras/números"
            maxLength={13}
          />
        </div>

        <div className="initials">
          <div>
            <label>Inicial Primer Nombre:</label>
            <input
              type="text"
              name="first_initial"
              value={formData.first_initial}
              onChange={handleChange}
              maxLength={1}
              required
            />
          </div>
          <div>
            <label>Inicial Apellido Paterno:</label>
            <input
              type="text"
              name="last_initial"
              value={formData.last_initial}
              onChange={handleChange}
              maxLength={1}
              required
            />
          </div>
          <div>
            <label>Inicial Apellido Materno:</label>
            <input
              type="text"
              name="mother_initial"
              value={formData.mother_initial}
              onChange={handleChange}
              maxLength={1}
              required
            />
          </div>
        </div>

        <div className="field">
          <label>Sección INE:</label>
          <input
            type="text"
            name="section"
            value={formData.section}
            onChange={handleChange}
            maxLength={6}
            required
          />
        </div>

        <div className="field">
          <label>Sexo:</label>
          <select
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        <div className="field">
          <p>¿Quieres que siga como presidente municipal, Luis Ernesto Munguia Gonzales?</p>
          <label>
            <input
              type="radio"
              name="answer"
              value="Sí"
              checked={formData.answer === "Sí"}
              onChange={handleChange}
              required
            /> Sí
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

        <button type="submit">Enviar Encuesta</button>

        <div className="ine-help">
          <button
            type="button"
            onClick={() => setShowINE(!showINE)}
          >
            Ver ejemplo INE (OCR)
          </button>
          {showINE && (
            <img src={ineExample} alt="Ejemplo INE" className="ine-image" />
          )}
        </div>
      </form>
    </div>
  );
}

