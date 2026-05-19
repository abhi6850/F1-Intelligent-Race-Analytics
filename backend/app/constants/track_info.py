# Per-track total laps for the 2023 F1 season
TRACK_TOTAL_LAPS = {
    "Bahrain Grand Prix": 57,
    "Saudi Arabian Grand Prix": 50,
    "Australian Grand Prix": 58,
    "Azerbaijan Grand Prix": 51,
    "Miami Grand Prix": 57,
    "Monaco Grand Prix": 78,
    "Spanish Grand Prix": 66,
    "Canadian Grand Prix": 70,
    "Austrian Grand Prix": 71,
    "British Grand Prix": 52,
    "Hungarian Grand Prix": 70,
    "Belgian Grand Prix": 44,
    "Dutch Grand Prix": 72,
    "Italian Grand Prix": 51,
    "Singapore Grand Prix": 62,
    "Japanese Grand Prix": 53,
    "Qatar Grand Prix": 57,
    "United States Grand Prix": 56,
    "Mexico City Grand Prix": 71,
    "São Paulo Grand Prix": 71,
    "Las Vegas Grand Prix": 50,
    "Abu Dhabi Grand Prix": 58,
}

DEFAULT_TOTAL_LAPS = 57

# Track name → encoded integer (must match training data encoding)
TRACK_ENCODED = {
    "Abu Dhabi Grand Prix": 0,
    "Australian Grand Prix": 1,
    "Austrian Grand Prix": 2,
    "Azerbaijan Grand Prix": 3,
    "Bahrain Grand Prix": 4,
    "Belgian Grand Prix": 5,
    "British Grand Prix": 6,
    "Canadian Grand Prix": 7,
    "Dutch Grand Prix": 8,
    "Hungarian Grand Prix": 9,
    "Italian Grand Prix": 10,
    "Japanese Grand Prix": 11,
    "Las Vegas Grand Prix": 12,
    "Mexico City Grand Prix": 13,
    "Miami Grand Prix": 14,
    "Monaco Grand Prix": 15,
    "Qatar Grand Prix": 17,
    "Saudi Arabian Grand Prix": 18,
    "Singapore Grand Prix": 19,
    "Spanish Grand Prix": 20,
    "São Paulo Grand Prix": 21,
    "United States Grand Prix": 22,
}

def get_total_laps(track_name: str) -> int:
    return TRACK_TOTAL_LAPS.get(track_name, DEFAULT_TOTAL_LAPS)
