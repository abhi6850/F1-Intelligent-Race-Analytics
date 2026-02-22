// backend API helper functions

export async function predictLapDelta(payload) {
  const response = await fetch("http://127.0.0.1:8000/predict/lap-delta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Lap delta API failed");
  }

  return await response.json();
}

export async function getDrivers() {
  const res = await fetch("http://127.0.0.1:8000/metadata/drivers");
  if (!res.ok) throw new Error("Failed to fetch drivers");
  return res.json();
}

export async function getTeams() {
  const res = await fetch("http://127.0.0.1:8000/metadata/teams");
  if (!res.ok) throw new Error("Failed to fetch teams");
  return res.json();
}



export async function getTracks() {
  const res = await fetch("http://127.0.0.1:8000/metadata/tracks");
  if (!res.ok) {
    throw new Error("Failed to fetch tracks");
  }
  return res.json();
}

export async function getOptimalPit(payload) {
  const response = await fetch("http://127.0.0.1:8000/strategy/optimal-pit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Optimal pit API failed");
  }

  return await response.json();
}

export async function getTyreDegradation(track, driver, team) {
  const response = await fetch(
    `http://127.0.0.1:8000/analysis/tyre-degradation?track_name=${encodeURIComponent(track)}&driver_name=${driver}&team_name=${encodeURIComponent(team)}`
  );

  if (!response.ok) {
    throw new Error("Tyre degradation API failed");
  }

  return await response.json();
}

