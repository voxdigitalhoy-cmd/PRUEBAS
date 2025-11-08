import React, { useState } from "react";
import "./index.css";
import logo from "../public/logo.png";

export default function App() {
  const [formData, setFormData] = useState({
    cp: "",
    ine_number: "",
    first_initial: "",
    last_initial: "",
    mother_initial: "",
    section: "",
    sex: "",
    answer: ""
  });
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="logo" />
        <h1>ENCUESTAS VOX DIGITAL HOY</h1>
        <p className="subtitle">La Voz de la Información en Línea</p>

        <div className="form-group">
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

        <div className="form-group">
          <label>Número de INE (OCR):</label>
          <input
            type="text"
            name="ine_number"
            maxLength={13}
            value={formData.ine_number}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="help-btn"
            onClick={() => setShowModal(true)}
          >
            ?
          </button>
        </div>

        <div className="form-group">
          <label>Inicial Primer Nombre:</label>
          <input
            type="text"
            name="first_initial"
            maxLength={1}
            value={formData.first_initial}
            onChange={handleChange}
            required
          />

          <label>Inicial Apellido Paterno:</label>
          <input
            type="text"
            name="last_initial"
            maxLength={1}
            value={formData.last_initial}
            onChange={handleChange}
            required
          />

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

        <div className="form-group">
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

        <div className="form-group">
          <label>Sexo:</label>
          <select name="sex" value={formData.sex} onChange={handleChange} required>
            <option value="">Selecciona</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        <div className="form-group">
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

        <button type="submit">Enviar</button>
      </form>

      {/* Modal para mostrar imagen */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Ejemplo OCR en INE</h2>
            <img src="/ine_example.png" alt="Ejemplo INE OCR" className="modal-image" />
            <button onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
