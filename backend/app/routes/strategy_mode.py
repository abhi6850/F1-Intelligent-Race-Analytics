from fastapi import APIRouter
from app.schemas.strategy_mode_schema import StrategyModeRequest
from app.services.strategy_mode_service import compare_strategies

router = APIRouter()


@router.post("/strategy-mode")
def strategy_mode(request: StrategyModeRequest):

    return compare_strategies(
        request.track_name,
        request.strategy_a,
        request.strategy_b
    )
