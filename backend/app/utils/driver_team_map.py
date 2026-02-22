
from fastapi import HTTPException
# 2023 Season Mapping

DRIVER_TEAM_MAP = {
    "VER": "Red Bull Racing",
    "PER": "Red Bull Racing",

    "HAM": "Mercedes",
    "RUS": "Mercedes",

    "LEC": "Ferrari",
    "SAI": "Ferrari",

    "NOR": "McLaren",
    "PIA": "McLaren",

    "ALO": "Aston Martin",
    "STR": "Aston Martin",

    "OCO": "Alpine",
    "GAS": "Alpine",

    "TSU": "AlphaTauri",
    "RIC": "AlphaTauri",
    "LAW": "AlphaTauri",

    "ALB": "Williams",
    "SAR": "Williams",

    "BOT": "Alfa Romeo",
    "ZHO": "Alfa Romeo",

    "HUL": "Haas",
    "MAG": "Haas"
}

def validate_driver_team(driver: str, team: str):
    expected_team = DRIVER_TEAM_MAP.get(driver)

    if not expected_team:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown driver: {driver}"
        )

    if expected_team != team:
        raise HTTPException(
            status_code=400,
            detail=f"Driver {driver} does not drive for {team}. Expected team: {expected_team}"
        )

