import { useState } from "react";
import { getWinProbability } from "../api/backend";

const DRIVERS = [
  { code: "VER", name: "Max Verstappen",     team: "Red Bull Racing" },
  { code: "PER", name: "Sergio Perez",       team: "Red Bull Racing" },
  { code: "HAM", name: "Lewis Hamilton",     team: "Mercedes" },
  { code: "RUS", name: "George Russell",     team: "Mercedes" },
  { code: "LEC", name: "Charles Leclerc",    team: "Ferrari" },
  { code: "SAI", name: "Carlos Sainz",       team: "Ferrari" },
  { code: "NOR", name: "Lando Norris",       team: "McLaren" },
  { code: "PIA", name: "Oscar Piastri",      team: "McLaren" },
  { code: "ALO", name: "Fernando Alonso",    team: "Aston Martin" },
  { code: "STR", name: "Lance Stroll",       team: "Aston Martin" },
  { code: "OCO", name: "Esteban Ocon",       team: "Alpine" },
  { code: "GAS", name: "Pierre Gasly",       team: "Alpine" },
  { code: "BOT", name: "Valtteri Bottas",    team: "Alfa Romeo" },
  { code: "ZHO", name: "Zhou Guanyu",        team: "Alfa Romeo" },
  { code: "MAG", name: "Kevin Magnussen",    team: "Haas" },
  { code: "HUL", name: "Nico Hulkenberg",    team: "Haas" },
  { code: "TSU", name: "Yuki Tsunoda",       team: "AlphaTauri" },
  { code: "RIC", name: "Daniel Ricciardo",   team: "AlphaTauri" },
  { code: "ALB", name: "Alexander Albon",    team: "Williams" },
  { code: "SAR", name: "Logan Sargeant",     team: "Williams" },
];

const TRACKS = [
  "Bahrain Grand Prix", "Saudi Arabian Grand Prix", "Australian Grand Prix",
  "Azerbaijan Grand Prix", "Miami Grand Prix", "Monaco Grand Prix",
  "Spanish Grand Prix", "Canadian Grand Prix", "Austrian Grand Prix",
  "British Grand Prix", "Hungarian Grand Prix", "Belgian Grand Prix",
  "Dutch Grand Prix", "Italian Grand Prix", "Singapore Grand Prix",
  "Japanese Grand Prix", "Qatar Grand Prix", "United States Grand Prix",
  "Mexico City Grand Prix", "São Paulo Grand Prix", "Las Vegas Grand Prix",
  "Abu Dhabi Grand Prix",
];

const COMPOUNDS = [
  { label: "Auto (recommended)", value: null },
  { label: "Soft",   value: 0 },
  { label: "Medium", value: 1 },
  { label: "Hard",   value: 2 },
];

const COMPOUND_COLORS = { Soft: "#e10600", Medium: "#fbbf24", Hard: "#d1d5db" };
const TEAM_COLORS = {
  "Red Bull Racing": "#3b65ff",
  "Mercedes": "#27f4d2",
  "Ferrari": "#e10600",
  "McLaren": "#ff8000",
  "Aston Martin": "#358c75",
  "Alpine": "#2293d1",
  "Alfa Romeo": "#c92d4b",
  "Haas": "#b6babd",
  "AlphaTauri": "#5e8faa",
  "Williams": "#37bedd",
};

function ProbabilityGauge({ value, label, color }) {
  const clamp = Math.min(Math.max(value, 0), 100);
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div style={{
        position: "relative", width: 110, height: 110,
        margin: "0 auto 8px",
      }}>
        <svg viewBox="0 0 110 110" style={{ transform: "rotate(-90deg)", width: 110, height: 110 }}>
          <circle cx="55" cy="55" r="44" fill="none" stroke="#1f2937" strokeWidth="10" />
          <circle
            cx="55" cy="55" r="44" fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={`${(clamp / 100) * 276.46} 276.46`}
            strokeLinecap="round"
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column",
        }}>
          <span style={{ fontSize: 22, fontWeight: 600, color }}>{clamp}%</span>
        </div>
      </div>
      <div style={{ fontSize: 13, color: "#9ca3af" }}>{label}</div>
    </div>
  );
}

