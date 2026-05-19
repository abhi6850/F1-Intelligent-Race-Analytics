import { useState } from "react";
import { API_BASE } from "../api/backend";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, ReferenceLine,
} from "recharts";

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
  padding: "9px 12px", fontSize: 14, fontFamily: "'Titillium Web', sans-serif", outline: "none",
};

export default function PitStrategyForm({ selectedTrack, selectedDriver, selectedTeam }) {
  const [compound, setCompound] = useState(1);
  const [currentLap, setCurrentLap] = useState(1);
  const [tyreLife, setTyreLife] = useState(1);
  const [stint, setStint] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const findOptimalPit = async () => {
    if (!selectedTrack || !selectedDriver || !selectedTeam) {
      setError("Select track, driver, and team in the selectors above first."); return;
    }
    setError(null); setLoading(true); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/strategy/optimal-pit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          track_name: selectedTrack,
          driver_name: selectedDriver,
          team_name: selectedTeam,
          compound_encoded: compound,
          current_lap: currentLap,
          current_tyre_life: tyreLife,
          stint,
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

  const compColor = COMPOUNDS[compound]?.color || "#f0f2f5";

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 6 }}>Pit Window Optimizer</h2>
      <p style={{ color: "#7a8499", fontSize: 14, marginBottom: 24 }}>
        Given the current race situation, finds the lap that minimises total remaining race time.
        Uses track selected above.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, marginBottom: 24 }}>
        <div>
          <label>Current compound</label>
          <select value={compound} onChange={e => setCompound(Number(e.target.value))} style={sel}>
            {COMPOUNDS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label>Current lap</label>
          <input type="number" min={1} max={70} value={currentLap}
            onChange={e => setCurrentLap(Number(e.target.value))} style={inputNum} />
        </div>
        <div>
          <label>Tyre life (laps on current set)</label>
          <input type="number" min={1} max={40} value={tyreLife}
            onChange={e => setTyreLife(Number(e.target.value))} style={inputNum} />
        </div>
        <div>
          <label>Stint number</label>
          <input type="number" min={1} max={3} value={stint}
            onChange={e => setStint(Number(e.target.value))} style={inputNum} />
        </div>
      </div>

      <button onClick={findOptimalPit} disabled={loading} style={{ marginBottom: 28 }}>
        {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Calculating…</> : "Find Optimal Pit Lap"}
      </button>

      {error && <div className="error-box">{error}</div>}

      {result && (
        <div className="animate-in">
          {/* Main result */}
          <div style={{
            background: "#141c2b",
            border: `1px solid ${compColor}40`,
            borderLeft: `4px solid ${compColor}`,
            borderRadius: 10, padding: "20px 24px", marginBottom: 20,
            display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap",
          }}>
            <div>
              <div style={{ fontSize: 11, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Optimal pit lap</div>
              <div style={{ fontSize: 44, fontWeight: 900, color: compColor, lineHeight: 1 }}>
                {result.optimal_pit_lap}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Expected race delta</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#f0f2f5", fontFamily: "'JetBrains Mono', monospace" }}>
                {result.expected_total_delta?.toFixed(2)}s
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Current compound</div>
              <span className={`compound-pill compound-${COMPOUNDS[compound].label.toLowerCase()}`}>
                {COMPOUNDS[compound].label}
              </span>
            </div>
          </div>

          {/* Strategy curve */}
          {result.strategy_curve?.length > 0 && (
            <div style={{ background: "#0e1420", borderRadius: 10, padding: "20px 12px 12px" }}>
              <div style={{ fontSize: 11, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, paddingLeft: 8 }}>
                Total race delta by pit lap — lower is better
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={result.strategy_curve} margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="pit_lap" tick={{ fill: "#7a8499", fontSize: 11 }} label={{ value: "Pit Lap", position: "insideBottom", offset: -4, fill: "#7a8499", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#7a8499", fontSize: 11 }} tickFormatter={v => `${v.toFixed(0)}s`} />
                  <Tooltip
                    contentStyle={{ background: "#141c2b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
                    formatter={v => [`${v.toFixed(2)}s`, "Race delta"]}
                    labelFormatter={l => `Pit lap ${l}`}
                  />
                  <ReferenceLine x={result.optimal_pit_lap} stroke={compColor} strokeDasharray="4 4"
                    label={{ value: "Optimal", fill: compColor, fontSize: 11 }} />
                  <Line type="monotone" dataKey="total_delta" stroke="#e10600" strokeWidth={2} dot={false} name="Delta" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
