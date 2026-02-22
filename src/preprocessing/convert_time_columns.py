import pandas as pd
from pathlib import Path

# -----------------------------
# Paths
# -----------------------------
INPUT_PATH = Path("data/processed/2023_pace_laps.csv")
OUTPUT_DIR = Path("data/processed")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_PATH = OUTPUT_DIR / "2023_pace_laps_seconds.csv"

# -----------------------------
# Time columns to convert
# -----------------------------
TIME_COLUMNS = [
    "LapTime",
    "Sector1Time",
    "Sector2Time",
    "Sector3Time",
]


def convert_timedelta_to_seconds(df: pd.DataFrame, columns: list) -> pd.DataFrame:
    """
    Convert timedelta-like columns to seconds (float).
    """
    df = df.copy()

    for col in columns:
        if col in df.columns:
            print(f"⏱️ Converting {col} to seconds...")
            df[col + "_seconds"] = pd.to_timedelta(df[col]).dt.total_seconds()

    return df


def main():
    print("📥 Loading pace dataset...")
    df = pd.read_csv(INPUT_PATH)

    print("🔄 Converting time columns...")
    df_converted = convert_timedelta_to_seconds(df, TIME_COLUMNS)

    print("💾 Saving converted dataset...")
    df_converted.to_csv(OUTPUT_PATH, index=False)

    print("✅ Time conversion complete")
    print(f"📁 Saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
