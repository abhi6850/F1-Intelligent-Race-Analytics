import pandas as pd
from pathlib import Path
from sklearn.preprocessing import LabelEncoder

# -----------------------------
# Paths
# -----------------------------
INPUT_PATH = Path("data/processed/2023_pace_laps_seconds.csv")
OUTPUT_DIR = Path("data/processed")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_PATH = OUTPUT_DIR / "2023_pace_laps_features.csv"


def add_lap_in_stint(df: pd.DataFrame) -> pd.DataFrame:
    df = df.sort_values(["RaceName", "Driver", "Stint", "LapNumber"])
    df["LapInStint"] = df.groupby(
        ["RaceName", "Driver", "Stint"]
    ).cumcount() + 1
    return df


def encode_categorical(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    for col in ["Compound", "Driver", "Team"]:
        encoder = LabelEncoder()
        df[col + "_encoded"] = encoder.fit_transform(df[col])

    return df


def one_hot_tracks(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    track_dummies = pd.get_dummies(df["RaceName"], prefix="Track")
    df = pd.concat([df, track_dummies], axis=1)
    return df


def feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # Tyre degradation curvature
    df["TyreLifeSquared"] = df["TyreLife"] ** 2

    # Lap in stint
    df = add_lap_in_stint(df)

    # Encode non-track categorical
    df = encode_categorical(df)

    # One-hot encode tracks
    df = one_hot_tracks(df)

    return df


def main():
    print("Loading dataset...")
    df = pd.read_csv(INPUT_PATH)

    print("Engineering features...")
    df_features = feature_engineering(df)

    print("Saving dataset...")
    df_features.to_csv(OUTPUT_PATH, index=False)

    print("Feature engineering complete")
    print(f"Saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
