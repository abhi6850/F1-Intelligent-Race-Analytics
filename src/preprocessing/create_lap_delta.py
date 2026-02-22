import pandas as pd
from pathlib import Path

DATA_PATH = Path("data/processed/2023_pace_laps_features.csv")
OUTPUT_PATH = Path("data/processed/2023_pace_laps_with_delta.csv")

def main():
    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH)

    print("Calculating best lap per driver per race...")

    # Best lap per driver per race
    df["BestLap"] = df.groupby(
        ["Driver", "RaceName"]
    )["LapTime_seconds"].transform("min")

    # Lap Delta calculation
    df["LapDelta_seconds"] = df["LapTime_seconds"] - df["BestLap"]

    # Drop helper column
    df.drop(columns=["BestLap"], inplace=True)

    print("Saving updated dataset...")
    df.to_csv(OUTPUT_PATH, index=False)

    print("Done. LapDelta_seconds created.")

if __name__ == "__main__":
    main()
