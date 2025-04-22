import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import emailjs from "emailjs-com";
import "./App.css";

function App() {
  const [ime, setIme] = useState("");
  const [telefon, setTelefon] = useState("");
  const [usluga, setUsluga] = useState("");
  const [datum, setDatum] = useState(new Date());
  const [poruka, setPoruka] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      ime,
      telefon,
      usluga,
      datum: datum.toLocaleDateString(),
    };

    emailjs
      .send(
        "service_66vgt44", // Tvoj Service ID
        "template_noktici", // Tvoj Template ID
        templateParams,
        "0S6ChmWNeV3rWYHhc" // Tvoj Public Key
      )
      .then(
        () => {
          setPoruka("Termin je uspješno poslan!");
        },
        (error) => {
          setPoruka("Greška pri slanju: " + error.text);
        }
      );
  };

  return (
    <div className="container">
      <h1>Naruči se u salonu "Noktići"</h1>
      <form onSubmit={handleSubmit}>
        <label>Ime i prezime</label>
        <input value={ime} onChange={(e) => setIme(e.target.value)} required />

        <label>Broj telefona</label>
        <input value={telefon} onChange={(e) => setTelefon(e.target.value)} required />

        <label>Usluga</label>
<select value={usluga} onChange={(e) => setUsluga(e.target.value)} required>
  <option value="">Odaberi uslugu</option>
  <option value="Gel nokti">Gel nokti</option>
  <option value="Nadogradnja">Nadogradnja</option>
  <option value="Manikura">Manikura</option>
  <option value="Skidanje gela">Skidanje gela</option>
</select>


        <label>Datum</label>
        <Calendar value={datum} onChange={setDatum} />

        <button type="submit">Pošalji</button>
      </form>

      {poruka && <p>{poruka}</p>}
    </div>
  );
}

export default App;
