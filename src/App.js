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
  const [vrijeme, setVrijeme] = useState("");
  const [napomena, setNapomena] = useState("");
  const [poruka, setPoruka] = useState("");
  
  // Zauzeti termini (ovo možeš kasnije zamijeniti sa stvarnim podacima iz baze)
  const zauzetiTermini = [
    { datum: new Date("2025-04-25"), vrijeme: "10:00" },
    { datum: new Date("2025-04-25"), vrijeme: "14:00" },
    { datum: new Date("2025-04-26"), vrijeme: "11:00" },
  ];

  // Radno vrijeme (ponedjeljak - petak)
  const radniDani = [1, 2, 3, 4, 5]; // Ponedjeljak = 1, Nedjelja = 0

  // Provjera zauzetosti termina
  const isTermenZauzet = (datum, vrijeme) => {
    return zauzetiTermini.some(
      (termin) =>
        termin.datum.toLocaleDateString() === datum.toLocaleDateString() &&
        termin.vrijeme === vrijeme
    );
  };

  // Provjera neradnih dana (subota i nedjelja)
  const isNeradniDan = (date) => {
    return date.getDay() === 0 || date.getDay() === 6; // Nedjelja = 0, Subota = 6
  };

  // Onemogućavanje prošlih datuma
  const minDate = new Date();

  // Funkcija koja provjerava da li je vrijeme prošlo na današnji dan
  const isPastTime = (datum, vrijeme) => {
    const currentDate = new Date();
    const selectedDate = new Date(datum);
    const [selectedHours, selectedMinutes] = vrijeme.split(":").map(Number);
    selectedDate.setHours(selectedHours, selectedMinutes, 0, 0);

    return selectedDate < currentDate;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      ime,
      telefon,
      usluga,
      datum: datum.toLocaleDateString(),
      vrijeme,
      napomena,
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

  // Onemogući termine za prošli datum (ako je na današnji dan prošlo vrijeme)
  const validTimes = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];
  
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
          <option value="Gel nokti">Gel nokti - 20 EUR</option>
          <option value="Nadogradnja">Nadogradnja - 24 EUR</option>
          <option value="Manikura">Manikura - 13 EUR</option>
          <option value="Skidanje gela">Skidanje gela - 11 EUR</option>
        </select>

        <label>Datum</label>
        <Calendar
          value={datum}
          onChange={setDatum}
          tileDisabled={({ date }) => isNeradniDan(date)} // Onemogući neradne dane (subota i nedjelja)
          tileClassName={({ date }) => isNeradniDan(date) ? 'neradni-dan' : ''} // Dodaj klasu za neradne dane
          minDate={minDate} // Onemogući prošle datume
        />

        <label>Vrijeme</label>
        <select
          value={vrijeme}
          onChange={(e) => setVrijeme(e.target.value)}
          required
        >
          <option value="">Odaberi vrijeme</option>
          {validTimes.map((vrijemeOption) => (
            <option
              key={vrijemeOption}
              value={vrijemeOption}
              disabled={isTermenZauzet(datum, vrijemeOption) || (datum.toLocaleDateString() === new Date().toLocaleDateString() && isPastTime(datum, vrijemeOption))}
            >
              {vrijemeOption} 
              {isTermenZauzet(datum, vrijemeOption) && "(Zauzeto)"}
              {datum.toLocaleDateString() === new Date().toLocaleDateString() && isPastTime(datum, vrijemeOption) && "(Prošlo)"}
            </option>
          ))}
        </select>

        <label>Napomena</label>
        <textarea
          value={napomena}
          onChange={(e) => setNapomena(e.target.value)}
          placeholder="Npr. Francuska manikura"
          className="w-full border rounded-lg p-2"
          rows={3}
        />

        <button type="submit">Pošalji</button>
      </form>

      {poruka && <p>{poruka}</p>}
    </div>
  );
}

export default App;
