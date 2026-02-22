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

export default function Dashboard() {

  const [track, setTrack] = useState("");
  const [driver, setDriver] = useState("");
  const [team, setTeam] = useState("");
  const [activeTab, setActiveTab] = useState("Lap Delta");

  const sections = {
    Performance: ["Lap Delta", "Tyre Degradation"],
    "Strategy Tools": ["Pit Strategy", "Undercut Analyzer"],
    "Race Simulation": ["Race Pace Simulator", "Strategy Mode"]
  };

  // 🔥 Only these tools use global selectors
  const toolsUsingGlobalSelectors = [
    "Lap Delta",
    "Tyre Degradation",
    "Pit Strategy"
  ];

  const showGlobalSelectors = toolsUsingGlobalSelectors.includes(activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case "Lap Delta":
        return (
          <LapDeltaForm
            selectedTrack={track}
            selectedDriver={driver}
            selectedTeam={team}
          />
        );

      case "Pit Strategy":
        return (
          <PitStrategyForm
            selectedTrack={track}
            selectedDriver={driver}
            selectedTeam={team}
          />
        );

      case "Tyre Degradation":
        return (
          <TyreDegradationChart
            selectedTrack={track}
            selectedDriver={driver}
            selectedTeam={team}
          />
        );

      case "Undercut Analyzer":
        return <UndercutAnalyzer />;

      case "Race Pace Simulator":
        return <RacePaceSimulator />;

      case "Strategy Mode":
        return <StrategyMode />;

      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* ===== SIDEBAR ===== */}
      <div style={{
        width: "260px",
        background: "#111827",
        padding: "30px 20px",
        borderRight: "1px solid #1f2937"
      }}>

        <h2 style={{ color: "#3b82f6", marginBottom: "30px" }}>
          F1 Analytics
        </h2>

        {Object.entries(sections).map(([section, tabs]) => (
          <div key={section} style={{ marginBottom: "25px" }}>
            <h4 style={{ color: "#6b7280", marginBottom: "8px" }}>
              {section}
            </h4>

            {tabs.map(tab => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 12px",
                  marginBottom: "6px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: activeTab === tab ? "#1f2937" : "transparent",
                  color: activeTab === tab ? "#3b82f6" : "#9ca3af",
                  transition: "0.3s ease"
                }}
              >
                {tab}
              </div>
            ))}
          </div>
        ))}

      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ flex: 1, padding: "40px" }}>

        {/* Header */}
        <h1 style={{
          fontSize: "32px",
          marginBottom: "30px",
          background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          AI Strategy & Performance Intelligence
        </h1>

        {/* 🔥 CONDITIONAL GLOBAL SELECTORS */}
        {showGlobalSelectors && (
          <>
            <div style={{
              display: "flex",
              gap: "20px",
              marginBottom: "30px",
              flexWrap: "wrap"
            }}>
              <TrackSelector value={track} onChange={setTrack} />
              <DriverSelector value={driver} onChange={setDriver} />
              <TeamSelector value={team} onChange={setTeam} />
            </div>

            {/* Summary Panel */}
            <div style={{
              display: "flex",
              gap: "20px",
              marginBottom: "30px"
            }}>
              <div className="section-card" style={{ flex: 1 }}>
                <h4 style={{ color: "#9ca3af" }}>Track</h4>
                <p>{track || "Not Selected"}</p>
              </div>

              <div className="section-card" style={{ flex: 1 }}>
                <h4 style={{ color: "#9ca3af" }}>Driver</h4>
                <p>{driver || "Not Selected"}</p>
              </div>

              <div className="section-card" style={{ flex: 1 }}>
                <h4 style={{ color: "#9ca3af" }}>Team</h4>
                <p>{team || "Not Selected"}</p>
              </div>
            </div>
          </>
        )}

        {/* Active Module */}
        <div className="section-card">
          <div key={activeTab} className="tab-content active">
            {renderContent()}
          </div>
        </div>

      </div>
    </div>
  );
}
