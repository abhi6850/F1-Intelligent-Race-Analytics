from fastapi import APIRouter
from app.services.race_simulator_service import simulate_race

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.get("/race-simulator")
def race_simulator_route(
    track_name: str,
    driver_a: str,
    team_a: str,
    driver_b: str,
    team_b: str,
    compound_a: int,
    compound_b: int,
    pit_lap_a: int = 20,
    pit_lap_b: int = 22,
):
    return simulate_race(
        track_name,
        driver_a,
        team_a,
        driver_b,
        team_b,
        compound_a,
        compound_b,
        pit_lap_a,
        pit_lap_b,
    )

