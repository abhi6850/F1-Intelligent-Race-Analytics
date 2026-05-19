"""
Win Probability Service
-----------------------
Estimates P(win), P(podium), and expected finishing position for a driver
given their starting grid position and track.

Approach:
  1. Simulate the full race for the requesting driver using the lap-delta model.
  2. Simulate the same race for every other driver on the 2023 grid using their
     typical starting compound for the track.
  3. Rank all drivers by cumulative race time (accounting for pit losses).
  4. Return win/podium probability across 100 Monte Carlo samples with small
     Gaussian noise added to each lap delta (captures on-track variability).
"""

import numpy as np
from app.services.model_service import predict_lap_delta_batch
from app.utils.driver_team_map import DRIVER_TEAM_MAP
from app.constants.track_info import get_total_laps, TRACK_TOTAL_LAPS
from app.constants.pit_loss import TRACK_PIT_LOSS


# ------------------------------------------------------------------
# Grid-position-to-typical-compound mapping
# Drivers starting P1-P3 often use softs; midfield uses mediums; back uses hards.
# ------------------------------------------------------------------
def get_starting_compound(grid_pos: int, track_degradation_level: str = "medium") -> int:
    """
    Returns compound_encoded: 0=Soft, 1=Medium, 2=Hard
    High-deg tracks push drivers toward harder compounds from the back.
    """
    if grid_pos <= 3:
        return 0  # Soft – front runners attack
    elif grid_pos <= 10:
        return 1  # Medium – midfield balance
    else:
        return 2  # Hard – undercut potential, long first stint


# Typical pit lap relative to race length (fraction)
GRID_PIT_LAP_FRACTION = {
    range(1, 4): 0.30,    # front row pits later to protect position
    range(4, 11): 0.36,
    range(11, 21): 0.42,  # back markers pit early to undercut
}


def get_pit_lap(grid_pos: int, total_laps: int) -> int:
    for r, fraction in GRID_PIT_LAP_FRACTION.items():
        if grid_pos in r:
            return max(5, int(total_laps * fraction))
    return int(total_laps * 0.38)


# ------------------------------------------------------------------
# Single driver race time simulation
# ------------------------------------------------------------------
def simulate_driver_race(
    driver: str,
    team: str,
    grid_pos: int,
    track_name: str,
    compound_start: int = None,
    pit_lap: int = None,
    noise_std: float = 0.0,
) -> float:
    total_laps = get_total_laps(track_name)
    pit_loss = TRACK_PIT_LOSS.get(track_name, 21.0)

    if compound_start is None:
        compound_start = get_starting_compound(grid_pos)
    if pit_lap is None:
        pit_lap = get_pit_lap(grid_pos, total_laps)

    compound_after = min(compound_start + 1, 2)  # always go one step harder after

    rows = []
    for lap in range(1, total_laps + 1):
        race_progress = lap / total_laps
        fuel_proxy = max(0.1, 1 - race_progress)

        if lap < pit_lap:
            compound = compound_start
            stint = 1
            tyre_life = lap
        else:
            compound = compound_after
            stint = 2
            tyre_life = lap - pit_lap + 1

        rows.append({
            "tyre_life": tyre_life,
            "lap_number": lap,
            "stint": stint,
            "compound_encoded": compound,
            "fuel_proxy": fuel_proxy,
            "race_progress": race_progress,
            "driver_name": driver,
            "team_name": team,
            "track_name": track_name,
        })

    deltas = predict_lap_delta_batch(rows)

    # Starting position penalty (each grid slot ≈ 0.3s of track position deficit)
    grid_penalty = (grid_pos - 1) * 0.3

    total_time = float(grid_penalty)
    for i, delta in enumerate(deltas):
        d = max(float(delta), 0.2)
        if noise_std > 0:
            d += np.random.normal(0, noise_std)
            d = max(d, 0.1)
        total_time += d
        if (i + 1) == pit_lap:
            total_time += pit_loss

    return total_time


