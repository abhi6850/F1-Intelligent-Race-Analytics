import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import numpy as np

# -----------------------------
# Paths
# -----------------------------
DATA_PATH = Path("data/processed/2023_pace_laps_with_delta.csv")
MODEL_DIR = Path("models")
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = MODEL_DIR / "lap_delta_random_forest_prelap.pkl"

# -----------------------------
# Features & target
# -----------------------------
FEATURES = [
    "TyreLife",
    "TyreLifeSquared",
    "LapInStint",
    "LapNumber",
    "Stint",
    "Compound_encoded",
    "Driver_encoded",
    "Team_encoded",
]

TARGET = "LapDelta_seconds"


def main():
    print("📥 Loading Lap Delta dataset...")
    df = pd.read_csv(DATA_PATH)

    X = df[FEATURES]
    y = df[TARGET]

    print("🔀 Train / test split...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("🌲 Training Random Forest (Lap Delta)...")
    model = RandomForestRegressor(
        n_estimators=400,
        max_depth=None,
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train, y_train)

    print("📊 Evaluating model...")
    y_pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print("\n✅ PRE-LAP LAP DELTA MODEL PERFORMANCE")
    print(f"MAE  (sec): {mae:.3f}")
    print(f"RMSE (sec): {rmse:.3f}")
    print(f"R² score : {r2:.4f}")

    print("\n💾 Saving model...")
    joblib.dump(model, MODEL_PATH)
    print(f"📁 Model saved at: {MODEL_PATH}")


if __name__ == "__main__":
    main()
