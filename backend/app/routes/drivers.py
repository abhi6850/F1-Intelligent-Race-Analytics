from fastapi import APIRouter
import requests

router = APIRouter(prefix="/api/drivers", tags=["Drivers"])

BASE_URL = "https://api.jolpi.ca/ergast/f1/2023"


# ------------------------------------------------------------
# GET ALL DRIVERS
# ------------------------------------------------------------
@router.get("/")
def get_drivers():
    try:
        response = requests.get(f"{BASE_URL}/drivers.json", timeout=5)
        response.raise_for_status()
        data = response.json()

        drivers = []

        for d in data["MRData"]["DriverTable"]["Drivers"]:
            drivers.append({
                "driverId": d["driverId"],
                "givenName": d["givenName"],
                "familyName": d["familyName"],
                "nationality": d["nationality"],
                "dateOfBirth": d["dateOfBirth"],
                "permanentNumber": d.get("permanentNumber", "N/A")
            })

        return drivers

    except Exception as e:
        return {"error": str(e)}


# ------------------------------------------------------------
# GET SINGLE DRIVER + TEAM + PERFORMANCE STATS
# ------------------------------------------------------------
@router.get("/{driver_id}")
def get_driver(driver_id: str):
    try:
        # --------------------------
        # BASIC INFO
        # --------------------------
        driver_url = f"{BASE_URL}/drivers/{driver_id}.json"
        driver_response = requests.get(driver_url, timeout=5)
        driver_response.raise_for_status()

        driver_data = driver_response.json()
        drivers = driver_data["MRData"]["DriverTable"]["Drivers"]

        if not drivers:
            return {"error": "Driver not found"}

        d = drivers[0]

        # --------------------------
        # TEAM INFO
        # --------------------------
        team_url = f"{BASE_URL}/drivers/{driver_id}/constructors.json"
        team_response = requests.get(team_url, timeout=5)
        team_response.raise_for_status()

        team_data = team_response.json()
        constructors = team_data["MRData"]["ConstructorTable"]["Constructors"]

        team_info = None

        if constructors:
            c = constructors[0]
            team_info = {
                "constructorId": c["constructorId"],
                "name": c["name"],
                "nationality": c["nationality"]
            }

        # --------------------------
        # RACE RESULTS
        # --------------------------
        results_url = f"{BASE_URL}/drivers/{driver_id}/results.json?limit=1000"
        results_response = requests.get(results_url, timeout=5)
        results_response.raise_for_status()

        results_data = results_response.json()
        races = results_data["MRData"]["RaceTable"]["Races"]

        total_races = len(races)
        wins = 0
        podiums = 0
        best_finish = None
        total_points = 0.0

        race_results = []

        for race in races:
            result = race["Results"][0]

            position = int(result["position"])
            points = float(result["points"])
            grid = int(result["grid"])

            total_points += points

            if position == 1:
                wins += 1

            if position <= 3:
                podiums += 1

            if best_finish is None or position < best_finish:
                best_finish = position

            race_results.append({
                "round": race["round"],
                "raceName": race["raceName"],
                "circuit": race["Circuit"]["circuitName"],
                "grid": grid,
                "position": position,
                "points": points
            })

        # --------------------------
        # FINAL RESPONSE
        # --------------------------
        return {
            "driverId": d["driverId"],
            "givenName": d["givenName"],
            "familyName": d["familyName"],
            "nationality": d["nationality"],
            "dateOfBirth": d["dateOfBirth"],
            "permanentNumber": d.get("permanentNumber", "N/A"),

            "team": team_info,

            "stats": {
                "races": total_races,
                "wins": wins,
                "podiums": podiums,
                "best_finish": best_finish if best_finish is not None else "N/A",
                "total_points": total_points
            },

            "race_results": race_results
        }

    except Exception as e:
        return {"error": str(e)}
