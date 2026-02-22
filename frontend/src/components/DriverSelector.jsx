import { useEffect, useState } from "react";
import { getDrivers } from "../api/backend";

export default function DriverSelector({ value, onChange }) {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const data = await getDrivers();
        setDrivers(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchDrivers();
  }, []);

  return (
    <div style={{ marginBottom: "15px" }}>
      <label>Driver: </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select Driver</option>

        {drivers.map((driver) => (
          <option key={driver.Driver} value={driver.Driver}>
            {driver.Driver}
          </option>
        ))}
      </select>
    </div>
  );
}
