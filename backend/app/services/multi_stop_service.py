"""
Multi-Stop Strategy Planner
----------------------------
Evaluates 1-stop and 2-stop strategies exhaustively and returns the best
combination with full stint breakdown (compound + laps per stint).
"""

import numpy as np
from itertools import product
from app.services.model_service import predict_lap_delta_batch
from app.utils.driver_team_map import validate_driver_team
from app.constants.track_info import get_total_laps
from app.constants.pit_loss import TRACK_PIT_LOSS

DEGRADATION_FACTOR = 1.8
MAX_TYRE_LIFE = 35


def _simulate_stint(
    driver: str,
    team: str,
    compound: int,
    start_lap: int,
    end_lap: int,
    stint_num: int,
    total_laps: int,
    track_name: str,
) -> tuple:
    """Returns (total_delta, lap_deltas_list) for a stint."""
    rows = []
    for lap in range(start_lap, end_lap + 1):
        tyre_life = lap - start_lap + 1
        rows.append({
            "tyre_life": tyre_life,
            "lap_number": lap,
            "stint": stint_num,
            "compound_encoded": compound,
            "fuel_proxy": max(0.1, 1 - lap / total_laps),
            "race_progress": lap / total_laps,
            "driver_name": driver,
            "team_name": team,
            "track_name": track_name,
        })

    if not rows:
        return 0.0, []

    deltas = predict_lap_delta_batch(rows)
    amplified = []
    for i, delta in enumerate(deltas):
        tyre_life = i + 1
        amp = float(delta) * (1 + (tyre_life / total_laps) * DEGRADATION_FACTOR)
        amplified.append(amp)

    return sum(amplified), amplified


def _evaluate_1stop(
    driver: str,
    team: str,
    compound_1: int,
    compound_2: int,
    pit_lap: int,
    total_laps: int,
    track_name: str,
    pit_loss: float,
) -> float:
    if pit_lap <= 3 or pit_lap >= total_laps - 3:
        return float("inf")
    if (pit_lap - 1) > MAX_TYRE_LIFE:
        return float("inf")

    t1, _ = _simulate_stint(driver, team, compound_1, 1, pit_lap - 1, 1, total_laps, track_name)
    t2, _ = _simulate_stint(driver, team, compound_2, pit_lap, total_laps, 2, total_laps, track_name)
    return t1 + pit_loss + t2


def _evaluate_2stop(
    driver: str,
    team: str,
    compound_1: int,
    compound_2: int,
    compound_3: int,
    pit1: int,
    pit2: int,
    total_laps: int,
    track_name: str,
    pit_loss: float,
) -> float:
    if pit1 <= 3 or pit2 <= pit1 + 5 or pit2 >= total_laps - 3:
        return float("inf")
    if (pit1 - 1) > MAX_TYRE_LIFE:
        return float("inf")
    if (pit2 - pit1) > MAX_TYRE_LIFE:
        return float("inf")

    t1, _ = _simulate_stint(driver, team, compound_1, 1, pit1 - 1, 1, total_laps, track_name)
    t2, _ = _simulate_stint(driver, team, compound_2, pit1, pit2 - 1, 2, total_laps, track_name)
    t3, _ = _simulate_stint(driver, team, compound_3, pit2, total_laps, 3, total_laps, track_name)
    return t1 + pit_loss + t2 + pit_loss + t3


