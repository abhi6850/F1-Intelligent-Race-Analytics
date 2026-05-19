// Single source of truth for the backend URL.
// In dev: set VITE_API_URL in .env.local (falls back to localhost)
// In prod (Vercel): set VITE_API_URL = https://your-render-app.onrender.com

export const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ── existing helpers ──────────────────────────────────────────────

export async function predictLapDelta(payload) {
  const res = await fetch(`${API_BASE}/predict/lap-delta`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Lap delta API failed");
  return res.json();
}

export async function getDrivers() {
  const res = await fetch(`${API_BASE}/metadata/drivers`);
  if (!res.ok) throw new Error("Failed to fetch drivers");
  return res.json();
}

export async function getTeams() {
  const res = await fetch(`${API_BASE}/metadata/teams`);
  if (!res.ok) throw new Error("Failed to fetch teams");
  return res.json();
}

export async function getTracks() {
  const res = await fetch(`${API_BASE}/metadata/tracks`);
  if (!res.ok) throw new Error("Failed to fetch tracks");
  return res.json();
}

export async function getOptimalPit(payload) {
  const res = await fetch(`${API_BASE}/strategy/optimal-pit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Optimal pit API failed");
  return res.json();
}

export async function getTyreDegradation(track, driver, team) {
  const res = await fetch(
    `${API_BASE}/analysis/tyre-degradation?track_name=${encodeURIComponent(track)}&driver_name=${driver}&team_name=${encodeURIComponent(team)}`
  );
  if (!res.ok) throw new Error("Tyre degradation API failed");
  return res.json();
}

// ── new helpers (v2) ─────────────────────────────────────────────

export async function getWinProbability(payload) {
  const res = await fetch(`${API_BASE}/api/predict/win-probability`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Win probability API failed");
  return res.json();
}

export async function getMultiStopStrategy(payload) {
  const res = await fetch(`${API_BASE}/api/strategy/multi-stop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Multi-stop strategy API failed");
  return res.json();
}
