import { useState, useEffect } from "react";
import { API_BASE } from "../api/backend";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";

export default function TyreDegradationChart({ selectedTrack, selectedDriver, selectedTeam }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedTrack || !selectedDriver || !selectedTeam) return;
    setLoading(true); setError(null); setData(null);
    fetch(`${API_BASE}/analysis/tyre-degradation?track_name=${encodeURIComponent(selectedTrack)}&driver_name=${selectedDriver}&team_name=${encodeURIComponent(selectedTeam)}`)
      .then(r => { if (!r.ok) throw new Error("Backend error"); return r.json(); })
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError("Failed to load — is the backend running?"); setLoading(false); });
  }, [selectedTrack, selectedDriver, selectedTeam]);

  const COMPOUND_STYLES = {
    soft:   { color: "#e10600", label: "Soft" },
    medium: { color: "#f5a623", label: "Medium" },
    hard:   { color: "#d4d4d4", label: "Hard" },
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 6 }}>Tyre Degradation</h2>
      <p style={{ color: "#7a8499", fontSize: 14, marginBottom: 24 }}>
        Predicted lap delta per compound across the race distance. Steeper slope = faster degradation.
      </p>

      {!selectedTrack && (
        <div style={{ color: "#7a8499", fontSize: 14, padding: "20px 0" }}>
          Select a track, driver, and team using the selectors above to see degradation curves.
        </div>
      )}

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#7a8499", fontSize: 14, padding: "20px 0" }}>
          <span className="spinner" /> Loading degradation data…
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      {data && (
        <div className="animate-in">
          {/* Compound summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
            {["soft", "medium", "hard"].map(c => {
              const style = COMPOUND_STYLES[c];
              const series = data[c] || [];
              const lastDelta = series[series.length - 1]?.delta;
              return (
                <div key={c} style={{
                  background: "#141c2b", borderRadius: 8, padding: "14px 16px",
                  borderTop: `2px solid ${style.color}`,
                }}>
                  <div style={{ fontSize: 10, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{style.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: style.color, fontFamily: "'JetBrains Mono', monospace" }}>
                    {lastDelta ? `+${lastDelta.toFixed(2)}s` : "—"}
                  </div>
                  <div style={{ fontSize: 11, color: "#7a8499", marginTop: 4 }}>at lap {series.length}</div>
                </div>
              );
            })}
          </div>

          {/* Chart */}
          <div style={{ background: "#0e1420", borderRadius: 10, padding: "20px 12px 12px" }}>
            <div style={{ fontSize: 11, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, paddingLeft: 8 }}>
              Lap delta (s) by tyre life — {selectedDriver} at {selectedTrack}
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="lap" type="number" tick={{ fill: "#7a8499", fontSize: 11 }} label={{ value: "Tyre life (laps)", position: "insideBottom", offset: -4, fill: "#7a8499", fontSize: 11 }} />
                <YAxis tick={{ fill: "#7a8499", fontSize: 11 }} tickFormatter={v => `${v.toFixed(1)}s`} />
                <Tooltip
                  contentStyle={{ background: "#141c2b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
                  formatter={v => [`+${v.toFixed(3)}s`, "Lap delta"]}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#7a8499" }} />
                {Object.entries(COMPOUND_STYLES).map(([key, style]) => (
                  data[key]?.length > 0 && (
                    <Line
                      key={key}
                      data={data[key]}
                      type="monotone"
                      dataKey="delta"
                      stroke={style.color}
                      strokeWidth={2}
                      dot={false}
                      name={style.label}
                    />
                  )
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
