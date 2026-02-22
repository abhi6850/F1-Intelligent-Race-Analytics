from fastapi import APIRouter
from app.schemas.strategy import OptimalPitRequest, OptimalPitResponse
from app.services.strategy_service import optimal_pit_strategy

router = APIRouter()


@router.post("/optimal-pit", response_model=OptimalPitResponse)
def optimal_pit(request: OptimalPitRequest):

    result = optimal_pit_strategy(
        total_laps=request.total_laps,
        current_lap=request.current_lap,
        current_tyre_life=request.current_tyre_life,
        stint=request.stint,
        compound_encoded=request.compound_encoded,
        track_name=request.track_name,
        driver_name=request.driver_name,
        team_name=request.team_name,
    )

    return result
