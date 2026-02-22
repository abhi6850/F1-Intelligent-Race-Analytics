import pandas as pd
from pathlib import Path

DATA_PATH = Path("../data/processed/2023_pace_laps_features.csv")


def get_tracks():
    df = pd.read_csv(DATA_PATH)

    if "RaceName" not in df.columns:
        raise ValueError("RaceName column not found in dataset.")

    tracks = (
        df[["RaceName"]]
        .drop_duplicates()
        .sort_values("RaceName")
        .to_dict(orient="records")
    )

    return tracks


def get_drivers():
    df = pd.read_csv(DATA_PATH)

    drivers = (
        df[["Driver", "Driver_encoded"]]
        .drop_duplicates()
        .sort_values("Driver")
        .to_dict(orient="records")
    )

    return drivers


def get_teams():
    df = pd.read_csv(DATA_PATH)

    teams = (
        df[["Team", "Team_encoded"]]
        .drop_duplicates()
        .sort_values("Team")
        .to_dict(orient="records")
    )

    return teams
