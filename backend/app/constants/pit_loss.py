# Pit lane time loss by track name (seconds) — 2023 season calibrated values
# Used by strategy_service, strategy_mode_service, race_simulator_service,
# win_probability_service, multi_stop_service, undercut_service

TRACK_PIT_LOSS = {
    "Bahrain Grand Prix":       23.0,
    "Saudi Arabian Grand Prix": 22.0,
    "Australian Grand Prix":    21.5,
    "Azerbaijan Grand Prix":    21.0,
    "Miami Grand Prix":         22.0,
    "Monaco Grand Prix":        19.0,
    "Spanish Grand Prix":       22.5,
    "Canadian Grand Prix":      21.0,
    "Austrian Grand Prix":      21.5,
    "British Grand Prix":       22.0,
    "Hungarian Grand Prix":     21.5,
    "Belgian Grand Prix":       22.5,
    "Dutch Grand Prix":         21.0,
    "Italian Grand Prix":       21.0,
    "Singapore Grand Prix":     24.0,
    "Japanese Grand Prix":      22.0,
    "Qatar Grand Prix":         22.5,
    "United States Grand Prix": 21.5,
    "Mexico City Grand Prix":   22.0,
    "São Paulo Grand Prix":     21.5,
    "Las Vegas Grand Prix":     21.0,
    "Abu Dhabi Grand Prix":     21.0,
}

DEFAULT_PIT_LOSS = 21.0


def get_pit_loss(track_name: str) -> float:
    return TRACK_PIT_LOSS.get(track_name, DEFAULT_PIT_LOSS)
