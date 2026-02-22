import pandas as pd
from pathlib import Path

RAW_FASTF1_DIR = Path("data/raw/fastf1")
OUTPUT_DIR = Path("data/raw/fastf1/merged")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def merge_season(year: int):
    season_path = RAW_FASTF1_DIR / str(year)

    if not season_path.exists():
        raise FileNotFoundError(f"No data found for season {year}")

    all_races = []

    for csv_file in season_path.glob("*.csv"):
        try:
            df = pd.read_csv(csv_file)

            # Extract race name from filename
            race_name = csv_file.stem.replace(f"{year}_", "").replace("_laps", "")
            race_name = race_name.replace("_", " ").title()

            df["Year"] = year
            df["RaceName"] = race_name

            all_races.append(df)

            print(f"✅ Loaded {csv_file.name}")

        except Exception as e:
            print(f"❌ Skipped {csv_file.name}: {e}")

    merged_df = pd.concat(all_races, ignore_index=True)

    output_file = OUTPUT_DIR / f"{year}_season_laps_raw.csv"
    merged_df.to_csv(output_file, index=False)

    print("\n🎉 MERGE COMPLETE")
    print(f"Total rows: {len(merged_df)}")
    print(f"Saved to: {output_file}")


if __name__ == "__main__":
    merge_season(2023)