function StintBar({ stints, totalLaps }) {
  return (
    <div>
      <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>Stint plan</div>
      <div style={{ display: "flex", gap: 3, height: 28, borderRadius: 6, overflow: "hidden" }}>
        {stints.map((s, i) => (
          <div
            key={i}
            title={`${s.compound} — laps ${s.start_lap}–${s.end_lap}`}
            style={{
              flex: s.laps,
              background: COMPOUND_COLORS[s.compound] || "#6b7280",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 600,
              color: s.compound === "Hard" ? "#111827" : "#fff",
            }}
          >
            {s.compound[0]} {s.laps}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
        {stints.map((s, i) => (
          <span key={i} style={{ fontSize: 12, color: "#9ca3af" }}>
            <span style={{
              display: "inline-block", width: 10, height: 10,
              borderRadius: 2, background: COMPOUND_COLORS[s.compound] || "#6b7280",
              marginRight: 4, verticalAlign: "middle",
            }} />
            {s.compound} · {s.laps} laps (lap {s.start_lap}–{s.end_lap})
          </span>
        ))}
      </div>
    </div>
  );
}

export default function WinPredictor() {
  const [driver, setDriver] = useState("VER");
  const [track, setTrack] = useState("Bahrain Grand Prix");
  const [gridPos, setGridPos] = useState(1);
  const [compound, setCompound] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedDriver = DRIVERS.find(d => d.code === driver);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await getWinProbability({
        driver,
        team: selectedDriver.team,
        grid_position: gridPos,
        track_name: track,
        compound_start: compound,
        n_simulations: 80,
      });
      setResult(data);
    } catch (e) {
      setError("Prediction failed — is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const ordinal = n => {
    const s = ["th","st","nd","rd"], v = n % 100;
    return n + (s[(v-20)%10] || s[v] || s[0]);
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 6, color: "#f9fafb" }}>Race Win Predictor</h2>
      <p style={{ color: "#6b7280", marginBottom: 28, fontSize: 14 }}>
        Select a driver, their starting grid position, and a circuit. The model runs 80 Monte Carlo
        race simulations against the full 2023 grid and returns win probability, podium probability,
        and the recommended starting strategy.
      </p>

      {/* ── Inputs ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>

        <div>
          <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 6 }}>Driver</label>
          <select
            value={driver}
            onChange={e => setDriver(e.target.value)}
            style={{ width: "100%", background: "#1f2937", color: "#f9fafb", border: "1px solid #374151", borderRadius: 6, padding: "8px 10px", fontSize: 14 }}
          >
            {DRIVERS.map(d => (
              <option key={d.code} value={d.code}>{d.code} – {d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 6 }}>Track</label>
          <select
            value={track}
            onChange={e => setTrack(e.target.value)}
            style={{ width: "100%", background: "#1f2937", color: "#f9fafb", border: "1px solid #374151", borderRadius: 6, padding: "8px 10px", fontSize: 14 }}
          >
            {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 6 }}>
            Grid Position: <strong style={{ color: "#f9fafb" }}>{ordinal(gridPos)}</strong>
          </label>
          <input
            type="range" min={1} max={20} value={gridPos}
            onChange={e => setGridPos(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#e10600" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b7280", marginTop: 2 }}>
            <span>P1</span><span>P10</span><span>P20</span>
          </div>
        </div>

        <div>
          <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 6 }}>Starting Compound</label>
          <select
            value={compound ?? ""}
            onChange={e => setCompound(e.target.value === "" ? null : Number(e.target.value))}
            style={{ width: "100%", background: "#1f2937", color: "#f9fafb", border: "1px solid #374151", borderRadius: 6, padding: "8px 10px", fontSize: 14 }}
          >
            {COMPOUNDS.map(c => (
              <option key={String(c.value)} value={c.value ?? ""}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handlePredict}
        disabled={loading}
        style={{
          background: loading ? "#374151" : "#e10600",
          color: "#fff", border: "none", borderRadius: 8,
          padding: "12px 32px", fontSize: 15, fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: 32, transition: "background 0.2s",
        }}
      >
        {loading ? "Running simulations…" : "Predict Race Outcome"}
      </button>

      {error && <p style={{ color: "#ef4444", marginBottom: 20 }}>{error}</p>}

      {/* ── Results ── */}
      {result && (
        <div style={{ animation: "fadeIn 0.4s ease" }}>

          {/* Driver chip */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            marginBottom: 24, padding: "12px 18px",
            background: "#1f2937", borderRadius: 10,
            borderLeft: `4px solid ${TEAM_COLORS[result.team] || "#3b82f6"}`,
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#f9fafb" }}>
                {result.driver}
              </div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>{result.team}</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>Starting from</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f9fafb" }}>
                {ordinal(result.grid_position)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>Expected finish</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#60a5fa" }}>
                {ordinal(Math.round(result.expected_finishing_position))}
              </div>
            </div>
          </div>

          {/* Probability gauges */}
          <div style={{ display: "flex", gap: 20, marginBottom: 28, justifyContent: "center", flexWrap: "wrap" }}>
            <ProbabilityGauge value={result.win_probability}    label="Win probability"    color="#e10600" />
            <ProbabilityGauge value={result.podium_probability} label="Podium probability" color="#f59e0b" />
            <ProbabilityGauge
              value={Math.max(0, 100 - (result.expected_finishing_position - 1) * 5)}
              label="Points finish"
              color="#3b82f6"
            />
          </div>

          {/* Recommended strategy */}
          <div style={{ background: "#1f2937", borderRadius: 10, padding: "18px 20px", marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#9ca3af", marginBottom: 14 }}>
              Recommended Starting Strategy
            </div>
            {result.recommended_strategy && (
              <>
                <StintBar
                  totalLaps={result.total_laps}
                  stints={[
                    {
                      compound: result.recommended_strategy.starting_compound,
                      start_lap: 1,
                      end_lap: result.recommended_strategy.pit_lap - 1,
                      laps: result.recommended_strategy.stint_1_laps,
                    },
                    {
                      compound: result.recommended_strategy.second_compound,
                      start_lap: result.recommended_strategy.pit_lap,
                      end_lap: result.total_laps,
                      laps: result.recommended_strategy.stint_2_laps,
                    },
                  ]}
                />
                <div style={{ marginTop: 14, fontSize: 14, color: "#d1d5db" }}>
                  Pit on <strong style={{ color: "#f9fafb" }}>lap {result.recommended_strategy.pit_lap}</strong>
                  {" "}— {result.recommended_strategy.starting_compound} → {result.recommended_strategy.second_compound}
                </div>
              </>
            )}
          </div>

          {/* Finishing order table */}
          <div style={{ background: "#111827", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #1f2937", fontSize: 14, fontWeight: 600, color: "#9ca3af" }}>
              Simulated finishing order (base scenario)
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#1f2937" }}>
                  {["Pos", "Driver", "Team", "Gap to leader"].map(h => (
                    <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.finishing_order.slice(0, 10).map((row) => (
                  <tr
                    key={row.driver}
                    style={{
                      background: row.is_target ? "rgba(59,130,246,0.08)" : "transparent",
                      borderBottom: "1px solid #1f2937",
                    }}
                  >
                    <td style={{ padding: "9px 14px", fontSize: 14, color: row.position <= 3 ? "#f59e0b" : "#9ca3af", fontWeight: row.position <= 3 ? 700 : 400 }}>
                      P{row.position}
                    </td>
                    <td style={{ padding: "9px 14px", fontSize: 14, color: row.is_target ? "#60a5fa" : "#f9fafb", fontWeight: row.is_target ? 700 : 400 }}>
                      {row.driver} {row.is_target && "◀"}
                    </td>
                    <td style={{ padding: "9px 14px", fontSize: 13, color: "#6b7280" }}>{row.team}</td>
                    <td style={{ padding: "9px 14px", fontSize: 13, color: "#9ca3af" }}>
                      {row.position === 1 ? "—" : `+${row.time_gap.toFixed(1)}s`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }`}</style>
    </div>
  );
}
