import { useState } from "react";
import { API_BASE } from "../api/backend";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, ReferenceLine, Legend,
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
  { label: "Soft",   value: 0, color: "#e10600" },
  { label: "Medium", value: 1, color: "#f5a623" },
  { label: "Hard",   value: 2, color: "#d4d4d4" },
];

const sel = {
  width: "100%", background: "#0e1420", color: "#f0f2f5",
  border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6,
  padding: "9px 32px 9px 12px", fontSize: 14,
  fontFamily: "'Titillium Web', sans-serif", outline: "none", appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a8499' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
};

const inputNum = {
  width: "100%", background: "#0e1420", color: "#f0f2f5",
  border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6,
  padding: "9px 12px", fontSize: 14,
  fontFamily: "'Titillium Web', sans-serif", outline: "none",
};

function StrategyBlock({ label, color, driver, compound, pitLap, onDriver, onCompound, onPitLap, drivers }) {
  return (
    <div style={{ background: "#141c2b", borderRadius: 10, padding: "16px 18px", borderLeft: `3px solid ${color}` }}>
      <div style={{ fontSize: 11, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <div>
          <label>Driver</label>
          <select value={driver} onChange={e => onDriver(e.target.value)} style={sel}>
            <option value="">Select</option>
            {drivers.map(d => <option key={d.code} value={d.code}>{d.code} – {d.name}</option>)}
          </select>
        </div>
        <div>
          <label>Starting compound</label>
          <select value={compound} onChange={e => onCompound(Number(e.target.value))} style={sel}>
            {COMPOUNDS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label>Pit lap: <strong style={{ color: "#f0f2f5" }}>{pitLap}</strong></label>
          <input type="range" min={5} max={65} value={pitLap}
            onChange={e => onPitLap(Number(e.target.value))}
            style={{ width: "100%", accentColor: color, marginTop: 8 }} />
        </div>
      </div>
    </div>
  );
}

export default function StrategyMode() {
  const [track, setTrack]     = useState("");
  const [driverA, setDriverA] = useState("");
  const [compA, setCompA]     = useState(0);
  const [pitA, setPitA]       = useState(18);
  const [compAfterA, setCompAfterA] = useState(1);
  const [driverB, setDriverB] = useState("");
  const [compB, setCompB]     = useState(1);
  const [pitB, setPitB]       = useState(24);
  const [compAfterB, setCompAfterB] = useState(2);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const compare = async () => {
    if (!track || !driverA || !driverB) { setError("Select track and both drivers."); return; }
    setError(null); setLoading(true); setResult(null);
    const driverAObj = DRIVERS.find(d => d.code === driverA);
    const driverBObj = DRIVERS.find(d => d.code === driverB);
    try {
      const res = await fetch(`${API_BASE}/analysis/strategy-mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          track_name: track,
          strategy_a: {
            driver: driverAObj.code, team: driverAObj.team,
            compound_start: compA, compound_after: compAfterA, pit_lap: pitA,
          },
          strategy_b: {
            driver: driverBObj.code, team: driverBObj.team,
            compound_start: compB, compound_after: compAfterB, pit_lap: pitB,
          },
        }),
      });
      if (!res.ok) throw new Error("Backend error");
      setResult(await res.json());
    } catch (e) {
      setError("Comparison failed — is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const winnerIsA = result && result.winner === "Strategy A";

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 6 }}>Strategy Comparison</h2>
      <p style={{ color: "#7a8499", fontSize: 14, marginBottom: 24 }}>
        Compare two full race strategies head-to-head. Lap-by-lap gap curve shows where each strategy gains or loses time.
      </p>

      <div style={{ marginBottom: 14 }}>
        <label>Track</label>
        <select value={track} onChange={e => setTrack(e.target.value)} style={{ ...sel, maxWidth: 340 }}>
          <option value="">Select track</option>
          {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        <StrategyBlock
          label="Strategy A" color="#3b82f6"
          driver={driverA} compound={compA} pitLap={pitA}
          onDriver={setDriverA} onCompound={setCompA} onPitLap={setPitA}
          drivers={DRIVERS}
        />
        <div style={{ background: "#141c2b", borderRadius: 10, padding: "16px 18px", borderLeft: "3px solid #3b82f6" }}>
          <div style={{ fontSize: 11, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Strategy A — 2nd compound</div>
          <label>After pit</label>
          <select value={compAfterA} onChange={e => setCompAfterA(Number(e.target.value))} style={sel}>
            {COMPOUNDS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <StrategyBlock
          label="Strategy B" color="#f5a623"
          driver={driverB} compound={compB} pitLap={pitB}
          onDriver={setDriverB} onCompound={setCompB} onPitLap={setPitB}
          drivers={DRIVERS}
        />
        <div style={{ background: "#141c2b", borderRadius: 10, padding: "16px 18px", borderLeft: "3px solid #f5a623" }}>
          <div style={{ fontSize: 11, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Strategy B — 2nd compound</div>
          <label>After pit</label>
          <select value={compAfterB} onChange={e => setCompAfterB(Number(e.target.value))} style={sel}>
            {COMPOUNDS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <button onClick={compare} disabled={loading} style={{ marginBottom: 28 }}>
        {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Comparing…</> : "Compare Strategies"}
      </button>

      {error && <div className="error-box">{error}</div>}

      {result && (
        <div className="animate-in">
          {/* winner banner */}
          <div style={{
            background: winnerIsA ? "rgba(59,130,246,0.08)" : "rgba(245,166,35,0.08)",
            border: `1px solid ${winnerIsA ? "rgba(59,130,246,0.3)" : "rgba(245,166,35,0.3)"}`,
            borderRadius: 10, padding: "16px 20px", marginBottom: 20,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 13, color: "#7a8499", marginBottom: 4 }}>Faster strategy</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: winnerIsA ? "#3b82f6" : "#f5a623" }}>
                {result.winner}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#7a8499", marginBottom: 4 }}>Time advantage</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f0f2f5" }}>
                {result.time_difference?.toFixed(3)}s
              </div>
            </div>
          </div>

          {/* delta totals */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              ["Strategy A total delta", result.total_time_a?.toFixed(2) + "s", "#3b82f6"],
              ["Strategy B total delta", result.total_time_b?.toFixed(2) + "s", "#f5a623"],
            ].map(([lbl, val, color]) => (
              <div key={lbl} style={{ background: "#141c2b", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{lbl}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace" }}>{val}</div>
              </div>
            ))}
          </div>

          {/* gap curve */}
          {result.gap_curve?.length > 0 && (
            <div style={{ background: "#0e1420", borderRadius: 10, padding: "20px 12px 12px" }}>
              <div style={{ fontSize: 11, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, paddingLeft: 8 }}>
                Cumulative gap — positive = B is ahead
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={result.gap_curve} margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="lap" tick={{ fill: "#7a8499", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#7a8499", fontSize: 11 }} tickFormatter={v => `${v.toFixed(1)}s`} />
                  <Tooltip
                    contentStyle={{ background: "#141c2b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
                    formatter={v => [`${v.toFixed(3)}s`, "Gap (B–A)"]}
                  />
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="gap" stroke="#e10600" strokeWidth={2} dot={false} name="Gap" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
