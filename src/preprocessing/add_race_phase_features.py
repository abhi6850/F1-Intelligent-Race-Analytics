import pandas as pd
from pathlib import Path

# -----------------------------
# Paths
# -----------------------------
INPUT_PATH = Path("data/processed/2023_pace_laps_with_delta.csv")
OUTPUT_DIR = Path("data/processed")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_PATH = OUTPUT_DIR / "2023_pace_laps_with_delta_phase.csv"


def main():
    print("📥 Loading Lap Delta dataset...")
    df = pd.read_csv(INPUT_PATH)

    print("🏁 Computing max laps per race...")
    max_laps = (
        df.groupby("RaceName")["LapNumber"]
        .max()
        .rename("MaxLapInRace")
    )

    df = df.merge(max_laps, on="RaceName", how="left")

    print("⛽ Creating fuel proxy feature...")
    df["FuelProxy"] = 1 - (df["LapNumber"] / df["MaxLapInRace"])

    print("🧠 Creating race phase feature...")
    df["RaceProgress"] = df["LapNumber"] / df["MaxLapInRace"]

    print("💾 Saving dataset with race-phase features...")
    df.to_csv(OUTPUT_PATH, index=False)

    print("✅ Race-phase & fuel features added")
    print(f"📁 Saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
