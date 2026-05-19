import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { API_BASE } from "../api/backend";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/api/drivers`)
      .then(res => { if (!res.ok) throw new Error("Failed"); return res.json(); })
      .then(data => { setDrivers(data); setLoading(false); })
      .catch(() => { setError("Failed to load drivers."); setLoading(false); });
  }, []);

  if (loading) return <Loader text="Fetching drivers..." />;
  if (error)   return <h2 style={{ padding: "40px", color: "#ef4444" }}>{error}</h2>;

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ marginBottom: "30px", fontSize: "28px" }}>2023 Formula 1 Drivers</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "25px"
      }}>
        {drivers.map(driver => (
          <div
            key={driver.driverId}
            className="section-card"
            style={{ cursor: "pointer", transition: "0.3s ease" }}
            onClick={() => navigate(`/drivers/${driver.driverId}`)}
          >
            <h3>{driver.givenName} {driver.familyName}</h3>
            <p><strong>Nationality:</strong> {driver.nationality}</p>
            <p><strong>Number:</strong> {driver.permanentNumber}</p>
            <p><strong>DOB:</strong> {driver.dateOfBirth}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
