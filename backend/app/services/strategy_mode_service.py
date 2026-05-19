# Drop-in replacement for strategy_mode_service.py
# Key fix: uses get_total_laps(track_name) instead of hardcoded RACE_LAPS = 57

from app.services.model_service import predict_lap_delta_batch
from app.utils.driver_team_map import validate_driver_team
from app.constants.track_info import get_total_laps
from app.constants.pit_loss import TRACK_PIT_LOSS

DEFAULT_PIT_LOSS = 21.0


def simulate_strategy(track_name, strategy):
    validate_driver_team(strategy.driver, strategy.team)

    total_laps = get_total_laps(track_name)          # ← FIXED
    pit_loss = TRACK_PIT_LOSS.get(track_name, DEFAULT_PIT_LOSS)

    rows = []
    for lap in range(1, total_laps + 1):
        race_progress = lap / total_laps
        fuel_proxy = max(0.1, 1 - race_progress)

        if lap < strategy.pit_lap:
            compound = strategy.compound_start
            stint = 1
            tyre_life = lap
        else:
            compound = strategy.compound_after
            stint = 2
            tyre_life = lap - strategy.pit_lap + 1

        rows.append({
            "tyre_life": tyre_life,
            "lap_number": lap,
            "stint": stint,
            "compound_encoded": compound,
            "fuel_proxy": fuel_proxy,
            "race_progress": race_progress,
            "driver_name": strategy.driver,
            "team_name": strategy.team,
            "track_name": track_name,
        })

    deltas = predict_lap_delta_batch(rows)

    total_time = 0.0
    cumulative = []
    for lap in range(total_laps):
        delta = deltas[lap] if deltas[lap] > 0.2 else 0.2
        total_time += delta
        if lap + 1 == strategy.pit_lap:
            total_time += pit_loss
        cumulative.append(total_time)

    return total_time, cumulative


def compare_strategies(track_name, strategy_a, strategy_b):
    total_a, curve_a = simulate_strategy(track_name, strategy_a)
    total_b, curve_b = simulate_strategy(track_name, strategy_b)

    gap_curve = [
        {"lap": lap + 1, "gap": curve_b[lap] - curve_a[lap]}
        for lap in range(len(curve_a))
    ]

    winner = "Strategy A" if total_a < total_b else "Strategy B"

    return {
        "total_time_a": round(total_a, 3),
        "total_time_b": round(total_b, 3),
        "time_difference": round(abs(total_a - total_b), 3),
        "winner": winner,
        "gap_curve": gap_curve,
    }
