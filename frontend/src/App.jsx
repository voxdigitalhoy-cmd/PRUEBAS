import React, { useState } from "react";
import "./index.css";
import logo from "../public/logo.png";

export default function App() {
  const [formData, setFormData] = useState({
    cp: "",
    ineNumber: "",
    first_initial: "",
    last_initial: "",
    mother_initial: "",
    section: "",
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
    // Aquí va la llamada a la API o lógica para enviar los datos
  };

  return (
    <div className="container">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="main-title">
          <span className="first-letter">E</span>NCUESTAS
        </h1>
        <h2 className="sub-title">VOX DIGITAL HOY</h2>
        <p className="small-text">La Voz de la Información en Línea</p>
      </div>

      <form onSubmit={handleSubmit}>
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

        <label>
          Número de INE (OCR):
          <input
            type="text"
            name="ineNumber"
            maxLength="13"
            value={formData.ineNumber}
            onChange={handleChange}
            required
          />
        </label>

        <div className="initials-row">
          <label>
            Inicial Primer nombre:
            <input
              type="text"
              name="first_initial"
              maxLength="1"
              value={formData.first_initial}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Inicial apellido Paterno:
            <input
              type="text"
              name="last_initial"
              maxLength="1"
              value={formData.last_initial}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Inicial apellido Materno:
            <input
              type="text"
              name="mother_initial"
              maxLength="1"
              value={formData.mother_initial}
              onChange={handleChange}
              required
            />
          </label>
        </div>

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
          Sexo:
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
            <option value="I">Indefinido</option>
          </select>
        </label>

        <div className="question">
          <p>
            ¿Quieres que siga de presidente municipal, Luis Ernesto Munguia
            Gonzales?
          </p>
          <label>
            <input
              type="radio"
              name="answer"
              value="Si"
              checked={formData.answer === "Si"}
              onChange={handleChange}
              required
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="answer"
              value="No"
              checked={formData.answer === "No"}
              onChange={handleChange}
            />
            No
          </label>
        </div>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

