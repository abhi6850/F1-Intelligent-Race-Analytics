from app.services.model_service import predict_lap_delta_batch
from app.utils.driver_team_map import validate_driver_team

DEFAULT_TOTAL_LAPS = 57


def simulate_race(
    track_name: str,
    driver_a: str,
    team_a: str,
    driver_b: str,
    team_b: str,
    compound_a: int,
    compound_b: int,
    pit_lap_a: int = 20,
    pit_lap_b: int = 22,
):

    # Validate once (fast check)
    validate_driver_team(driver_a, team_a)
    validate_driver_team(driver_b, team_b)

    total_laps = DEFAULT_TOTAL_LAPS

    rows_a = []
    rows_b = []

    # ---------------- BUILD ALL LAPS ----------------
    for lap in range(1, total_laps + 1):

        race_progress = lap / total_laps
        fuel_proxy = max(0.1, 1 - race_progress)

        # Driver A
        if lap < pit_lap_a:
            tyre_life_a = lap
            stint_a = 1
        else:
            tyre_life_a = lap - pit_lap_a + 1
            stint_a = 2

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
        if lap < pit_lap_b:
            tyre_life_b = lap
            stint_b = 1
        else:
            tyre_life_b = lap - pit_lap_b + 1
            stint_b = 2

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

    cumulative_a = 0.0
    cumulative_b = 0.0

    gap_data = []

    # ---------------- GAP CALCULATION ----------------
    for i in range(total_laps):

        # clamp to minimum delta
        delta_a = deltas_a[i] if deltas_a[i] > 0.2 else 0.2
        delta_b = deltas_b[i] if deltas_b[i] > 0.2 else 0.2

        cumulative_a += delta_a
        cumulative_b += delta_b

        gap_data.append({
            "lap": i + 1,
            "gap": round(cumulative_b - cumulative_a, 3)
        })

    final_gap = round(cumulative_b - cumulative_a, 3)

    return {
        "gap_data": gap_data,
        "driver_a_pit": pit_lap_a,
        "driver_b_pit": pit_lap_b,
        "final_gap": final_gap,
    }
