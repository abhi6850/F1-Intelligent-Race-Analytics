import { useState } from "react";
import { API_BASE } from "../api/backend";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, ReferenceLine, Legend,
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

const TEAM_COLORS = {
  "Red Bull Racing": "#3b65ff", "Mercedes": "#27f4d2", "Ferrari": "#e10600",
  "McLaren": "#ff8000", "Aston Martin": "#358c75", "Alpine": "#2293d1",
  "Alfa Romeo": "#c92d4b", "Haas": "#b6babd", "AlphaTauri": "#5e8faa", "Williams": "#37bedd",
};

const sel = {
  width: "100%", background: "#0e1420", color: "#f0f2f5",
  border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6,
  padding: "9px 32px 9px 12px", fontSize: 14,
  fontFamily: "'Titillium Web', sans-serif", outline: "none", appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a8499' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
};

const CustomTooltip = ({ active, payload, label, driverACode, driverBCode }) => {
  if (!active || !payload?.length) return null;
  const gap = payload[0]?.value;
  return (
    <div style={{ background: "#141c2b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
      <div style={{ color: "#7a8499", marginBottom: 4 }}>Lap {label}</div>
      <div style={{ color: gap > 0 ? "#ff6b6b" : "#4ade80", fontWeight: 700 }}>
        {gap > 0 ? `${driverBCode} leads by ${gap.toFixed(2)}s` : `${driverACode} leads by ${Math.abs(gap).toFixed(2)}s`}
      </div>
    </div>
  );
};

export default function RacePaceSimulator() {
  const [track, setTrack]       = useState("");
  const [driverA, setDriverA]   = useState("");
  const [driverB, setDriverB]   = useState("");
  const [compA, setCompA]       = useState("");
  const [compB, setCompB]       = useState("");
  const [pitA, setPitA]         = useState(20);
  const [pitB, setPitB]         = useState(22);
  const [data, setData]         = useState([]);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const driverAObj = DRIVERS.find(d => d.code === driverA);
  const driverBObj = DRIVERS.find(d => d.code === driverB);

  const simulate = async () => {
    if (!track || !driverA || !driverB || compA === "" || compB === "") {
      setError("Select track, both drivers, and their compounds."); return;
    }
    if (driverA === driverB) { setError("Drivers must be different."); return; }
    setError(null); setLoading(true); setData([]); setResult(null);
    try {
      const url = `${API_BASE}/analysis/race-simulator?track_name=${encodeURIComponent(track)}&driver_a=${driverAObj.code}&team_a=${encodeURIComponent(driverAObj.team)}&driver_b=${driverBObj.code}&team_b=${encodeURIComponent(driverBObj.team)}&compound_a=${compA}&compound_b=${compB}&pit_lap_a=${pitA}&pit_lap_b=${pitB}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Backend error");
      const json = await res.json();
      setData(json.gap_data || []);
      setResult(json);
    } catch (e) {
      setError("Simulation failed — is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const finalGap = data.length ? data[data.length - 1].gap : null;
  const colorA = driverAObj ? (TEAM_COLORS[driverAObj.team] || "#e10600") : "#e10600";
  const colorB = driverBObj ? (TEAM_COLORS[driverBObj.team] || "#3b82f6") : "#3b82f6";

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 6 }}>Race Pace Simulator</h2>
      <p style={{ color: "#7a8499", fontSize: 14, marginBottom: 28 }}>
        Full race simulation — lap-by-lap gap evolution between two drivers under different strategies.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, marginBottom: 10 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label>Track</label>
          <select value={track} onChange={e => setTrack(e.target.value)} style={sel}>
            <option value="">Select track</option>
            {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Driver A row */}
      <div style={{ background: "#141c2b", borderRadius: 10, padding: "16px 18px", marginBottom: 12, borderLeft: `3px solid ${colorA}` }}>
        <div style={{ fontSize: 11, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Driver A</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <div>
            <label>Driver</label>
            <select value={driverA} onChange={e => setDriverA(e.target.value)} style={sel}>
              <option value="">Select</option>
              {DRIVERS.map(d => <option key={d.code} value={d.code}>{d.code} – {d.name}</option>)}
            </select>
          </div>
          <div>
            <label>Starting compound</label>
            <select value={compA} onChange={e => setCompA(Number(e.target.value))} style={sel}>
              <option value="">Select</option>
              {COMPOUNDS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label>Pit lap: <strong style={{ color: "#f0f2f5" }}>{pitA}</strong></label>
            <input type="range" min={5} max={65} value={pitA} onChange={e => setPitA(Number(e.target.value))} style={{ width: "100%", accentColor: colorA, marginTop: 8 }} />
          </div>
        </div>
      </div>

      {/* Driver B row */}
      <div style={{ background: "#141c2b", borderRadius: 10, padding: "16px 18px", marginBottom: 24, borderLeft: `3px solid ${colorB}` }}>
        <div style={{ fontSize: 11, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Driver B</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <div>
            <label>Driver</label>
            <select value={driverB} onChange={e => setDriverB(e.target.value)} style={sel}>
              <option value="">Select</option>
              {DRIVERS.map(d => <option key={d.code} value={d.code}>{d.code} – {d.name}</option>)}
            </select>
          </div>
          <div>
            <label>Starting compound</label>
            <select value={compB} onChange={e => setCompB(Number(e.target.value))} style={sel}>
              <option value="">Select</option>
              {COMPOUNDS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label>Pit lap: <strong style={{ color: "#f0f2f5" }}>{pitB}</strong></label>
            <input type="range" min={5} max={65} value={pitB} onChange={e => setPitB(Number(e.target.value))} style={{ width: "100%", accentColor: colorB, marginTop: 8 }} />
          </div>
        </div>
      </div>

      <button onClick={simulate} disabled={loading} style={{ marginBottom: 28 }}>
        {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Simulating race…</> : "Simulate Full Race"}
      </button>

      {error && <div className="error-box">{error}</div>}

      {data.length > 0 && (
        <div className="animate-in">
          {/* Final gap summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
            {[
              ["Final gap", `${Math.abs(finalGap).toFixed(2)}s`, finalGap > 0 ? colorB : colorA],
              ["Leader", finalGap <= 0 ? driverA : driverB, finalGap <= 0 ? colorA : colorB],
              ["Total laps", result?.total_laps || data.length, "#f0f2f5"],
            ].map(([lbl, val, color]) => (
              <div key={lbl} style={{ background: "#141c2b", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{lbl}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Gap chart */}
          <div style={{ background: "#0e1420", borderRadius: 10, padding: "20px 12px 12px" }}>
            <div style={{ fontSize: 11, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, paddingLeft: 8 }}>
              Gap evolution — Driver B time minus Driver A time (seconds)
            </div>
            <ResponsiveContainer width="100%" height={340}>
              <AreaChart data={data} margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gapGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#e10600" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#e10600" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="lap" tick={{ fill: "#7a8499", fontSize: 11 }} label={{ value: "Lap", position: "insideBottom", offset: -4, fill: "#7a8499", fontSize: 11 }} />
                <YAxis tick={{ fill: "#7a8499", fontSize: 11 }} tickFormatter={v => `${v.toFixed(1)}s`} />
                <Tooltip content={<CustomTooltip driverACode={driverA} driverBCode={driverB} />} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" label={{ value: "Equal", fill: "#7a8499", fontSize: 10 }} />
                {pitA && <ReferenceLine x={pitA} stroke={colorA} strokeDasharray="4 4" label={{ value: `${driverA} pit`, fill: colorA, fontSize: 10 }} />}
                {pitB && <ReferenceLine x={pitB} stroke={colorB} strokeDasharray="4 4" label={{ value: `${driverB} pit`, fill: colorB, fontSize: 10 }} />}
                <Area type="monotone" dataKey="gap" stroke="#e10600" strokeWidth={2} fill="url(#gapGrad)" dot={false} name="Gap (B–A)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
