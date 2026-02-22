export default function StrategySelectors({
  driver,
  setDriver,
  track,
  setTrack
}) {
  const drivers = [
    { label: "Max Verstappen", value: 1 },
    { label: "Lewis Hamilton", value: 2 },
    { label: "Charles Leclerc", value: 3 },
    { label: "Lando Norris", value: 4 },
    { label: "Fernando Alonso", value: 5 }
  ];

  const tracks = [
    { label: "Bahrain GP", value: "bahrain" },
    { label: "Saudi Arabian GP", value: "jeddah" },
    { label: "Australian GP", value: "melbourne" },
    { label: "Monaco GP", value: "monaco" },
    { label: "British GP", value: "silverstone" }
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        marginBottom: "20px",
        flexWrap: "wrap"
      }}
    >
      <div>
        <label><b>Driver</b></label><br />
        <select
          value={driver}
          onChange={(e) => setDriver(e.target.value)}
        >
          <option value="">Select Driver</option>
          {drivers.map(d => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label><b>Track</b></label><br />
        <select
          value={track}
          onChange={(e) => setTrack(e.target.value)}
        >
          <option value="">Select Track</option>
          {tracks.map(t => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
