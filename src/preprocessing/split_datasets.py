import pandas as pd
from pathlib import Path

# -----------------------------
# Paths
# -----------------------------
INPUT_PATH = Path("data/processed/2023_season_laps_clean_stage1.csv")
OUTPUT_DIR = Path("data/processed")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PACE_OUTPUT = OUTPUT_DIR / "2023_pace_laps.csv"
STRATEGY_OUTPUT = OUTPUT_DIR / "2023_strategy_laps.csv"


def is_pit_lap(df: pd.DataFrame) -> pd.Series:
    """
    Identify pit laps.
    """
    return df["PitInTime"].notna() | df["PitOutTime"].notna()


def create_pace_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """
    Pace dataset:
    - No pit laps
    - Must have Compound & TyreLife
    """
    pace_df = df.copy()

    pace_df = pace_df[~is_pit_lap(pace_df)]
    pace_df = pace_df[pace_df["Compound"].notna()]
    pace_df = pace_df[pace_df["TyreLife"].notna()]

    return pace_df


def create_strategy_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """
    Strategy dataset:
    - Pit laps allowed
    - Keep tyre & pit info
    """
    return df.copy()


def main():
    print("📥 Loading stage-1 cleaned data...")
    df = pd.read_csv(INPUT_PATH)

    print("🏎️ Creating pace dataset...")
    pace_df = create_pace_dataset(df)
    pace_df.to_csv(PACE_OUTPUT, index=False)
    print(f"✅ Pace dataset saved: {PACE_OUTPUT}")
    print(f"   Rows: {len(pace_df)}")

    print("\n🧠 Creating strategy dataset...")
    strategy_df = create_strategy_dataset(df)
    strategy_df.to_csv(STRATEGY_OUTPUT, index=False)
    print(f"✅ Strategy dataset saved: {STRATEGY_OUTPUT}")
    print(f"   Rows: {len(strategy_df)}")


if __name__ == "__main__":
    main()
