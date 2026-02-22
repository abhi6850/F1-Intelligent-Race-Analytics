from app.services.model_service import predict_lap_delta_batch
from app.utils.driver_team_map import validate_driver_team

DEFAULT_TOTAL_LAPS = 57

TRACK_PIT_LOSS = {
    "Bahrain Grand Prix": 22.5,
    "Saudi Arabian Grand Prix": 20.0,
    "Australian Grand Prix": 21.0,
    "Azerbaijan Grand Prix": 19.5,
    "Miami Grand Prix": 21.5,
    "Monaco Grand Prix": 18.0,
    "Spanish Grand Prix": 21.0,
    "Canadian Grand Prix": 20.0,
    "Austrian Grand Prix": 19.0,
    "British Grand Prix": 20.5,
    "Hungarian Grand Prix": 21.5,
    "Belgian Grand Prix": 21.0,
    "Dutch Grand Prix": 19.5,
    "Italian Grand Prix": 22.0,
    "Singapore Grand Prix": 24.0,
    "Japanese Grand Prix": 21.5,
    "Qatar Grand Prix": 23.0,
    "United States Grand Prix": 20.5,
    "Mexico City Grand Prix": 19.5,
    "São Paulo Grand Prix": 20.0,
    "Las Vegas Grand Prix": 23.5,
    "Abu Dhabi Grand Prix": 21.5,
}


def analyze_undercut(
    track_name: str,
    driver_a: str,
    team_a: str,
    driver_b: str,
    team_b: str,
    base_pit_lap: int,
    undercut_delta: int,
    compound_a: int,
    compound_b: int,
):
    """
    Optimized compound-aware undercut simulation.
    """

    validate_driver_team(driver_a, team_a)
    validate_driver_team(driver_b, team_b)

    total_laps = DEFAULT_TOTAL_LAPS

    driver_a_pit = max(1, base_pit_lap - undercut_delta)
    driver_b_pit = base_pit_lap

    pit_loss = TRACK_PIT_LOSS.get(track_name, 21.0)

    window_end = min(driver_b_pit + 8, total_laps)

    rows_a = []
    rows_b = []

    # ---------------- BUILD WINDOW ----------------
    for lap in range(driver_a_pit, window_end + 1):

        race_progress = lap / total_laps
        fuel_proxy = max(0.1, 1 - race_progress)

        # Driver A
        if lap < driver_a_pit:
            stint_a = 1
            tyre_life_a = lap
        else:
            stint_a = 2
            tyre_life_a = lap - driver_a_pit + 1

        rows_a.append({
            "tyre_life": tyre_life_a,
            "lap_number": lap,
            "stint": stint_a,
            "compound_encoded": compound_a,
            "fuel_proxy": fuel_proxy,
            "race_progress": race_progress,
            "driver_name": driver_a,
            "team_name": team_a,
            "track_name": track_name,
        })

        # Driver B
        if lap < driver_b_pit:
            stint_b = 1
            tyre_life_b = lap
        else:
            stint_b = 2
            tyre_life_b = lap - driver_b_pit + 1

        rows_b.append({
            "tyre_life": tyre_life_b,
            "lap_number": lap,
            "stint": stint_b,
            "compound_encoded": compound_b,
            "fuel_proxy": fuel_proxy,
            "race_progress": race_progress,
            "driver_name": driver_b,
            "team_name": team_b,
            "track_name": track_name,
        })

    # ---------------- BATCH PREDICT ----------------
    deltas_a = predict_lap_delta_batch(rows_a)
    deltas_b = predict_lap_delta_batch(rows_b)

    cumulative_time_a = 0.0
    cumulative_time_b = 0.0

    for i in range(len(deltas_a)):

        delta_a = deltas_a[i] if deltas_a[i] > 0.2 else 0.2
        delta_b = deltas_b[i] if deltas_b[i] > 0.2 else 0.2

        lap_number = rows_a[i]["lap_number"]

        cumulative_time_a += delta_a
        cumulative_time_b += delta_b

        if lap_number == driver_a_pit:
            cumulative_time_a += pit_loss

        if lap_number == driver_b_pit:
            cumulative_time_b += pit_loss

    cumulative_gain = cumulative_time_b - cumulative_time_a

    return {
        "driver_a_pit": driver_a_pit,
        "driver_b_pit": driver_b_pit,
        "undercut_gain_seconds": round(float(cumulative_gain), 3),
    }
