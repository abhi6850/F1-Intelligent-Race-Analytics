import { useEffect, useState } from "react";
import { getTeams } from "../api/backend";

export default function TeamSelector({ value, onChange }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchTeams();
  }, []);

  return (
    <div style={{ marginBottom: "15px" }}>
      <label>Team: </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select Team</option>

        {teams.map((team) => (
          <option key={team.Team} value={team.Team}>
            {team.Team}
          </option>
        ))}
      </select>
    </div>
  );
}
