import { useEffect, useState } from "react";
import { getTracks } from "../api/backend";

export default function TrackSelector({ value, onChange }) {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    async function fetchTracks() {
      try {
        const data = await getTracks();
        setTracks(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchTracks();
  }, []);

  return (
    <div style={{ marginBottom: "15px" }}>
      <label>Track: </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select Track</option>

        {tracks.map((track) => (
          <option key={track.RaceName} value={track.RaceName}>
            {track.RaceName}
          </option>
        ))}
      </select>
    </div>
  );
}
