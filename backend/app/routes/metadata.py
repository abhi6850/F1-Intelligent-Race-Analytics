from fastapi import APIRouter
from app.services.metadata_service import (
    get_drivers,
    get_teams,
    get_tracks,
)

router = APIRouter()



@router.get("/drivers")
def drivers_metadata():
    return get_drivers()


@router.get("/teams")
def teams_metadata():
    return get_teams()


@router.get("/tracks")
def tracks_metadata():
    return get_tracks()
