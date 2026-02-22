from pydantic import BaseModel


class Strategy(BaseModel):
    driver: str
    team: str
    compound_start: int
    compound_after: int
    pit_lap: int


class StrategyModeRequest(BaseModel):
    track_name: str
    strategy_a: Strategy
    strategy_b: Strategy
