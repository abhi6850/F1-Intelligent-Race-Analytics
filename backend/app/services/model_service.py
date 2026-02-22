from pathlib import Path
import joblib
import pandas as pd
import numpy as np
from fastapi import HTTPException
from app.utils.driver_team_map import validate_driver_team


# --------------------------------------------------
# Load Model
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[3]
MODEL_PATH = BASE_DIR / "models" / "lap_delta_driveraware_v3_final.pkl"

loaded_obj = joblib.load(MODEL_PATH)
model = loaded_obj["model"]
driver_encoder = loaded_obj["driver_encoder"]
team_encoder = loaded_obj["team_encoder"]

# Clean encoder labels
driver_encoder.classes_ = np.array(
    [cls.strip() for cls in driver_encoder.classes_]
)

team_encoder.classes_ = np.array(
    [cls.strip() for cls in team_encoder.classes_]
)

FEATURES = list(model.feature_names_in_)


# --------------------------------------------------
# Safe Encoding
# --------------------------------------------------

def encode_driver(driver_name: str) -> int:
    driver_clean = driver_name.strip()

    if driver_clean not in driver_encoder.classes_:
        raise HTTPException(
            status_code=400,
            detail=f"Driver '{driver_clean}' not found."
        )

    return driver_encoder.transform([driver_clean])[0]


def encode_team(team_name: str) -> int:
    team_clean = team_name.strip()

    if team_clean not in team_encoder.classes_:
        raise HTTPException(
            status_code=400,
            detail=f"Team '{team_clean}' not found."
        )

    return team_encoder.transform([team_clean])[0]


# --------------------------------------------------
# Single Prediction (Existing Logic – Kept Intact)
# --------------------------------------------------

def predict_lap_delta(features: dict) -> float:

    validate_driver_team(
        features["driver_name"],
        features["team_name"]
    )

    required_keys = [
        "tyre_life",
        "lap_number",
        "stint",
        "compound_encoded",
        "fuel_proxy",
        "race_progress",
        "driver_name",
        "team_name",
    ]

    for key in required_keys:
        if key not in features:
            raise KeyError(f"Missing required feature: {key}")

    tyre_life = features["tyre_life"]

    driver_encoded = encode_driver(features["driver_name"])
    team_encoded = encode_team(features["team_name"])

    row = {
        "TyreLife": tyre_life,
        "TyreLifeSquared": tyre_life ** 2,
        "LapNumber": features["lap_number"],
        "Stint": features["stint"],
        "Compound_encoded": features["compound_encoded"],
        "Driver_encoded": driver_encoded,
        "Team_encoded": team_encoded,
        "FuelProxy": features["fuel_proxy"],
        "RaceProgress": features["race_progress"],
    }

    X = pd.DataFrame([row])
    X = X.reindex(columns=FEATURES, fill_value=0)

    return float(model.predict(X)[0])


# --------------------------------------------------
# Batch Prediction (NEW – Performance Optimized)
# --------------------------------------------------

def predict_lap_delta_batch(feature_rows: list) -> list:
    """
    Fast batch prediction.
    Accepts list of feature dictionaries.
    Returns list of predictions.
    """

    if not feature_rows:
        return []

    rows = []

    # Encode driver & team only once per unique combination
    driver_name = feature_rows[0]["driver_name"]
    team_name = feature_rows[0]["team_name"]

    validate_driver_team(driver_name, team_name)

    driver_encoded = encode_driver(driver_name)
    team_encoded = encode_team(team_name)

    for features in feature_rows:

        tyre_life = features["tyre_life"]

        row = {
            "TyreLife": tyre_life,
            "TyreLifeSquared": tyre_life ** 2,
            "LapNumber": features["lap_number"],
            "Stint": features["stint"],
            "Compound_encoded": features["compound_encoded"],
            "Driver_encoded": driver_encoded,
            "Team_encoded": team_encoded,
            "FuelProxy": features["fuel_proxy"],
            "RaceProgress": features["race_progress"],
        }

        rows.append(row)

    X = pd.DataFrame(rows)
    X = X.reindex(columns=FEATURES, fill_value=0)

    predictions = model.predict(X)

    return predictions.tolist()
