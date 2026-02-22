import pandas as pd
import joblib
from pathlib import Path
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

DATA_PATH = Path("data/processed/2023_pace_laps_with_delta.csv")
MODEL_PATH = Path("models/lap_delta_random_forest_trackaware.pkl")

TARGET = "LapDelta_seconds"

def main():
    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH)

    if TARGET not in df.columns:
        raise ValueError("LapDelta_seconds missing in dataset")

    # --------------------------------------------------
    # Generate missing features (IMPORTANT FIX)
    # --------------------------------------------------
    print("Generating FuelProxy and RaceProgress...")

    # Estimate total laps per race
    race_max_laps = df.groupby("RaceName")["LapNumber"].transform("max")

    df["FuelProxy"] = 1 - (df["LapNumber"] / race_max_laps)
    df["RaceProgress"] = df["LapNumber"] / race_max_laps

    # --------------------------------------------------
    # One-hot encode categorical columns
    # --------------------------------------------------
    print("Applying One-Hot encoding...")

    df = pd.get_dummies(
        df,
        columns=["RaceName", "Driver", "Team"],
        prefix=["Track", "Driver", "Team"]
    )

    # --------------------------------------------------
    # Base numeric features
    # --------------------------------------------------
    base_features = [
        "TyreLife",
        "TyreLifeSquared",
        "LapInStint",
        "LapNumber",
        "Stint",
        "Compound_encoded",
        "FuelProxy",
        "RaceProgress",
    ]

    # Collect all one-hot features dynamically
    one_hot_features = [
        col for col in df.columns
        if col.startswith("Track_")
        or col.startswith("Driver_")
        or col.startswith("Team_")
    ]

    FEATURES = base_features + one_hot_features

    print("Total features:", len(FEATURES))

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("Training model...")
    model = RandomForestRegressor(
        n_estimators=300,
        max_depth=18,
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)

    print("MAE:", mae)

    joblib.dump({
        "model": model,
        "features": FEATURES
    }, MODEL_PATH)

    print("Model saved to:", MODEL_PATH)


if __name__ == "__main__":
    main()
