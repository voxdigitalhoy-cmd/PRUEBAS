import React, { useState, useEffect } from "react";
import "./index.css";
import logo from "../public/logo.png";
import ineExample from "../public/ine_example.png";

export default function App() {
  const [formData, setFormData] = useState({
    cp: "",
    section: "",
    ocr: "",
    first_initial: "",
    last_initial: "",
    mother_initial: "",
    sex: "",
    answer: ""
  });

  const [results, setResults] = useState({
    Si: 0,
    No: 0,
    total: 0
  });

  // Simulación de votos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const randomVote = Math.random() > 0.5 ? "Si" : "No";
      setResults(prev => ({
        ...prev,
        [randomVote]: prev[randomVote] + 1,
        total: prev.total + 1
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.answer) {
      setResults(prev => ({
        ...prev,
        [formData.answer]: prev[formData.answer] + 1,
        total: prev.total + 1
      }));
    }
    alert("Encuesta enviada!");
    setFormData({
      cp: "",
      section: "",
      ocr: "",
      first_initial: "",
      last_initial: "",
      mother_initial: "",
      sex: "",
      answer: ""
    });
  };

  const percentage = (vote) => {
    return results.total === 0 ? 0 : ((results[vote] / results.total) * 100).toFixed(1);
  };

  return (
    <div className="container">
      <header>
        <img src={logo} alt="Logo" className="logo"/>
        <h1>ENCUESTAS VOX DIGITAL HOY</h1>
        <p className="subtitle">La Voz de la Información en Línea</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Código Postal:</label>
          <input type="text" name="cp" maxLength={10} value={formData.cp} onChange={handleChange} required />
        </div>

        <div className="field">
          <label>Sección INE:</label>
          <input type="text" name="section" maxLength={6} value={formData.section} onChange={handleChange} required />
        </div>

        <div className="field">
          <label>Número de INE (OCR):</label>
          <input type="text" name="ocr" maxLength={13} value={formData.ocr} onChange={handleChange} required />
          <img src={ineExample} alt="Ejemplo INE" className="ine-example"/>
        </div>

        <div className="field">
          <label>Inicial Primer Nombre:</label>
          <input type="text" name="first_initial" maxLength={1} value={formData.first_initial} onChange={handleChange} required />
        </div>

        <div className="field">
          <label>Inicial Apellido Paterno:</label>
          <input type="text" name="last_initial" maxLength={1} value={formData.last_initial} onChange={handleChange} required />
        </div>

        <div className="field">
          <label>Inicial Apellido Materno:</label>
          <input type="text" name="mother_initial" maxLength={1} value={formData.mother_initial} onChange={handleChange} required />
        </div>

        <div className="field">
          <label>Sexo:</label>
          <select name="sex" value={formData.sex} onChange={handleChange} required>
            <option value="">Selecciona</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        <div className="field question">
          <p>¿Quieres que siga como presidente municipal, Luis Ernesto Munguia Gonzales?</p>
          <label>
            <input type="radio" name="answer" value="Si" checked={formData.answer === "Si"} onChange={handleChange} required /> Sí
          </label>
          <label>
            <input type="radio" name="answer" value="No" checked={formData.answer === "No"} onChange={handleChange} /> No
          </label>
        </div>

        <button type="submit">Enviar Encuesta</button>
      </form>

      <div className="results">
        <h2>Resultados en tiempo real</h2>
        <div className="bar">
          <div className="fill si" style={{width: `${percentage("Si")}%`}}>{percentage("Si")}% ({results.Si})</div>
        </div>
        <div className="bar">
          <div className="fill no" style={{width: `${percentage("No")}%`}}>{percentage("No")}% ({results.No})</div>
        </div>
        <p>Total votos: {results.total}</p>
      </div>
    </div>
  );
}
