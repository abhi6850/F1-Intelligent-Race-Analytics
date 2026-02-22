from fastapi import APIRouter
from app.schemas.undercut_schema import UndercutRequest
from app.services.undercut_service import analyze_undercut

router = APIRouter()


@router.post("/undercut")
def analyze(request: UndercutRequest):

    return analyze_undercut(
        track_name=request.track_name,
        driver_a=request.driver_a,
        team_a=request.team_a,
        driver_b=request.driver_b,
        team_b=request.team_b,
        base_pit_lap=request.base_pit_lap,
        undercut_delta=request.undercut_delta,
        compound_a=request.compound_a,
        compound_b=request.compound_b,
    )
