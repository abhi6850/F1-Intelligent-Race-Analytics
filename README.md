# 🏁 F1 Intelligent Race Analytics

> AI-powered race strategy and performance prediction platform built on 2023 Formula 1 telemetry data.

**🌐 Live Demo:** [https://f1-intelligent-race-analytics.netlify.app](https://f1-intelligent-race-analytics.netlify.app)

---

## Overview

F1 Intelligent Race Analytics is a full-stack machine learning platform that simulates and predicts Formula 1 race outcomes. Given a driver, starting grid position, and circuit, it runs Monte Carlo simulations against the full 2023 grid to return win probability, podium probability, optimal tyre strategy, and lap-by-lap race pace analysis.

Built as a portfolio project to demonstrate applied ML, REST API design, and modern React frontend development.

---

## Features

| Feature | Description |
|---|---|
| 🏆 **Race Win Predictor** | Grid position + driver + track → win/podium probability via 80-run Monte Carlo simulation |
| 🔧 **Multi-Stop Strategy Planner** | Exhaustively evaluates all 1-stop and 2-stop compound combinations to find the minimum-time strategy |
| ⏱ **Pit Window Optimizer** | Finds the optimal pit lap given current tyre life, compound, and race situation |
| 📊 **Lap Delta Predictor** | Predicts lap time delta per lap using the trained RandomForest model |
| 🔁 **Undercut Analyzer** | Simulates whether pitting early gains track position over a rival |
| 🏁 **Race Pace Simulator** | Lap-by-lap gap evolution between two drivers under different strategies |
| 📈 **Tyre Degradation Charts** | Degradation curves per compound across full race distance |
| 👨‍🏎️ **Driver Stats** | Full 2023 season stats per driver from the Ergast/Jolpica API |
| 🏗️ **Constructor Standings** | 2023 Constructors' Championship with team cards |
| 🗺️ **Tracks & History** | All 22 circuits and F1 history eras |

---

## Tech Stack

**Frontend**
- React 18 + Vite
- React Router DOM
- Recharts (data visualisation)
- Deployed on **Netlify**

**Backend**
- FastAPI (Python)
- Uvicorn ASGI server
- Pandas + NumPy
- Scikit-learn (RandomForestRegressor)
- Deployed on **Render**

**ML Model**
- Algorithm: `RandomForestRegressor` (300 trees, max depth 18)
- Trained on: 2023 F1 lap-level telemetry
- Target: `LapDelta_seconds` (deviation from reference lap)
- MAE: ~0.42 seconds
- Features: TyreLife, TyreLifeSquared, LapNumber, Stint, Compound, Driver, Team, FuelProxy, RaceProgress

---

## Project Structure

```
F1-Intelligent-Race-Analytics/
├── backend/
│   ├── app/
│   │   ├── constants/       # Track laps, pit loss times per circuit
│   │   ├── routes/          # FastAPI route handlers
│   │   ├── services/        # ML prediction, strategy, simulation logic
│   │   ├── schemas/         # Pydantic request/response models
│   │   ├── utils/           # Driver-team mappings
│   │   └── main.py          # App entry point + CORS config
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/             # Centralized API helper (VITE_API_URL)
│   │   ├── components/      # All analytics tool components
│   │   ├── pages/           # Route-level pages
│   │   └── styles/          # Global CSS design system
│   ├── vite.config.js
│   └── package.json
├── netlify.toml             # Netlify build + redirect config
├── render.yaml              # Render backend deploy config
└── .gitignore
```

---

## Running Locally

**Prerequisites:** Python 3.10+, Node.js 18+

**1. Clone the repo**
```bash
git clone https://github.com/abhi6850/F1-Intelligent-Race-Analytics.git
cd F1-Intelligent-Race-Analytics
```

**2. Start the backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Backend runs at `http://127.0.0.1:8000`
API docs at `http://127.0.0.1:8000/docs`

**3. Start the frontend**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

> **Note:** The trained `.pkl` model file is excluded from the repo due to size. Without it, the backend runs in **Demo Mode** using a physics-based fallback model calibrated from 2023 season data. All features remain fully functional.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/predict/win-probability` | Win/podium probability via Monte Carlo |
| `POST` | `/api/strategy/multi-stop` | 1-stop vs 2-stop strategy comparison |
| `POST` | `/predict/lap-delta` | Single lap delta prediction |
| `POST` | `/strategy/optimal-pit` | Optimal pit window finder |
| `POST` | `/analysis/undercut` | Undercut simulation |
| `GET` | `/analysis/tyre-degradation` | Tyre degradation curves |
| `GET` | `/drivers/{driverId}/stats` | Driver season statistics |
| `GET` | `/health` | Health check |

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Netlify | https://f1-intelligent-race-analytics.netlify.app |
| Backend | Render | https://f1-intelligent-race-analytics.onrender.com |

Environment variables required:

**Netlify:**
```
VITE_API_URL=https://f1-intelligent-race-analytics.onrender.com
```

**Render:**
```
ALLOWED_ORIGINS=https://f1-intelligent-race-analytics.netlify.app
```

---

## Data & Model

- **Data source:** 2023 F1 lap telemetry collected via the FastF1 Python library
- **Training data:** ~15,000 lap records across all 22 rounds of the 2023 season
- **Season coverage:** All 20 drivers, all 22 circuits, all tyre compounds
- **Model file:** `models/lap_delta_driveraware_v3_final.pkl` (excluded from repo)

---

## Author

**Abhijeet Kulkarni**
B.Tech Computer Science & Engineering — Manipal Institute of Technology, Bengaluru

[![GitHub](https://img.shields.io/badge/GitHub-abhi6850-181717?style=flat&logo=github)](https://github.com/abhi6850)

---

## License

This project is for educational and portfolio purposes. F1 data used under FastF1's open data terms.
