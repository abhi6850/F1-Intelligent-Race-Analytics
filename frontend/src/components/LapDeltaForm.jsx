import { useState } from "react";
import { API_BASE } from "../api/backend";

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

export default function LapDeltaForm({ selectedTrack, selectedDriver, selectedTeam }) {
  const [compound, setCompound] = useState(1);
  const [tyreLife, setTyreLife] = useState(5);
  const [lapNumber, setLapNumber] = useState(10);
  const [stint, setStint] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predict = async () => {
    if (!selectedTrack || !selectedDriver || !selectedTeam) {
      setError("Select track, driver, and team in the selectors above first."); return;
    }
    const totalLaps = 57; // used only for fuel_proxy here; strategy service handles real total
    setError(null); setLoading(true); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/predict/lap-delta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driver_name: selectedDriver,
          team_name: selectedTeam,
          track_name: selectedTrack,
          compound_encoded: compound,
          tyre_life: tyreLife,
          lap_number: lapNumber,
          stint,
          fuel_proxy: Math.max(0.1, 1 - lapNumber / totalLaps),
          race_progress: lapNumber / totalLaps,
        }),
      });
      if (!res.ok) throw new Error("Backend error");
      const data = await res.json();
      setResult(data.lap_delta_seconds);
    } catch (e) {
      setError("Request failed — is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const compColor = COMPOUNDS[compound]?.color || "#f0f2f5";
  const isGood = result !== null && result < 0.8;

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 6 }}>Lap Delta Predictor</h2>
      <p style={{ color: "#7a8499", fontSize: 14, marginBottom: 24 }}>
        Predicts the lap time delta (seconds above the reference baseline) for a specific lap
        using the trained RandomForest model.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, marginBottom: 24 }}>
        <div>
          <label>Compound</label>
          <select value={compound} onChange={e => setCompound(Number(e.target.value))} style={sel}>
            {COMPOUNDS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label>Lap number</label>
          <input type="number" min={1} max={80} value={lapNumber}
            onChange={e => setLapNumber(Number(e.target.value))} style={inputNum} />
        </div>
        <div>
          <label>Tyre life (laps)</label>
          <input type="number" min={1} max={45} value={tyreLife}
            onChange={e => setTyreLife(Number(e.target.value))} style={inputNum} />
        </div>
        <div>
          <label>Stint number</label>
          <input type="number" min={1} max={3} value={stint}
            onChange={e => setStint(Number(e.target.value))} style={inputNum} />
        </div>
      </div>

      <button onClick={predict} disabled={loading} style={{ marginBottom: 28 }}>
        {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Predicting…</> : "Predict Lap Delta"}
      </button>

      {error && <div className="error-box">{error}</div>}

      {result !== null && (
        <div className="animate-in" style={{
          background: "#141c2b",
          border: `1px solid ${compColor}40`,
          borderLeft: `4px solid ${compColor}`,
          borderRadius: 10, padding: "24px 28px",
          display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Predicted lap delta</div>
            <div style={{ fontSize: 52, fontWeight: 900, color: compColor, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
              +{result.toFixed(3)}
              <span style={{ fontSize: 20, fontWeight: 400, color: "#7a8499", marginLeft: 6 }}>s</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span className={`compound-pill compound-${COMPOUNDS[compound].label.toLowerCase()}`}>
                {COMPOUNDS[compound].label}
              </span>
              <span style={{ fontSize: 12, color: "#7a8499", alignSelf: "center" }}>
                Lap {lapNumber} · {tyreLife} laps on tyre · Stint {stint}
              </span>
            </div>
            <div style={{ fontSize: 13, color: "#7a8499" }}>
              Driver: <strong style={{ color: "#f0f2f5" }}>{selectedDriver}</strong> ·{" "}
              Track: <strong style={{ color: "#f0f2f5" }}>{selectedTrack}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
