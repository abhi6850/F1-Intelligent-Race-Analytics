import { useState } from "react";
import { API_BASE } from "../api/backend";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, ReferenceLine
} from "recharts";

const DRIVERS = [
  { code: "VER", name: "Max Verstappen",    team: "Red Bull Racing" },
  { code: "PER", name: "Sergio Perez",      team: "Red Bull Racing" },
  { code: "HAM", name: "Lewis Hamilton",    team: "Mercedes" },
  { code: "RUS", name: "George Russell",    team: "Mercedes" },
  { code: "LEC", name: "Charles Leclerc",   team: "Ferrari" },
  { code: "SAI", name: "Carlos Sainz",      team: "Ferrari" },
  { code: "NOR", name: "Lando Norris",      team: "McLaren" },
  { code: "PIA", name: "Oscar Piastri",     team: "McLaren" },
  { code: "ALO", name: "Fernando Alonso",   team: "Aston Martin" },
  { code: "STR", name: "Lance Stroll",      team: "Aston Martin" },
  { code: "OCO", name: "Esteban Ocon",      team: "Alpine" },
  { code: "GAS", name: "Pierre Gasly",      team: "Alpine" },
  { code: "BOT", name: "Valtteri Bottas",   team: "Alfa Romeo" },
  { code: "ZHO", name: "Zhou Guanyu",       team: "Alfa Romeo" },
  { code: "MAG", name: "Kevin Magnussen",   team: "Haas" },
  { code: "HUL", name: "Nico Hulkenberg",   team: "Haas" },
  { code: "TSU", name: "Yuki Tsunoda",      team: "AlphaTauri" },
  { code: "DEV", name: "Nyck de Vries",     team: "AlphaTauri" },
  { code: "ALB", name: "Alexander Albon",   team: "Williams" },
  { code: "SAR", name: "Logan Sargeant",    team: "Williams" },
];

const TRACKS = [
  "Bahrain Grand Prix","Saudi Arabian Grand Prix","Australian Grand Prix",
  "Azerbaijan Grand Prix","Miami Grand Prix","Monaco Grand Prix",
  "Spanish Grand Prix","Canadian Grand Prix","Austrian Grand Prix",
  "British Grand Prix","Hungarian Grand Prix","Belgian Grand Prix",
  "Dutch Grand Prix","Italian Grand Prix","Singapore Grand Prix",
  "Japanese Grand Prix","Qatar Grand Prix","United States Grand Prix",
  "Mexico City Grand Prix","São Paulo Grand Prix","Las Vegas Grand Prix",
  "Abu Dhabi Grand Prix",
];

const COMPOUNDS = [
  { label: "Soft",   value: 0 },
  { label: "Medium", value: 1 },
  { label: "Hard",   value: 2 },
];

const COMPOUND_COLORS = { 0: "#e10600", 1: "#f5a623", 2: "#d4d4d4" };
const COMPOUND_NAMES  = { 0: "Soft", 1: "Medium", 2: "Hard" };

const sel = {
  width: "100%",
  background: "#0e1420",
  color: "#f0f2f5",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 6,
  padding: "9px 32px 9px 12px",
  fontSize: 14,
  fontFamily: "'Titillium Web', sans-serif",
  outline: "none",
  appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a8499' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
};

const inputNum = {
  width: "100%",
  background: "#0e1420",
  color: "#f0f2f5",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 6,
  padding: "9px 12px",
  fontSize: 14,
  fontFamily: "'Titillium Web', sans-serif",
  outline: "none",
};

