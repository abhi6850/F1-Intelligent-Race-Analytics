import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const API_BASE = "http://127.0.0.1:8000";

export default function Drivers() {

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/api/drivers`)
      .then(res => res.json())
      .then(data => {
        setDrivers(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader text="Fetching drivers..." />;
  }

  return (
    <div style={{ padding: "40px" }}>

      <h2 style={{
        marginBottom: "30px",
        fontSize: "28px"
      }}>
        2023 Formula 1 Drivers
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "25px"
      }}>
        {drivers.map(driver => (
          <div
            key={driver.driverId}
            className="section-card"
            style={{
              cursor: "pointer",
              transition: "0.3s ease"
            }}
            onClick={() => navigate(`/drivers/${driver.driverId}`)}
          >
            <h3>
              {driver.givenName} {driver.familyName}
            </h3>

            <p><strong>Nationality:</strong> {driver.nationality}</p>
            <p><strong>Number:</strong> {driver.permanentNumber}</p>
            <p><strong>DOB:</strong> {driver.dateOfBirth}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
