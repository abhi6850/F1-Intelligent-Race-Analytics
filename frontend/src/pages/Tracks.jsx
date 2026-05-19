import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { API_BASE } from "../api/backend";

export default function Tracks() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/tracks`)
      .then(res => { if (!res.ok) throw new Error("Failed"); return res.json(); })
      .then(data => {
        if (!Array.isArray(data)) { setError("Failed to load tracks."); setLoading(false); return; }
        setTracks(data);
        setLoading(false);
      })
      .catch(() => { setError("Network error."); setLoading(false); });
  }, []);

  if (loading) return <Loader text="Loading circuits..." />;
  if (error)   return <h2 style={{ padding: "40px", color: "red" }}>{error}</h2>;

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ fontSize: "30px", marginBottom: "30px" }}>2023 Formula 1 Circuits</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
        {tracks.map(track => (
          <div key={track.circuitId} className="section-card">
            <h3>{track.raceName}</h3>
            <p><strong>Circuit:</strong> {track.circuitName}</p>
            <p><strong>Location:</strong> {track.locality}, {track.country}</p>
            <p><strong>Round:</strong> {track.round}</p>
            <img
              src={`/circuits/${track.circuitId}.avif`}
              alt={track.circuitName}
              onError={e => e.target.style.display = "none"}
              style={{ width: "100%", marginTop: "15px", borderRadius: "8px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
