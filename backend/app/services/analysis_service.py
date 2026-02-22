import numpy as np
from app.services.model_service import predict_lap_delta


def tyre_degradation_analysis(track_name: str, driver_name: str, team_name: str):

    results = []

    compounds = {
        "Soft": 0,
        "Medium": 1,
        "Hard": 2,
    }

    for compound_name, compound_encoded in compounds.items():

        compound_curve = []

        for tyre_life in range(1, 41):

            payload = {
                "tyre_life": tyre_life,
                "lap_number": tyre_life,
                "stint": 1,
                "compound_encoded": compound_encoded,
                "fuel_proxy": 0.7,  # mid-race fuel load
                "race_progress": tyre_life / 60,
                "driver_name": driver_name,
                "team_name": team_name,
                "track_name": track_name,
            }

            delta = predict_lap_delta(payload)

            compound_curve.append({
                "tyre_life": tyre_life,
                "lap_delta": float(delta)
            })

        results.append({
            "compound": compound_name,
            "data": compound_curve
        })

    return results

def compound_crossover_analysis(track_name: str, driver_name: str, team_name: str):
    from app.services.model_service import predict_lap_delta

    compounds = {
        "Soft": 0,
        "Medium": 1,
        "Hard": 2
    }

    max_laps = 40
    results = {}

    # Generate degradation curves
    for compound_name, compound_encoded in compounds.items():
        compound_data = []

        for tyre_life in range(1, max_laps + 1):

            payload = {
                "tyre_life": tyre_life,
                "lap_number": tyre_life,
                "stint": 1,
                "compound_encoded": compound_encoded,
                "fuel_proxy": 1 - (tyre_life / 60),
                "race_progress": tyre_life / 60,
                "driver_name": driver_name,
                "team_name": team_name,
                "track_name": track_name,
            }

            lap_delta = predict_lap_delta(payload)

            compound_data.append({
                "tyre_life": tyre_life,
                "lap_delta": lap_delta
            })

        results[compound_name] = compound_data

    # Detect crossover points
    crossovers = {}

    for lap in range(max_laps):
        s = results["Soft"][lap]["lap_delta"]
        m = results["Medium"][lap]["lap_delta"]
        h = results["Hard"][lap]["lap_delta"]

        if "Medium_beats_Soft" not in crossovers and m < s:
            crossovers["Medium_beats_Soft"] = lap + 1

        if "Hard_beats_Medium" not in crossovers and h < m:
            crossovers["Hard_beats_Medium"] = lap + 1

    return {
        "crossovers": crossovers,
        "curves": results
    }
