import React, { useState } from "react";
import "./index.css";
import logo from "../public/logo.png";
import ineExample from "../public/ine_example.png";

export default function App() {
  const [formData, setFormData] = useState({
    postal: "",
    ineNumber: "",
    first_initial: "",
    last_initial: "",
    mother_initial: "",
    section: "",
    sex: "",
    answer: ""
  });

  const [results, setResults] = useState({
    totalVotes: 0,
    yes: 0,
    no: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulación de backend
    const newResults = { ...results };
    newResults.totalVotes += 1;
    if (formData.answer === "Si") newResults.yes += 1;
    if (formData.answer === "No") newResults.no += 1;
    setResults(newResults);

    setFormData({
      postal: "",
      ineNumber: "",
      first_initial: "",
      last_initial: "",
      mother_initial: "",
      section: "",
      sex: "",
      answer: ""
    });
  };

  const yesPercent = results.totalVotes ? Math.round((results.yes / results.totalVotes) * 100) : 0;
  const noPercent = results.totalVotes ? Math.round((results.no / results.totalVotes) * 100) : 0;

  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h1>ENCUESTAS</h1>
        <h2>VOX DIGITAL HOY</h2>
        <small>La Voz de la Información en Línea</small>
      </header>

      <form onSubmit={handleSubmit} className="survey-form">
        <div className="field-row">
          <label>Código Postal:</label>
          <input type="text" name="postal" maxLength="8" value={formData.postal} onChange={handleChange} required />
        </div>

        <div className="field-row">
          <label>Sección INE:</label>
          <input type="text" name="section" maxLength="6" value={formData.section} onChange={handleChange} required />
        </div>

        <div className="field-row">
          <label>Número INE (OCR):</label>
          <input type="text" name="ineNumber" maxLength="13" value={formData.ineNumber} onChange={handleChange} required />
        </div>

        <div className="field-row">
          <label>Inicial Primer Nombre:</label>
          <input type="text" name="first_initial" maxLength="1" value={formData.first_initial} onChange={handleChange} required />
        </div>

        <div className="field-row">
          <label>Inicial Apellido Paterno:</label>
          <input type="text" name="last_initial" maxLength="1" value={formData.last_initial} onChange={handleChange} required />
        </div>

        <div className="field-row">
          <label>Inicial Apellido Materno:</label>
          <input type="text" name="mother_initial" maxLength="1" value={formData.mother_initial} onChange={handleChange} required />
        </div>

        <div className="field-row">
          <label>Sexo:</label>
          <select name="sex" value={formData.sex} onChange={handleChange} required>
            <option value="">Selecciona</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        <div className="ine-image">
          <img src={ineExample} alt="Ejemplo INE" title="Click para ver el número OCR" onClick={() => window.open(ineExample, "_blank")} />
        </div>

        <div className="question">
          <p>¿Quieres que siga de presidente municipal, Luis Ernesto Munguia Gonzales?</p>
          <label>
            <input type="radio" name="answer" value="Si" checked={formData.answer === "Si"} onChange={handleChange} required /> Sí
          </label>
          <label>
            <input type="radio" name="answer" value="No" checked={formData.answer === "No"} onChange={handleChange} /> No
          </label>
        </div>

        <button type="submit">Enviar Encuesta</button>
      </form>

      {results.totalVotes > 0 && (
        <div className="results">
          <h3>Resultados</h3>
          <p>Total de votos: {results.totalVotes}</p>

          <div className="bar-container">
            <div className="bar yes" style={{ width: `${yesPercent}%` }}>{yesPercent}% ({results.yes})</div>
          </div>

          <div className="bar-container">
            <div className="bar no" style={{ width: `${noPercent}%` }}>{noPercent}% ({results.no})</div>
          </div>
        </div>
      )}
    </div>
  );
}
