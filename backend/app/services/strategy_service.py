import numpy as np
from app.services.model_service import predict_lap_delta_batch
from app.utils.driver_team_map import validate_driver_team


TRACK_PIT_LOSS = {
    "Monaco Grand Prix": 18,
    "Bahrain Grand Prix": 22,
    "Singapore Grand Prix": 24,
    "Hungarian Grand Prix": 21,
}

DEFAULT_PIT_LOSS = 20
DEGRADATION_FACTOR = 1.8
MAX_TYRE_LIFE = 35  # realistic upper limit



def optimal_pit_strategy(
    total_laps: int,
    current_lap: int,
    current_tyre_life: int,
    stint: int,
    compound_encoded: int,
    track_name: str,
    driver_name: str,
    team_name: str,
):

    validate_driver_team(driver_name, team_name)

    new_compound = (compound_encoded + 1) % 3

    # ---------------- PREBUILD ALL LAPS ON CURRENT TYRE ----------------
    rows_stint1 = []

    for lap in range(current_lap, total_laps):
        tyre_life = current_tyre_life + (lap - current_lap)

        rows_stint1.append({
            "tyre_life": tyre_life,
            "lap_number": lap,
            "stint": stint,
            "compound_encoded": compound_encoded,
            "fuel_proxy": 1 - (lap / total_laps),
            "race_progress": lap / total_laps,
            "driver_name": driver_name,
            "team_name": team_name,
            "track_name": track_name,
        })

    deltas_stint1 = predict_lap_delta_batch(rows_stint1)

    # Apply degradation amplification once
    amplified_stint1 = []
    for i, lap in enumerate(range(current_lap, total_laps)):
        tyre_life = current_tyre_life + (lap - current_lap)
        delta = deltas_stint1[i]
        amplified = delta * (1 + (tyre_life / total_laps) * DEGRADATION_FACTOR)
        amplified_stint1.append(amplified)

    # ---------------- PREBUILD ALL LAPS ON NEW TYRE ----------------
    rows_stint2 = []

    for lap in range(current_lap, total_laps):
        tyre_life = lap - current_lap + 1

        rows_stint2.append({
            "tyre_life": tyre_life,
            "lap_number": lap,
            "stint": stint + 1,
            "compound_encoded": new_compound,
            "fuel_proxy": 1 - (lap / total_laps),
            "race_progress": lap / total_laps,
            "driver_name": driver_name,
            "team_name": team_name,
            "track_name": track_name,
        })

    deltas_stint2 = predict_lap_delta_batch(rows_stint2)

    amplified_stint2 = []
    for i, lap in enumerate(range(current_lap, total_laps)):
        tyre_life = lap - current_lap + 1
        delta = deltas_stint2[i]
        amplified = delta * (1 + (tyre_life / total_laps) * DEGRADATION_FACTOR)
        amplified_stint2.append(amplified)

    # Convert to numpy for fast slicing
    amplified_stint1 = np.array(amplified_stint1)
    amplified_stint2 = np.array(amplified_stint2)

    strategy_results = []

    pit_loss = TRACK_PIT_LOSS.get(track_name, DEFAULT_PIT_LOSS)

    # ---------------- EVALUATE PIT OPTIONS (NO MODEL CALLS HERE) ----------------
    for pit_lap in range(current_lap + 3, total_laps - 3):

        idx = pit_lap - current_lap
        # Prevent unrealistic long first stint
        if (current_tyre_life + idx) > MAX_TYRE_LIFE:
            continue


        stint1_time = amplified_stint1[:idx].sum()
        stint2_time = amplified_stint2[idx:].sum()

        total_delta = stint1_time + pit_loss + stint2_time

        strategy_results.append({
            "pit_lap": pit_lap,
            "total_delta": float(total_delta)
        })

    best_strategy = min(strategy_results, key=lambda x: x["total_delta"])

    return {
        "optimal_pit_lap": best_strategy["pit_lap"],
        "expected_total_delta": best_strategy["total_delta"],
        "strategy_curve": strategy_results,
    }
