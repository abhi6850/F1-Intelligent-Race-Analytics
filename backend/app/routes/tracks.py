from fastapi import APIRouter
import requests

router = APIRouter(prefix="/api/tracks", tags=["Tracks"])

BASE_URL = "https://api.jolpi.ca/ergast/f1/2023"


@router.get("/")
def get_tracks():
    try:
        response = requests.get(f"{BASE_URL}.json", timeout=5)
        response.raise_for_status()

        data = response.json()
        races = data["MRData"]["RaceTable"]["Races"]

        tracks = []

        for race in races:
            circuit = race["Circuit"]

            tracks.append({
                "round": race["round"],
                "raceName": race["raceName"],
                "circuitId": circuit["circuitId"],
                "circuitName": circuit["circuitName"],
                "country": circuit["Location"]["country"],
                "locality": circuit["Location"]["locality"]
            })

        return tracks

    except Exception as e:
        return {"error": str(e)}
