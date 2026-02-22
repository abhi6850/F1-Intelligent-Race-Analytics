from fastapi import APIRouter
from app.schemas.predict import LapDeltaRequest, LapDeltaResponse
from app.services.model_service import predict_lap_delta

router = APIRouter()


@router.post("/lap-delta", response_model=LapDeltaResponse)
def predict_lap_delta_endpoint(request: LapDeltaRequest):
    lap_delta = predict_lap_delta(request.dict())

    return {
        "lap_delta_seconds": lap_delta
    }
