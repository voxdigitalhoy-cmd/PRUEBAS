import React, { useState } from "react";
import "./index.css";

export default function App() {
  const [formData, setFormData] = useState({
    cp: "",
    section: "",
    ocr: "",
    firstInitial: "",
    lastInitial: "",
    motherInitial: "",
    sex: "",
    answer: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    // Aquí puedes agregar la llamada a tu backend
  };

  return (
    <div className="container">
      {/* Logo y nombre */}
      <div className="header">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1>ENCUESTAS</h1>
        <h2>VOX DIGITAL HOY</h2>
        <small>La Voz de la Información en Línea</small>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Código Postal */}
        <div className="field-row">
          <label>Código Postal:</label>
          <input
            type="text"
            name="cp"
            maxLength={8}
            value={formData.cp}
            onChange={handleChange}
            required
          />
        </div>

        {/* Sección INE */}
        <div className="field-row">
          <label>Sección INE:</label>
          <input
            type="text"
            name="section"
            maxLength={6}
            value={formData.section}
            onChange={(e) => setFormData({...formData, section: e.target.value.toUpperCase()})}
            required
          />
        </div>

        {/* Número OCR */}
        <div className="field-row">
          <label>Número INE (OCR):</label>
          <input
            type="text"
            name="ocr"
            maxLength={13}
            value={formData.ocr}
            onChange={(e) => setFormData({...formData, ocr: e.target.value.toUpperCase()})}
            required
          />
        </div>

        {/* Imagen ejemplo INE */}
        <div className="ine-image">
          <a href="/ine_example.png" target="_blank" rel="noopener noreferrer">
            <img src="/ine_example.png" alt="Ejemplo INE" />
          </a>
        </div>

        {/* Iniciales */}
        <div className="field-row">
          <label>Inicial Primer Nombre:</label>
          <input
            type="text"
            name="firstInitial"
            maxLength={1}
            value={formData.firstInitial}
            onChange={(e) => setFormData({...formData, firstInitial: e.target.value.toUpperCase()})}
            required
          />
        </div>
        <div className="field-row">
          <label>Inicial Apellido Paterno:</label>
          <input
            type="text"
            name="lastInitial"
            maxLength={1}
            value={formData.lastInitial}
            onChange={(e) => setFormData({...formData, lastInitial: e.target.value.toUpperCase()})}
            required
          />
        </div>
        <div className="field-row">
          <label>Inicial Apellido Materno:</label>
          <input
            type="text"
            name="motherInitial"
            maxLength={1}
            value={formData.motherInitial}
            onChange={(e) => setFormData({...formData, motherInitial: e.target.value.toUpperCase()})}
            required
          />
        </div>

        {/* Sexo */}
        <div className="field-row">
          <label>Sexo:</label>
          <select name="sex" value={formData.sex} onChange={handleChange} required>
            <option value="">Selecciona</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        {/* Pregunta principal */}
        <div className="question">
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
          <label>
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
      </form>
    </div>
  );
}

