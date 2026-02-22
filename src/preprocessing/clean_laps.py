import pandas as pd
from pathlib import Path

# -----------------------------
# Paths
# -----------------------------
RAW_DATA_PATH = Path("data/raw/fastf1/merged/2023_season_laps_raw.csv")
PROCESSED_DIR = Path("data/processed")
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_PATH = PROCESSED_DIR / "2023_season_laps_clean_stage1.csv"


def clean_laps_stage1(df: pd.DataFrame) -> pd.DataFrame:
    """
    Stage 1 cleaning:
    - Keep only accurate laps
    - Remove deleted laps
    - Remove laps without LapTime
    - Keep everything else untouched
    """

    initial_rows = len(df)

    # Keep only accurate telemetry
    df = df[df["IsAccurate"] == True]

    # Remove deleted laps
    df = df[df["Deleted"] == False]

    # Remove laps without lap time
    df = df[df["LapTime"].notna()]

    final_rows = len(df)

    print(f"Rows before cleaning: {initial_rows}")
    print(f"Rows after cleaning:  {final_rows}")
    print(f"Removed rows:        {initial_rows - final_rows}")

    return df


def main():
    print("📥 Loading raw merged data...")
    df = pd.read_csv(RAW_DATA_PATH)

    print("🧹 Cleaning data (Stage 1)...")
    clean_df = clean_laps_stage1(df)

    print("💾 Saving cleaned data...")
    clean_df.to_csv(OUTPUT_PATH, index=False)

    print("✅ Stage 1 cleaning complete")
    print(f"📁 Saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
