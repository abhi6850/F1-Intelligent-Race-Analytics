from app.services.model_service import predict_lap_delta_batch
from app.utils.driver_team_map import validate_driver_team

RACE_LAPS = 57

TRACK_PIT_LOSS = 21.0  # simplified constant for now


def simulate_strategy(track_name, strategy):

    # Validate once
    validate_driver_team(strategy.driver, strategy.team)

    rows = []

    for lap in range(1, RACE_LAPS + 1):

        race_progress = lap / RACE_LAPS
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

    # -------- Batch Predict --------
    deltas = predict_lap_delta_batch(rows)

    total_time = 0.0
    cumulative = []

    for lap in range(RACE_LAPS):

        delta = deltas[lap] if deltas[lap] > 0.2 else 0.2
        total_time += delta

        # Add pit loss at pit lap
        if lap + 1 == strategy.pit_lap:
            total_time += TRACK_PIT_LOSS

        cumulative.append(total_time)

    return total_time, cumulative


def compare_strategies(track_name, strategy_a, strategy_b):

    total_a, curve_a = simulate_strategy(track_name, strategy_a)
    total_b, curve_b = simulate_strategy(track_name, strategy_b)

    gap_curve = []

    for lap in range(len(curve_a)):
        gap_curve.append({
            "lap": lap + 1,
            "gap": curve_b[lap] - curve_a[lap]
        })

    winner = "Strategy A" if total_a < total_b else "Strategy B"

    return {
        "total_time_a": round(total_a, 3),
        "total_time_b": round(total_b, 3),
        "time_difference": round(abs(total_a - total_b), 3),
        "winner": winner,
        "gap_curve": gap_curve
    }
