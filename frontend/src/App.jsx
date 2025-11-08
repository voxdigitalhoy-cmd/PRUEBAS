import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./index.css";
import logo from "../public/logo.png";
import ineExample from "../public/ine_example.png";

const socket = io("http://localhost:10000"); // Cambiar al URL de tu servidor en Render

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

  const [results, setResults] = useState({ Si: 0, No: 0, total: 0 });

  useEffect(() => {
    socket.on("updateResults", (data) => setResults(data));
    return () => socket.off("updateResults");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.answer) return;

    await fetch("/api/encuestas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ine: formData.ocr,
        first_initial: formData.first_initial,
        last_initial: formData.last_initial,
        mother_initial: formData.mother_initial,
        section: formData.section,
        cp: formData.cp,
        context: "Municipio",
        question: "¿Quieres que siga como presidente municipal, Luis Ernesto Munguia Gonzales?",
        answer: formData.answer
      })
    });

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

  const percentage = (vote) =>
    results.total === 0 ? 0 : ((results[vote] / results.total) * 100).toFixed(1);

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
