from fastapi import APIRouter
from app.services.analysis_service import tyre_degradation_analysis
from app.services.analysis_service import compound_crossover_analysis

router = APIRouter(prefix="/analysis", tags=["Analysis"])
router = APIRouter()

@router.get("/tyre-degradation")
def tyre_degradation(track_name: str, driver_name: str, team_name: str):
    return tyre_degradation_analysis(track_name, driver_name, team_name)

@router.get("/compound-crossover")
def compound_crossover(track_name: str, driver_name: str, team_name: str):
    return compound_crossover_analysis(track_name, driver_name, team_name)
