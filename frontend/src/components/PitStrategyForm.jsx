import { useState } from "react";
import { getOptimalPit } from "../api/backend";
import StrategyCurveChart from "./StrategyCurveChart";

export default function PitStrategyForm({
  selectedTrack,
  selectedDriver,
  selectedTeam
}) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompute = async () => {
    if (!selectedTrack || !selectedDriver || !selectedTeam) {
      setError("Please select driver, team, and track");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        total_laps: 60,
        current_lap: 18,
        current_tyre_life: 12,
        stint: 1,
        compound_encoded: 1,

        // ✅ send state directly
        track_name: selectedTrack,
        driver_name: selectedDriver,
        team_name: selectedTeam,
      };

      console.log("STRATEGY PAYLOAD:", payload);

      const res = await getOptimalPit(payload);

      setResult(res);
    } catch (err) {
      console.error(err);
      setError("Strategy computation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "30px", padding: "15px", border: "1px solid #ccc" }}>
      <h3>Optimal Pit Strategy</h3>
      <p className="module-description">
        Calculates the best lap to pit and tyre choice to minimize total race time.
      </p>

      <button onClick={handleCompute} disabled={loading}>
        {loading ? "Computing..." : "Compute Strategy"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "15px" }}>
          <p>
            🛠 <b>Optimal Pit Lap:</b> {result.optimal_pit_lap}
          </p>
          <p>
            📉 <b>Total Race Delta:</b>{" "}
            <span style={{ color: "green", fontWeight: "bold" }}>
              {result.expected_total_delta.toFixed(2)} sec
            </span>
          </p>
        </div>
      )}

      {result?.strategy_curve && (
        <StrategyCurveChart
          data={result.strategy_curve}
          optimalLap={result.optimal_pit_lap}
        />
      )}
    </div>
  );
}