def plan_multi_stop_strategy(
    track_name: str,
    driver: str,
    team: str,
    grid_position: int = 1,
) -> dict:
    validate_driver_team(driver, team)

    total_laps = get_total_laps(track_name)
    pit_loss = TRACK_PIT_LOSS.get(track_name, 21.0)

    compounds = [0, 1, 2]  # Soft=0, Medium=1, Hard=2
    compound_names = {0: "Soft", 1: "Medium", 2: "Hard"}
    compound_colors = {0: "#e10600", 1: "#fbbf24", 2: "#e5e7eb"}

    # ------- 1-STOP: scan all compound combos × pit laps -------
    best_1stop_time = float("inf")
    best_1stop = None

    for c1, c2 in product(compounds, repeat=2):
        if c1 == c2:
            continue  # regulations require 2 different compounds

        # Sample every 3rd lap to keep it fast
        for pit_lap in range(8, total_laps - 8, 3):
            t = _evaluate_1stop(driver, team, c1, c2, pit_lap, total_laps, track_name, pit_loss)
            if t < best_1stop_time:
                best_1stop_time = t
                best_1stop = {
                    "stops": 1,
                    "total_delta": round(t, 2),
                    "stints": [
                        {
                            "stint": 1,
                            "compound": compound_names[c1],
                            "compound_encoded": c1,
                            "color": compound_colors[c1],
                            "start_lap": 1,
                            "end_lap": pit_lap - 1,
                            "laps": pit_lap - 1,
                        },
                        {
                            "stint": 2,
                            "compound": compound_names[c2],
                            "compound_encoded": c2,
                            "color": compound_colors[c2],
                            "start_lap": pit_lap,
                            "end_lap": total_laps,
                            "laps": total_laps - pit_lap + 1,
                        },
                    ],
                    "pit_laps": [pit_lap],
                    "label": f"{compound_names[c1]} {pit_lap - 1} laps → {compound_names[c2]} {total_laps - pit_lap + 1} laps",
                }

    # ------- 2-STOP: sample pit windows -------
    best_2stop_time = float("inf")
    best_2stop = None

    step = 4
    for c1, c2, c3 in product(compounds, repeat=3):
        # Must use at least 2 different compounds
        if c1 == c2 == c3:
            continue

        for pit1 in range(10, total_laps // 2, step):
            for pit2 in range(pit1 + 12, total_laps - 8, step):
                t = _evaluate_2stop(driver, team, c1, c2, c3, pit1, pit2, total_laps, track_name, pit_loss)
                if t < best_2stop_time:
                    best_2stop_time = t
                    best_2stop = {
                        "stops": 2,
                        "total_delta": round(t, 2),
                        "stints": [
                            {
                                "stint": 1,
                                "compound": compound_names[c1],
                                "compound_encoded": c1,
                                "color": compound_colors[c1],
                                "start_lap": 1,
                                "end_lap": pit1 - 1,
                                "laps": pit1 - 1,
                            },
                            {
                                "stint": 2,
                                "compound": compound_names[c2],
                                "compound_encoded": c2,
                                "color": compound_colors[c2],
                                "start_lap": pit1,
                                "end_lap": pit2 - 1,
                                "laps": pit2 - pit1,
                            },
                            {
                                "stint": 3,
                                "compound": compound_names[c3],
                                "compound_encoded": c3,
                                "color": compound_colors[c3],
                                "start_lap": pit2,
                                "end_lap": total_laps,
                                "laps": total_laps - pit2 + 1,
                            },
                        ],
                        "pit_laps": [pit1, pit2],
                        "label": (
                            f"{compound_names[c1]} {pit1 - 1} laps → "
                            f"{compound_names[c2]} {pit2 - pit1} laps → "
                            f"{compound_names[c3]} {total_laps - pit2 + 1} laps"
                        ),
                    }

    # Determine winner
    best_overall = best_1stop if (best_1stop_time <= best_2stop_time) else best_2stop
    delta_between = round(abs(best_1stop_time - best_2stop_time), 2)

    return {
        "track": track_name,
        "driver": driver,
        "team": team,
        "total_laps": total_laps,
        "recommended": best_overall,
        "one_stop": best_1stop,
        "two_stop": best_2stop,
        "one_stop_time": round(best_1stop_time, 2) if best_1stop_time < float("inf") else None,
        "two_stop_time": round(best_2stop_time, 2) if best_2stop_time < float("inf") else None,
        "delta_between_strategies": delta_between,
        "better_strategy": "1-stop" if best_1stop_time <= best_2stop_time else "2-stop",
    }
