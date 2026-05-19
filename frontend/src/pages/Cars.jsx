import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { API_BASE } from "../api/backend";

const TEAM_COLORS = {
  "red_bull":    "#3b65ff",
  "mercedes":    "#27f4d2",
  "ferrari":     "#e10600",
  "mclaren":     "#ff8000",
  "aston_martin":"#358c75",
  "alpine":      "#2293d1",
  "alfa":        "#c92d4b",
  "haas":        "#b6babd",
  "alphatauri":  "#5e8faa",
  "williams":    "#37bedd",
};

export default function Cars() {
  const [constructors, setConstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch constructor standings from Ergast via our backend (or directly)
    fetch("https://api.jolpi.ca/ergast/f1/2023/constructorstandings.json")
      .then(r => r.json())
      .then(data => {
        const standings = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
        setConstructors(standings);
        setLoading(false);
      })
      .catch(e => {
        setError("Failed to load constructor standings.");
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader text="Loading constructor standings…" />;
  if (error)   return <h2 style={{ padding: 40, color: "#ef4444" }}>{error}</h2>;

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ fontSize: 28, marginBottom: 8 }}>2023 Constructor Standings</h2>
      <p style={{ color: "#6b7280", marginBottom: 32, fontSize: 14 }}>
        Final Constructors' Championship standings from the 2023 Formula 1 season.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {constructors.map((entry) => {
          const c = entry.Constructor;
          const color = TEAM_COLORS[c.constructorId] || "#6b7280";
          const pos = parseInt(entry.position);
          const pts = parseFloat(entry.points);
          const wins = parseInt(entry.wins);

          return (
            <div
              key={c.constructorId}
              className="section-card"
              style={{ borderLeft: `4px solid ${color}`, position: "relative" }}
            >
              {/* Position badge */}
              <div style={{
                position: "absolute", top: 14, right: 14,
                width: 34, height: 34, borderRadius: "50%",
                background: pos <= 3 ? "#f59e0b" : "#1f2937",
                color: pos <= 3 ? "#111" : "#9ca3af",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700,
              }}>
                {pos}
              </div>

              {/* Team logo */}
              <img
                src={`/teams/${c.constructorId}.png`}
                alt={c.name}
                onError={e => e.target.style.display = "none"}
                style={{ height: 40, objectFit: "contain", marginBottom: 10 }}
              />

              <h3 style={{ fontSize: 17, marginBottom: 4, paddingRight: 40 }}>{c.name}</h3>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>{c.nationality}</p>

              <div style={{ display: "flex", gap: 20 }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color }}>{pts.toFixed(0)}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>points</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: wins > 0 ? "#f9fafb" : "#6b7280" }}>{wins}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>wins</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
