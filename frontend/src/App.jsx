import React, { useState } from "react";
import "./index.css";

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
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/encuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cp: formData.postal,
          ine: formData.ineNumber,
          first_initial: formData.first_initial,
          last_initial: formData.last_initial,
          mother_initial: formData.mother_initial,
          section: formData.section,
          sex: formData.sex,
          answer: formData.answer
        }),
      });
      const data = await res.json();
      if (data.status === "ok") {
        setMessage("Encuesta guardada correctamente");
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
      } else {
        setMessage("Error al guardar encuesta");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al guardar encuesta");
    }
  };

  return (
    <div className="container">
      <header>
        <img src="/logo.png" alt="Logo" className="logo"/>
        <h1>ENCUESTAS VOX DIGITAL HOY</h1>
        <p className="subtitle">La Voz de la Información en Línea</p>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Código Postal:</label>
          <input
            type="text"
            name="postal"
            maxLength={10}
            value={formData.postal}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Número de INE (OCR):</label>
          <input
            type="text"
            name="ineNumber"
            maxLength={13}
            value={formData.ineNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group initials">
          <label>Iniciales:</label>
          <input type="text" name="first_initial" maxLength={1} value={formData.first_initial} onChange={handleChange} placeholder="F" required/>
          <input type="text" name="last_initial" maxLength={1} value={formData.last_initial} onChange={handleChange} placeholder="L" required/>
          <input type="text" name="mother_initial" maxLength={1} value={formData.mother_initial} onChange={handleChange} placeholder="M" required/>
        </div>

        <div className="form-group">
          <label>Sección INE:</label>
          <input type="text" name="section" maxLength={6} value={formData.section} onChange={handleChange} required/>
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
          <label>¿Quieres que siga de presidente municipal, Luis Ernesto Munguia Gonzales?</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="answer" value="Sí" checked={formData.answer === "Sí"} onChange={handleChange} required/>
              Sí
            </label>
            <label>
              <input type="radio" name="answer" value="No" checked={formData.answer === "No"} onChange={handleChange}/>
              No
            </label>
          </div>
        </div>

        <button type="submit">Enviar</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