export default function UndercutAnalyzer() {
  const [track, setTrack]         = useState("");
  const [driverA, setDriverA]     = useState("");
  const [driverB, setDriverB]     = useState("");
  const [compoundA, setCompoundA] = useState(1);
  const [compoundB, setCompoundB] = useState(1);
  const [baseLap, setBaseLap]     = useState(20);
  const [delta, setDelta]         = useState(2);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const driverAObj = DRIVERS.find(d => d.code === driverA);
  const driverBObj = DRIVERS.find(d => d.code === driverB);

  const analyze = async () => {
    if (!track || !driverA || !driverB) { setError("Select track and both drivers."); return; }
    if (driverA === driverB)             { setError("Drivers must be different."); return; }
    setError(null); setLoading(true); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/analysis/undercut`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          track_name: track,
          driver_a: driverAObj.code,
          team_a: driverAObj.team,
          driver_b: driverBObj.code,
          team_b: driverBObj.team,
          base_pit_lap: baseLap,
          undercut_delta: delta,
          compound_a: compoundA,
          compound_b: compoundB,
        }),
      });
      if (!res.ok) throw new Error("Backend error");
      setResult(await res.json());
    } catch (e) {
      setError("Request failed — is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const gained = result && result.undercut_gain_seconds > 0;

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 6 }}>Undercut Analyzer</h2>
      <p style={{ color: "#7a8499", fontSize: 14, marginBottom: 28 }}>
        Simulates whether pitting earlier than a rival gains track position — modelled using
        real 2023 pit loss times and tyre delta predictions.
      </p>

      {/* ── inputs grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 24 }}>
        <div>
          <label>Track</label>
          <select value={track} onChange={e => setTrack(e.target.value)} style={sel}>
            <option value="">Select track</option>
            {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label>Driver A — undercut attempt</label>
          <select value={driverA} onChange={e => setDriverA(e.target.value)} style={sel}>
            <option value="">Select driver</option>
            {DRIVERS.map(d => <option key={d.code} value={d.code}>{d.code} – {d.name}</option>)}
          </select>
        </div>
        <div>
          <label>Driver A compound</label>
          <select value={compoundA} onChange={e => setCompoundA(Number(e.target.value))} style={sel}>
            {COMPOUNDS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label>Driver B — target</label>
          <select value={driverB} onChange={e => setDriverB(e.target.value)} style={sel}>
            <option value="">Select driver</option>
            {DRIVERS.map(d => <option key={d.code} value={d.code}>{d.code} – {d.name}</option>)}
          </select>
        </div>
        <div>
          <label>Driver B compound</label>
          <select value={compoundB} onChange={e => setCompoundB(Number(e.target.value))} style={sel}>
            {COMPOUNDS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label>Base pit lap (Driver B pits here)</label>
          <input type="number" min={5} max={70} value={baseLap}
            onChange={e => setBaseLap(Number(e.target.value))} style={inputNum} />
        </div>
        <div>
          <label>Undercut delta (laps early Driver A pits)</label>
          <input type="number" min={1} max={10} value={delta}
            onChange={e => setDelta(Number(e.target.value))} style={inputNum} />
        </div>
      </div>

      <button onClick={analyze} disabled={loading} style={{ marginBottom: 28 }}>
        {loading ? <><span className="spinner" style={{ width:16, height:16 }} /> Analysing…</> : "Analyse Undercut"}
      </button>

      {error && <div className="error-box">{error}</div>}

      {result && (
        <div className="animate-in">

          {/* ── verdict banner ── */}
          <div style={{
            background: gained ? "rgba(34,197,94,0.08)" : "rgba(225,6,0,0.08)",
            border: `1px solid ${gained ? "rgba(34,197,94,0.25)" : "rgba(225,6,0,0.25)"}`,
            borderRadius: 10, padding: "16px 20px", marginBottom: 20,
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <span style={{ fontSize: 28 }}>{gained ? "✅" : "❌"}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: gained ? "#4ade80" : "#ff6b6b" }}>
                {gained ? "Undercut works!" : "Undercut fails"}
              </div>
              <div style={{ fontSize: 13, color: "#7a8499", marginTop: 2 }}>
                {driverA} pits on lap {result.driver_a_pit} (vs {driverB} on lap {result.driver_b_pit}) →{" "}
                <strong style={{ color: gained ? "#4ade80" : "#ff6b6b" }}>
                  {gained ? "+" : ""}{result.undercut_gain_seconds?.toFixed(3)}s
                </strong>{" "}gap change
              </div>
            </div>
          </div>

          {/* ── stats row ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
            {[
              ["Driver A pits", `Lap ${result.driver_a_pit}`, COMPOUND_COLORS[compoundA]],
              ["Driver B pits", `Lap ${result.driver_b_pit}`, COMPOUND_COLORS[compoundB]],
              ["Gain", `${result.undercut_gain_seconds?.toFixed(3)}s`, gained ? "#4ade80" : "#ff6b6b"],
              ["Verdict", gained ? "Undercut" : "Stay out", gained ? "#4ade80" : "#ff6b6b"],
            ].map(([lbl, val, color]) => (
              <div key={lbl} style={{ background: "#141c2b", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{lbl}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color }}>{val}</div>
              </div>
            ))}
          </div>

          {/* ── compound chips ── */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <span className={`compound-pill compound-${COMPOUND_NAMES[compoundA].toLowerCase()}`}>
              {driverA} on {COMPOUND_NAMES[compoundA]}
            </span>
            <span className={`compound-pill compound-${COMPOUND_NAMES[compoundB].toLowerCase()}`}>
              {driverB} on {COMPOUND_NAMES[compoundB]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
