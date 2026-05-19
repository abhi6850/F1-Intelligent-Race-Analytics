from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.win_probability_service import estimate_win_probability

router = APIRouter(prefix="/api/predict", tags=["Prediction"])


class WinProbRequest(BaseModel):
    driver: str
    team: str
    grid_position: int
    track_name: str
    compound_start: Optional[int] = None
    n_simulations: int = 100


@router.post("/win-probability")
def win_probability(request: WinProbRequest):
    return estimate_win_probability(
        driver=request.driver,
        team=request.team,
        grid_position=request.grid_position,
        track_name=request.track_name,
        compound_start=request.compound_start,
        n_simulations=request.n_simulations,
    )
