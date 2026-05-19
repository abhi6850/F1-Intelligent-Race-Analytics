import { useState } from "react";

import LapDeltaForm from "../components/LapDeltaForm";
import PitStrategyForm from "../components/PitStrategyForm";
import TrackSelector from "../components/TrackSelector";
import DriverSelector from "../components/DriverSelector";
import TeamSelector from "../components/TeamSelector";
import TyreDegradationChart from "../components/TyreDegradationChart";
import UndercutAnalyzer from "../components/UndercutAnalyzer";
import RacePaceSimulator from "../components/RacePaceSimulator";
import StrategyMode from "../components/StrategyMode";
import WinPredictor from "../components/WinPredictor";
import MultiStopPlanner from "../components/MultiStopPlanner";

export default function Dashboard() {

  const [track, setTrack]         = useState("");
  const [driver, setDriver]       = useState("");
  const [team, setTeam]           = useState("");
  const [activeTab, setActiveTab] = useState("Win Predictor");

  const sections = {
    "🏆 Race Predictions": ["Win Predictor", "Multi-Stop Planner"],
    "📊 Performance":      ["Lap Delta", "Tyre Degradation"],
    "🔧 Strategy Tools":   ["Pit Strategy", "Undercut Analyzer"],
    "🏁 Race Simulation":  ["Race Pace Simulator", "Strategy Mode"],
  };

  const toolsUsingGlobalSelectors = ["Lap Delta", "Tyre Degradation", "Pit Strategy"];
  const showGlobalSelectors = toolsUsingGlobalSelectors.includes(activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case "Win Predictor":        return <WinPredictor />;
      case "Multi-Stop Planner":   return <MultiStopPlanner />;
      case "Lap Delta":            return <LapDeltaForm selectedTrack={track} selectedDriver={driver} selectedTeam={team} />;
      case "Pit Strategy":         return <PitStrategyForm selectedTrack={track} selectedDriver={driver} selectedTeam={team} />;
      case "Tyre Degradation":     return <TyreDegradationChart selectedTrack={track} selectedDriver={driver} selectedTeam={team} />;
      case "Undercut Analyzer":    return <UndercutAnalyzer />;
      case "Race Pace Simulator":  return <RacePaceSimulator />;
      case "Strategy Mode":        return <StrategyMode />;
      default:                     return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: 240, background: "#0d1117",
        padding: "28px 16px",
        borderRight: "1px solid #1f2937",
        flexShrink: 0,
      }}>
        <h2 style={{ color: "#e10600", marginBottom: 28, fontSize: 16, letterSpacing: "0.05em" }}>
          F1 Analytics
        </h2>

        {Object.entries(sections).map(([section, tabs]) => (
          <div key={section} style={{ marginBottom: 22 }}>
            <h4 style={{ color: "#4b5563", marginBottom: 6, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {section}
            </h4>

            {tabs.map(tab => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "7px 10px",
                  marginBottom: 3,
                  borderRadius: 6,
                  cursor: "pointer",
                  background: activeTab === tab ? "#1a2030" : "transparent",
                  color: activeTab === tab ? "#60a5fa" : "#6b7280",
                  borderLeft: activeTab === tab ? "3px solid #3b82f6" : "3px solid transparent",
                  fontSize: 13,
                  transition: "all 0.15s ease",
                }}
              >
                {tab}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, padding: "40px 44px", overflowY: "auto" }}>

        <h1 style={{
          fontSize: 26, marginBottom: 28,
          background: "linear-gradient(90deg, #e10600, #ff6b6b)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          AI Strategy & Performance Intelligence
        </h1>

        {showGlobalSelectors && (
          <>
            <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              <TrackSelector value={track} onChange={setTrack} />
              <DriverSelector value={driver} onChange={setDriver} />
              <TeamSelector value={team} onChange={setTeam} />
            </div>
            <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
              {[["Track", track], ["Driver", driver], ["Team", team]].map(([label, val]) => (
                <div key={label} className="section-card" style={{ flex: 1, minWidth: 120 }}>
                  <h4 style={{ color: "#6b7280", fontSize: 11, marginBottom: 4 }}>{label}</h4>
                  <p style={{ fontSize: 14 }}>{val || "Not selected"}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="section-card">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}