# ------------------------------------------------------------------
# Win probability via Monte Carlo
# ------------------------------------------------------------------
def estimate_win_probability(
    driver: str,
    team: str,
    grid_position: int,
    track_name: str,
    compound_start: int = None,
    n_simulations: int = 100,
) -> dict:

    all_drivers = list(DRIVER_TEAM_MAP.keys())

    # Grid positions for the other 19 drivers
    # Remove the target driver, assign remaining grid slots
    other_drivers = [d for d in all_drivers if d != driver]
    # Assign grid positions: skip the target driver's slot
    other_grid_slots = [p for p in range(1, 21) if p != grid_position]

    win_count = 0
    podium_count = 0
    positions_sum = 0
    finishing_times = []

    # Collect expected finishing times per driver (no noise) for the base estimate
    base_times = {}
    target_time = simulate_driver_race(
        driver, team, grid_position, track_name, compound_start
    )
    base_times[driver] = target_time

    for i, d in enumerate(other_drivers):
        g = other_grid_slots[i] if i < len(other_grid_slots) else i + 2
        t = simulate_driver_race(d, DRIVER_TEAM_MAP[d], g, track_name)
        base_times[d] = t

    # Sort once for expected position
    sorted_base = sorted(base_times.items(), key=lambda x: x[1])
    expected_pos = next((i + 1 for i, (d, _) in enumerate(sorted_base) if d == driver), 20)

    # Monte Carlo for probabilities
    for _ in range(n_simulations):
        noise = 0.15  # ±0.15s per lap std gives realistic race variation
        sim_times = {}

        t_target = simulate_driver_race(
            driver, team, grid_position, track_name, compound_start, noise_std=noise
        )
        sim_times[driver] = t_target

        for i, d in enumerate(other_drivers):
            g = other_grid_slots[i] if i < len(other_grid_slots) else i + 2
            t = simulate_driver_race(d, DRIVER_TEAM_MAP[d], g, track_name, noise_std=noise)
            sim_times[d] = t

        sorted_sim = sorted(sim_times.items(), key=lambda x: x[1])
        target_rank = next((i + 1 for i, (d, _) in enumerate(sorted_sim) if d == driver), 20)
        positions_sum += target_rank

        if target_rank == 1:
            win_count += 1
        if target_rank <= 3:
            podium_count += 1

    win_prob = round(win_count / n_simulations * 100, 1)
    podium_prob = round(podium_count / n_simulations * 100, 1)
    avg_finish = round(positions_sum / n_simulations, 1)

    # Build expected finishing order
    finishing_order = [
        {
            "position": i + 1,
            "driver": d,
            "team": DRIVER_TEAM_MAP.get(d, ""),
            "time_gap": round(t - sorted_base[0][1], 2),
            "is_target": d == driver,
        }
        for i, (d, t) in enumerate(sorted_base)
    ]

    # Recommended starting compound
    if compound_start is None:
        recommended_compound = get_starting_compound(grid_position)
    else:
        recommended_compound = compound_start

    compound_names = {0: "Soft", 1: "Medium", 2: "Hard"}

    total_laps = get_total_laps(track_name)
    rec_pit_lap = get_pit_lap(grid_position, total_laps)
    rec_compound_after = min(recommended_compound + 1, 2)

    return {
        "driver": driver,
        "team": team,
        "track": track_name,
        "grid_position": grid_position,
        "win_probability": win_prob,
        "podium_probability": podium_prob,
        "expected_finishing_position": avg_finish,
        "simulated_position": expected_pos,
        "recommended_strategy": {
            "starting_compound": compound_names[recommended_compound],
            "starting_compound_encoded": recommended_compound,
            "pit_lap": rec_pit_lap,
            "second_compound": compound_names[rec_compound_after],
            "stint_1_laps": rec_pit_lap - 1,
            "stint_2_laps": total_laps - rec_pit_lap + 1,
        },
        "finishing_order": finishing_order,
        "total_laps": total_laps,
    }
