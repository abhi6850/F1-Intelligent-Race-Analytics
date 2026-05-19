from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.multi_stop_service import plan_multi_stop_strategy

router = APIRouter(prefix="/api/strategy", tags=["Strategy"])


class MultiStopRequest(BaseModel):
    track_name: str
    driver: str
    team: str
    grid_position: Optional[int] = 1


@router.post("/multi-stop")
def multi_stop_strategy(request: MultiStopRequest):
    return plan_multi_stop_strategy(
        track_name=request.track_name,
        driver=request.driver,
        team=request.team,
        grid_position=request.grid_position,
    )
