from pydantic import BaseModel


class UndercutRequest(BaseModel):
    track_name: str
    driver_a: str
    team_a: str
    driver_b: str
    team_b: str
    base_pit_lap: int
    undercut_delta: int
    compound_a: int
    compound_b: int
