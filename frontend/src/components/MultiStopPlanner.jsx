import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Cell, ReferenceLine
} from "recharts";
import { getMultiStopStrategy } from "../api/backend";

const DRIVERS = [
  { code: "VER", team: "Red Bull Racing" }, { code: "PER", team: "Red Bull Racing" },
  { code: "HAM", team: "Mercedes" },       { code: "RUS", team: "Mercedes" },
  { code: "LEC", team: "Ferrari" },        { code: "SAI", team: "Ferrari" },
  { code: "NOR", team: "McLaren" },        { code: "PIA", team: "McLaren" },
  { code: "ALO", team: "Aston Martin" },   { code: "STR", team: "Aston Martin" },
  { code: "OCO", team: "Alpine" },         { code: "GAS", team: "Alpine" },
  { code: "BOT", team: "Alfa Romeo" },     { code: "ZHO", team: "Alfa Romeo" },
  { code: "MAG", team: "Haas" },           { code: "HUL", team: "Haas" },
  { code: "TSU", team: "AlphaTauri" },     { code: "RIC", team: "AlphaTauri" },
  { code: "ALB", team: "Williams" },       { code: "SAR", team: "Williams" },
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

const COMPOUND_COLORS = { Soft: "#e10600", Medium: "#fbbf24", Hard: "#d1d5db" };
const COMPOUND_TEXT   = { Soft: "#fff",    Medium: "#111",    Hard: "#111"    };

function StintBar({ stints, totalLaps, isRecommended }) {
  return (
    <div style={{
      background: isRecommended ? "rgba(59,130,246,0.06)" : "#111827",
      border: isRecommended ? "1px solid rgba(59,130,246,0.3)" : "1px solid #1f2937",
      borderRadius: 10, padding: "16px 18px", marginBottom: 14, position: "relative",
    }}>
      {isRecommended && (
        <span style={{
          position: "absolute", top: -11, left: 16,
          background: "#3b82f6", color: "#fff",
          fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20,
        }}>
          Recommended
        </span>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: "#9ca3af" }}>{stints.length - 1} stop{stints.length > 2 ? "s" : ""}</span>
        <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600, color: "#f9fafb" }}>
          Δ {stints.reduce((a, s) => a, 0).toFixed ? "" : ""}{stints.label || ""}
        </span>
      </div>

      <div style={{ display: "flex", gap: 2, height: 32, borderRadius: 6, overflow: "hidden", marginBottom: 10 }}>
        {stints.map((s, i) => (
          <div key={i} style={{
            flex: s.laps,
            background: COMPOUND_COLORS[s.compound] || "#6b7280",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700,
            color: COMPOUND_TEXT[s.compound] || "#fff",
            minWidth: 28,
          }}>
            {s.compound[0]}{s.laps}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {stints.map((s, i) => (
          <span key={i} style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{
              width: 10, height: 10, borderRadius: 2,
              background: COMPOUND_COLORS[s.compound] || "#6b7280",
              display: "inline-block", flexShrink: 0,
            }} />
            {s.compound} laps {s.start_lap}–{s.end_lap}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MultiStopPlanner() {
  const [driver, setDriver]   = useState("VER");
  const [track, setTrack]     = useState("Bahrain Grand Prix");
  const [grid, setGrid]       = useState(5);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const selectedDriver = DRIVERS.find(d => d.code === driver);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await getMultiStopStrategy({
        track_name: track,
        driver,
        team: selectedDriver.team,
        grid_position: grid,
      });
      setResult(data);
    } catch (e) {
      setError("Strategy computation failed — is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const sel = { background: "#1f2937", color: "#f9fafb", border: "1px solid #374151", borderRadius: 6, padding: "8px 10px", fontSize: 14, width: "100%" };

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 6, color: "#f9fafb" }}>Multi-Stop Strategy Planner</h2>
      <p style={{ color: "#6b7280", marginBottom: 26, fontSize: 14 }}>
        Exhaustively evaluates all 1-stop and 2-stop compound combinations for every viable pit
        window and returns the minimum-time strategy for your driver on this circuit.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 26 }}>
        <div>
          <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 6 }}>Driver</label>
          <select value={driver} onChange={e => setDriver(e.target.value)} style={sel}>
            {DRIVERS.map(d => <option key={d.code} value={d.code}>{d.code}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 6 }}>Track</label>
          <select value={track} onChange={e => setTrack(e.target.value)} style={sel}>
            {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 6 }}>
            Grid: <strong style={{ color: "#f9fafb" }}>P{grid}</strong>
          </label>
          <input
            type="range" min={1} max={20} value={grid}
            onChange={e => setGrid(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#e10600", marginTop: 6 }}
          />
        </div>
      </div>

      <button
        onClick={handleRun} disabled={loading}
        style={{
          background: loading ? "#374151" : "#e10600",
          color: "#fff", border: "none", borderRadius: 8,
          padding: "11px 28px", fontSize: 14, fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer", marginBottom: 30,
        }}
      >
        {loading ? "Computing all strategies…" : "Find Optimal Strategy"}
      </button>

      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      {result && (
        <div style={{ animation: "fadeIn 0.4s ease" }}>

          {/* Summary banner */}
          <div style={{
            background: "#1f2937", borderRadius: 10, padding: "14px 20px",
            marginBottom: 22, display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Recommended</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#3b82f6" }}>
                {result.better_strategy} strategy
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Time advantage</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#f9fafb" }}>
                {result.delta_between_strategies}s
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Track</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: "#f9fafb" }}>{result.track}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Total laps</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: "#f9fafb" }}>{result.total_laps}</div>
            </div>
          </div>

          {/* Stint bars */}
          {result.one_stop && (
            <StintBar
              stints={result.one_stop.stints}
              totalLaps={result.total_laps}
              isRecommended={result.better_strategy === "1-stop"}
            />
          )}
          {result.two_stop && (
            <StintBar
              stints={result.two_stop.stints}
              totalLaps={result.total_laps}
              isRecommended={result.better_strategy === "2-stop"}
            />
          )}

          {/* Bar chart comparison */}
          {result.one_stop && result.two_stop && (
            <div style={{ background: "#111827", borderRadius: 10, padding: "18px 20px", marginTop: 20 }}>
              <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 14 }}>Total race time comparison (seconds)</div>
              <div style={{ height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "1-stop", time: result.one_stop_time },
                      { name: "2-stop", time: result.two_stop_time },
                    ]}
                    layout="vertical"
                    margin={{ left: 0, right: 40, top: 0, bottom: 0 }}
                  >
                    <CartesianGrid stroke="#1f2937" horizontal={false} />
                    <XAxis type="number" domain={['dataMin - 5', 'dataMax + 5']} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#9ca3af", fontSize: 13 }} width={50} />
                    <Tooltip
                      contentStyle={{ background: "#1f2937", border: "none", borderRadius: 6 }}
                      formatter={v => [`${v.toFixed(1)}s`, "Total delta"]}
                    />
                    <Bar dataKey="time" radius={[0, 4, 4, 0]} barSize={28}>
                      <Cell fill={result.better_strategy === "1-stop" ? "#3b82f6" : "#374151"} />
                      <Cell fill={result.better_strategy === "2-stop" ? "#3b82f6" : "#374151"} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }`}</style>
    </div>
  );
}
