import numpy as np
from app.services.model_service import predict_lap_delta_batch
from app.utils.driver_team_map import validate_driver_team
from app.constants.pit_loss import get_pit_loss
from app.constants.track_info import get_total_laps

DEGRADATION_FACTOR = 1.8
MAX_TYRE_LIFE = 35


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

    # Always use the correct track lap count regardless of what the caller sends
    total_laps = get_total_laps(track_name)
    pit_loss = get_pit_loss(track_name)
    new_compound = (compound_encoded + 1) % 3

    # ---- Prebuild stint 1 predictions ----
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

    amplified_stint1 = []
    for i, lap in enumerate(range(current_lap, total_laps)):
        tyre_life = current_tyre_life + (lap - current_lap)
        delta = deltas_stint1[i]
        amplified = delta * (1 + (tyre_life / total_laps) * DEGRADATION_FACTOR)
        amplified_stint1.append(amplified)

    # ---- Prebuild stint 2 predictions ----
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

    amplified_stint1 = np.array(amplified_stint1)
    amplified_stint2 = np.array(amplified_stint2)

    strategy_results = []

    for pit_lap in range(current_lap + 3, total_laps - 3):
        idx = pit_lap - current_lap
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
