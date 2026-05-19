import { Link } from "react-router-dom";

const FEATURES = [
  { icon: "🏆", title: "Win Predictor",       desc: "Grid position → win probability via 80-simulation Monte Carlo across all 20 drivers." },
  { icon: "🔧", title: "Multi-Stop Planner",  desc: "Exhaustive 1-stop vs 2-stop evaluation. Best compound sequence with minimum race time." },
  { icon: "📊", title: "Lap Delta Model",     desc: "RandomForest trained on 2023 telemetry. MAE ≈ 0.42s per lap." },
  { icon: "⏱",  title: "Pit Window Optimizer",desc: "Finds the optimal pit lap given current tyre life, compound, and race position." },
  { icon: "🔁", title: "Undercut Analyser",   desc: "Simulates whether pitting early gains track position over a rival." },
  { icon: "🏁", title: "Race Simulator",      desc: "Lap-by-lap gap evolution between two drivers under custom strategies." },
];

const STATS = [
  { val: "22", label: "Circuits" },
  { val: "20", label: "Drivers" },
  { val: "0.42s", label: "Model MAE" },
  { val: "2023", label: "Season data" },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "90vh" }}>

      {/* ── Hero ── */}
      <div style={{
        position: "relative",
        padding: "90px 60px 80px",
        textAlign: "center",
        overflow: "hidden",
      }}>
        {/* Red glow orb */}
        <div style={{
          position: "absolute", top: "30%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 600, height: 300,
          background: "radial-gradient(ellipse, rgba(225,6,0,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          display: "inline-block",
          background: "rgba(225,6,0,0.1)",
          border: "1px solid rgba(225,6,0,0.3)",
          borderRadius: 20, padding: "4px 16px",
          fontSize: 12, fontWeight: 700, color: "#e10600",
          letterSpacing: "0.1em", textTransform: "uppercase",
          marginBottom: 24,
        }}>
          2023 F1 Season · AI-Powered
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 6vw, 64px)",
          fontWeight: 900,
          lineHeight: 1.05,
          marginBottom: 20,
          background: "linear-gradient(135deg, #f0f2f5 0%, #7a8499 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Intelligent Race<br />Strategy Platform
        </h1>

        <p style={{
          maxWidth: 560, margin: "0 auto 40px",
          color: "#7a8499", fontSize: 17, lineHeight: 1.7,
        }}>
          Predict race outcomes, optimise tyre strategies, and simulate head-to-head battles —
          powered by a RandomForest trained on real 2023 lap telemetry.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/analytics" style={{
            background: "#e10600", color: "#fff",
            padding: "13px 32px", borderRadius: 8,
            textDecoration: "none", fontWeight: 700, fontSize: 15,
            letterSpacing: "0.04em",
            boxShadow: "0 0 24px rgba(225,6,0,0.3)",
            transition: "opacity 0.15s",
          }}>
            Open Analytics →
          </Link>
          <Link to="/drivers" style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f0f2f5",
            padding: "13px 32px", borderRadius: 8,
            textDecoration: "none", fontWeight: 600, fontSize: 15,
          }}>
            Explore Drivers
          </Link>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{
        display: "flex", justifyContent: "center",
        gap: 0, borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        marginBottom: 60,
      }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{
            flex: 1, maxWidth: 200, textAlign: "center",
            padding: "24px 20px",
            borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: "#e10600", fontFamily: "'Titillium Web', sans-serif" }}>{s.val}</div>
            <div style={{ fontSize: 12, color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Features grid ── */}
      <div style={{ padding: "0 60px 80px" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, marginBottom: 8 }}>What's inside</h2>
        <p style={{ textAlign: "center", color: "#7a8499", marginBottom: 40, fontSize: 15 }}>
          Six analytics tools backed by real race data
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, maxWidth: 1100, margin: "0 auto" }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} style={{
              background: "#0e1420",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: "22px 24px",
              transition: "border-color 0.2s, transform 0.2s",
              cursor: "default",
              animationDelay: `${i * 60}ms`,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(225,6,0,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#7a8499", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick nav ── */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap",
        padding: "0 60px 80px",
      }}>
        {[
          { label: "Drivers", path: "/drivers" },
          { label: "Constructors", path: "/constructors" },
          { label: "Tracks", path: "/tracks" },
          { label: "F1 History", path: "/history" },
        ].map(l => (
          <Link key={l.label} to={l.path} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#7a8499", padding: "10px 22px",
            borderRadius: 8, textDecoration: "none",
            fontSize: 14, fontWeight: 600,
            transition: "color 0.15s, border-color 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#f0f2f5"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#7a8499"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
