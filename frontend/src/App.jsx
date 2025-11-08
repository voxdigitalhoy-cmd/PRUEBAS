import React, { useState } from "react";
import "./index.css";
import logo from "../public/logo.png";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    // Aquí puedes agregar la llamada a tu API backend
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" />
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
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

