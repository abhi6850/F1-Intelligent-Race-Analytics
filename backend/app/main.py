from fastapi import FastAPI
from app.routes.health import router as health_router
from app.routes.predict import router as predict_router
from app.routes.strategy import router as strategy_router
from app.routes import metadata
from app.routes.analysis import router as analysis_router
from app.routes.undercut import router as undercut_router
from app.routes.race_simulator import router as race_simulator_router
from app.routes.strategy_mode import router as strategy_mode_router
from app.routes.drivers import router as drivers_router
from app.routes.tracks import router as tracks_router
from app.routes.tyres import router as tyres_router




app = FastAPI(
    title="F1 Intelligent Race Analytics API",
    version="1.0.0"
)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health_router)
app.include_router(predict_router, prefix="/predict")
app.include_router(strategy_router, prefix="/strategy")
app.include_router(metadata.router, prefix="/metadata", tags=["Metadata"])
app.include_router(metadata.router)
app.include_router(analysis_router)
app.include_router(analysis_router, prefix="/analysis")
app.include_router(undercut_router, prefix="/analysis")
app.include_router(race_simulator_router)
app.include_router(strategy_mode_router, prefix="/analysis")

app.include_router(drivers_router)
app.include_router(tracks_router)
app.include_router(tyres_router)

