import { useEffect, useState } from "react";
import Loader from "../components/Loader";

const API_BASE = "http://127.0.0.1:8000";

export default function Tracks() {

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/tracks`)
      .then(res => res.json())
      .then(data => {
        console.log("Tracks API Response:", data);

        // 🔥 Critical Fix
        if (!Array.isArray(data)) {
          console.error("API did not return an array:", data);
          setError("Failed to load tracks.");
          setLoading(false);
          return;
        }

        setTracks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Network error.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader text="Loading circuits..." />;
  }

  if (error) {
    return <h2 style={{ padding: "40px", color: "red" }}>{error}</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>

      <h2 style={{
        fontSize: "30px",
        marginBottom: "30px"
      }}>
        2023 Formula 1 Circuits
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "25px"
      }}>

        {tracks.map(track => (
          <div key={track.circuitId} className="section-card">

            <h3>{track.raceName}</h3>

            <p><strong>Circuit:</strong> {track.circuitName}</p>
            <p><strong>Location:</strong> {track.locality}, {track.country}</p>
            <p><strong>Round:</strong> {track.round}</p>

            <img
              src={`/circuits/${track.circuitId}.avif`}
              alt={track.circuitName}
              onError={(e) => {
                console.warn("Image not found for:", track.circuitId);
                e.target.style.display = "none";
              }}
              style={{
                width: "100%",
                marginTop: "15px",
                borderRadius: "8px"
              }}
            />

          </div>
        ))}

      </div>

    </div>
  );
}
