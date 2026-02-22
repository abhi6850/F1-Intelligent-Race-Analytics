from pydantic import BaseModel
from typing import List, Optional


class OptimalPitRequest(BaseModel):
    total_laps: int
    current_lap: int
    current_tyre_life: int
    stint: int
    compound_encoded: int
    track_name: str
    driver_name: str
    team_name: str



class StrategyPoint(BaseModel):
    pit_lap: int
    total_delta: float


class OptimalPitResponse(BaseModel):
    optimal_pit_lap: int
    expected_total_delta: float
    strategy_curve: List[StrategyPoint]
