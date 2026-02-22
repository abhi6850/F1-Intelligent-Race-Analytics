import { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function UndercutAnalyzer() {

  const DRIVERS = [
    { code: "VER", name: "Max Verstappen", team: "Red Bull Racing" },
    { code: "PER", name: "Sergio Perez", team: "Red Bull Racing" },
    { code: "HAM", name: "Lewis Hamilton", team: "Mercedes" },
    { code: "RUS", name: "George Russell", team: "Mercedes" },
    { code: "LEC", name: "Charles Leclerc", team: "Ferrari" },
    { code: "SAI", name: "Carlos Sainz", team: "Ferrari" },
    { code: "NOR", name: "Lando Norris", team: "McLaren" },
    { code: "PIA", name: "Oscar Piastri", team: "McLaren" },
    { code: "ALO", name: "Fernando Alonso", team: "Aston Martin" },
    { code: "STR", name: "Lance Stroll", team: "Aston Martin" },
    { code: "OCO", name: "Esteban Ocon", team: "Alpine" },
    { code: "GAS", name: "Pierre Gasly", team: "Alpine" },
    { code: "BOT", name: "Valtteri Bottas", team: "Alfa Romeo" },
    { code: "ZHO", name: "Zhou Guanyu", team: "Alfa Romeo" },
    { code: "MAG", name: "Kevin Magnussen", team: "Haas" },
    { code: "HUL", name: "Nico Hulkenberg", team: "Haas" },
    { code: "TSU", name: "Yuki Tsunoda", team: "AlphaTauri" },
    { code: "DEV", name: "Nyck de Vries", team: "AlphaTauri" },
    { code: "ALB", name: "Alexander Albon", team: "Williams" },
    { code: "SAR", name: "Logan Sargeant", team: "Williams" },
  ];

  const TRACKS = [
    "Bahrain Grand Prix",
    "Saudi Arabian Grand Prix",
    "Australian Grand Prix",
    "Azerbaijan Grand Prix",
    "Miami Grand Prix",
    "Monaco Grand Prix",
    "Spanish Grand Prix",
    "Canadian Grand Prix",
    "Austrian Grand Prix",
    "British Grand Prix",
    "Hungarian Grand Prix",
    "Belgian Grand Prix",
    "Dutch Grand Prix",
    "Italian Grand Prix",
    "Singapore Grand Prix",
    "Japanese Grand Prix",
    "Qatar Grand Prix",
    "United States Grand Prix",
    "Mexico City Grand Prix",
    "São Paulo Grand Prix",
    "Las Vegas Grand Prix",
    "Abu Dhabi Grand Prix"
  ];

  const COMPOUNDS = [
    { label: "Soft", value: 0 },
    { label: "Medium", value: 1 },
    { label: "Hard", value: 2 },
  ];

  const [track, setTrack] = useState("");
  const [driverA, setDriverA] = useState("");
  const [driverB, setDriverB] = useState("");
  const [baseLap, setBaseLap] = useState(20);
  const [delta, setDelta] = useState(2);
  const [compoundA, setCompoundA] = useState(1);
  const [compoundB, setCompoundB] = useState(1);
  const [result, setResult] = useState(null);

  const analyzeUndercut = async () => {

    if (!track || !driverA || !driverB) {
      alert("Please select track and both drivers.");
      return;
    }

    if (driverA === driverB) {
      alert("Drivers must be different!");
      return;
    }

    const driverAObj = DRIVERS.find(d => d.code === driverA);
    const driverBObj = DRIVERS.find(d => d.code === driverB);

    const payload = {
      track_name: track,
      driver_a: driverAObj.code,   // FULL NAME (important for encoder)
      team_a: driverAObj.team,
      driver_b: driverBObj.code,
      team_b: driverBObj.team,
      base_pit_lap: baseLap,
      undercut_delta: delta,
      compound_a: compoundA,
      compound_b: compoundB,
    };

    try {
      const response = await fetch(`${API_BASE}/analysis/undercut`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        alert("Error from backend. Check console.");
        return;
      }

      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error("Request failed:", error);
      alert("Network error.");
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Undercut Analyzer</h2>
      <p className="module-description">
        Simulates whether pitting earlier than a rival can help gain track position.
      </p>

      {/* Track */}
      <div>
        <label>Track:</label>
        <select value={track} onChange={(e) => setTrack(e.target.value)}>
          <option value="">Select Track</option>
          {TRACKS.map((t, i) => (
            <option key={i} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Driver A */}
      <div style={{ marginTop: "15px" }}>
        <label>Driver A (Undercut Attempt):</label>
        <select value={driverA} onChange={(e) => setDriverA(e.target.value)}>
          <option value="">Select Driver A</option>
          {DRIVERS.map((d) => (
            <option key={d.code} value={d.code}>
              {d.name} ({d.team})
            </option>
          ))}
        </select>
      </div>

      {/* Driver B */}
      <div style={{ marginTop: "15px" }}>
        <label>Driver B (Target):</label>
        <select value={driverB} onChange={(e) => setDriverB(e.target.value)}>
          <option value="">Select Driver B</option>
          {DRIVERS.map((d) => (
            <option key={d.code} value={d.code}>
              {d.name} ({d.team})
            </option>
          ))}
        </select>
      </div>

      {/* Compounds */}
      <div style={{ marginTop: "15px" }}>
        <label>Compound A:</label>
        <select value={compoundA} onChange={(e) => setCompoundA(Number(e.target.value))}>
          {COMPOUNDS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: "15px" }}>
        <label>Compound B:</label>
        <select value={compoundB} onChange={(e) => setCompoundB(Number(e.target.value))}>
          {COMPOUNDS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Pit Inputs */}
      <div style={{ marginTop: "15px" }}>
        <label>Base Pit Lap:</label>
        <input
          type="number"
          value={baseLap}
          onChange={(e) => setBaseLap(Number(e.target.value))}
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <label>Undercut Delta:</label>
        <input
          type="number"
          value={delta}
          onChange={(e) => setDelta(Number(e.target.value))}
        />
      </div>

      <button onClick={analyzeUndercut} style={{ marginTop: "20px" }}>
        Analyze Undercut
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Result</h3>
          <p>Driver A Pit: {result.driver_a_pit}</p>
          <p>Driver B Pit: {result.driver_b_pit}</p>
          <p>
            Undercut Gain:{" "}
            <b style={{ color: result.undercut_gain_seconds > 0 ? "green" : "red" }}>
              {result.undercut_gain_seconds} sec
            </b>
          </p>
        </div>
      )}
    </div>
  );
}
