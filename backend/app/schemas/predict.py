from pydantic import BaseModel


class LapDeltaRequest(BaseModel):
    tyre_life: int
    lap_number: int
    stint: int
    compound_encoded: int
    fuel_proxy: float
    race_progress: float
    track_name: str
    driver_name: str
    team_name: str


class LapDeltaResponse(BaseModel):
    lap_delta_seconds: float
