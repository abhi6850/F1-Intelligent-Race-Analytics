from pathlib import Path
import numpy as np
import pandas as pd
from fastapi import HTTPException
from app.utils.driver_team_map import validate_driver_team

BASE_DIR   = Path(__file__).resolve().parents[3]
MODEL_PATH = BASE_DIR / "models" / "lap_delta_driveraware_v3_final.pkl"

_model          = None
_driver_encoder = None
_team_encoder   = None
_features       = None
DEMO_MODE       = False

try:
    import joblib
    loaded_obj      = joblib.load(MODEL_PATH)
    _model          = loaded_obj["model"]
    _driver_encoder = loaded_obj["driver_encoder"]
    _team_encoder   = loaded_obj["team_encoder"]
    _driver_encoder.classes_ = np.array([c.strip() for c in _driver_encoder.classes_])
    _team_encoder.classes_   = np.array([c.strip() for c in _team_encoder.classes_])
    _features = list(_model.feature_names_in_)
    print("✅  RandomForest model loaded")
except FileNotFoundError:
    DEMO_MODE = True
    print("⚠️   Model file not found — running in DEMO MODE")
except Exception as e:
    DEMO_MODE = True
    print(f"⚠️   Model load error ({e}) — running in DEMO MODE")

_COMPOUND_BASE = {0: 0.35, 1: 0.55, 2: 0.75}
_COMPOUND_DEG  = {0: 0.045, 1: 0.028, 2: 0.016}
_CLIFF_LAP     = {0: 18, 1: 25, 2: 35}
_CLIFF_FACTOR  = {0: 0.012, 1: 0.007, 2: 0.003}

_TEAM_OFFSET = {
    "Red Bull Racing": -0.38, "Mercedes": -0.14, "Ferrari": -0.12,
    "McLaren": -0.08, "Aston Martin": -0.04, "Alpine": 0.06,
    "AlphaTauri": 0.12, "Alfa Romeo": 0.14, "Haas": 0.16, "Williams": 0.20,
}

_DRIVER_OFFSET = {
    "VER": -0.18, "PER": 0.04, "HAM": -0.06, "RUS": 0.02,
    "LEC": -0.05, "SAI": 0.01, "NOR": -0.04, "PIA": 0.03,
    "ALO": -0.09, "STR": 0.07, "OCO": 0.01, "GAS": 0.02,
    "BOT": 0.03,  "ZHO": 0.05, "MAG": 0.02, "HUL": 0.01,
    "TSU": 0.02,  "RIC": 0.04, "LAW": 0.05, "ALB": 0.01,
    "SAR": 0.06,  "DEV": 0.06,
}

def _physics_delta(tyre_life, compound_encoded, fuel_proxy, race_progress, driver_name, team_name):
    c     = compound_encoded
    delta = _COMPOUND_BASE.get(c, 0.55)
    delta += _COMPOUND_DEG[c] * tyre_life
    cliff  = max(0, tyre_life - _CLIFF_LAP[c])
    delta += _CLIFF_FACTOR[c] * (cliff ** 1.6)
    delta -= 0.08 * race_progress
    delta += _TEAM_OFFSET.get(team_name, 0.10)
    delta += _DRIVER_OFFSET.get(driver_name, 0.03)
    rng    = np.random.default_rng(int(tyre_life * 31 + compound_encoded * 7))
    delta += rng.normal(0, 0.015)
    return max(delta, 0.10)

def encode_driver(driver_name):
    d = driver_name.strip()
    if d not in _driver_encoder.classes_:
        raise HTTPException(status_code=400, detail=f"Driver '{d}' not found.")
    return int(_driver_encoder.transform([d])[0])

def encode_team(team_name):
    t = team_name.strip()
    if t not in _team_encoder.classes_:
        raise HTTPException(status_code=400, detail=f"Team '{t}' not found.")
    return int(_team_encoder.transform([t])[0])

def predict_lap_delta(features: dict) -> float:
    validate_driver_team(features["driver_name"], features["team_name"])
    if DEMO_MODE:
        return _physics_delta(
            features["tyre_life"], features["compound_encoded"],
            features.get("fuel_proxy", 0.5), features.get("race_progress", 0.5),
            features["driver_name"], features["team_name"],
        )
    tyre_life = features["tyre_life"]
    row = {
        "TyreLife": tyre_life, "TyreLifeSquared": tyre_life**2,
        "LapNumber": features["lap_number"], "Stint": features["stint"],
        "Compound_encoded": features["compound_encoded"],
        "Driver_encoded": encode_driver(features["driver_name"]),
        "Team_encoded": encode_team(features["team_name"]),
        "FuelProxy": features["fuel_proxy"], "RaceProgress": features["race_progress"],
    }
    X = pd.DataFrame([row]).reindex(columns=_features, fill_value=0)
    return float(_model.predict(X)[0])

def predict_lap_delta_batch(feature_rows: list) -> list:
    if not feature_rows:
        return []
    driver_name = feature_rows[0]["driver_name"]
    team_name   = feature_rows[0]["team_name"]
    validate_driver_team(driver_name, team_name)
    if DEMO_MODE:
        return [
            _physics_delta(
                f["tyre_life"], f["compound_encoded"],
                f.get("fuel_proxy", 0.5), f.get("race_progress", 0.5),
                driver_name, team_name,
            )
            for f in feature_rows
        ]
    driver_encoded = encode_driver(driver_name)
    team_encoded   = encode_team(team_name)
    rows = [{
        "TyreLife": f["tyre_life"], "TyreLifeSquared": f["tyre_life"]**2,
        "LapNumber": f["lap_number"], "Stint": f["stint"],
        "Compound_encoded": f["compound_encoded"],
        "Driver_encoded": driver_encoded, "Team_encoded": team_encoded,
        "FuelProxy": f["fuel_proxy"], "RaceProgress": f["race_progress"],
    } for f in feature_rows]
    X = pd.DataFrame(rows).reindex(columns=_features, fill_value=0)
    return _model.predict(X).tolist()