from fastapi import APIRouter
import json
from pathlib import Path

router = APIRouter(prefix="/api/tyres", tags=["Tyres"])

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_PATH = BASE_DIR / "data" / "tyres_2023.json"



@router.get("/")
def get_tyres():
    try:
        with open(DATA_PATH, "r") as f:
            tyres = json.load(f)
        return tyres
    except Exception as e:
        return {"error": str(e)}
