import { useState } from "react";
import { predictLapDelta } from "../api/backend";
import LapDeltaChart from "./LapDeltaChart";

export default function LapDeltaForm({
  selectedTrack,
  selectedDriver,
  selectedTeam
}) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lapDeltas, setLapDeltas] = useState([]);

  const handlePredict = async () => {
    if (!selectedTrack || !selectedDriver || !selectedTeam) {
      setError("Please select track, driver and team.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setLapDeltas([]);

    try {
      const res = await predictLapDelta({
        tyre_life: 12,
        lap_number: 25,
        stint: 2,
        compound_encoded: 1,
        fuel_proxy: 0.45,
        race_progress: 0.5,
        track_name: selectedTrack,
        driver_name: selectedDriver,
        team_name: selectedTeam
      });

      const delta = res.lap_delta_seconds;
      setResult(delta);

      // Generate lap series visualization
      const series = [];
      for (let lap = 1; lap <= 60; lap++) {
        series.push({
          lap,
          delta: delta + (lap * 0.002)
        });
      }

      setLapDeltas(series);

    } catch (err) {
      console.error("Lap Delta Error:", err);

      // 🔥 Extract backend error message properly
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Prediction failed. Please try again.");
      }
    }

    setLoading(false);
  };

  const isFaster = result !== null && result < 0;

  return (
    <div className="card">
      <h3>Lap Delta Prediction</h3>
      <p className="module-description">
        Predicts how much faster or slower a car will be on a lap based on track, driver, tyres and race conditions.
      </p>


      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Predicting..." : "Predict Lap Delta"}
      </button>

      {result !== null && (
        <p style={{ color: isFaster ? "green" : "red", fontWeight: "bold" }}>
          {isFaster ? "🚀 Faster lap by" : "⚠ Slower lap by"}{" "}
          {Math.abs(result).toFixed(3)} sec
        </p>
      )}

      {error && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            background: "#2b1a1a",
            border: "1px solid #ff4d4d",
            borderRadius: "6px",
            color: "#ff4d4d"
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Chart */}
      {lapDeltas.length > 0 && (
        <LapDeltaChart lapDeltas={lapDeltas} />
      )}
    </div>
  );
}
