import fastf1
import pandas as pd
from pathlib import Path

# -----------------------------
# Enable FastF1 Cache
# -----------------------------
CACHE_DIR = Path("data/raw/fastf1")
CACHE_DIR.mkdir(parents=True, exist_ok=True)
fastf1.Cache.enable_cache(CACHE_DIR)

# -----------------------------
# Load laps for one race
# -----------------------------
def load_race_laps(year: int, race_name: str, session: str = "R"):
    session_data = fastf1.get_session(year, race_name, session)
    session_data.load()
    return session_data.laps


# -----------------------------
# Load all races for a season
# -----------------------------
def collect_season_laps(year: int):
    schedule = fastf1.get_event_schedule(year)

    season_dir = Path(f"data/raw/fastf1/{year}")
    season_dir.mkdir(parents=True, exist_ok=True)

    for _, event in schedule.iterrows():
        race_name = event["EventName"]

        try:
            print(f"📥 Collecting {year} {race_name}...")
            laps = load_race_laps(year, race_name)

            file_name = race_name.replace(" ", "_").lower()
            output_path = season_dir / f"{year}_{file_name}_laps.csv"

            laps.to_csv(output_path, index=False)
            print(f"✅ Saved: {output_path}")

        except Exception as e:
            print(f"❌ Skipped {race_name}: {e}")


# -----------------------------
# Run script
# -----------------------------
if __name__ == "__main__":
    collect_season_laps(2023)
