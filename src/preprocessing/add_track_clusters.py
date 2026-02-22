import pandas as pd
from pathlib import Path
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# -----------------------------
# Paths
# -----------------------------
INPUT_PATH = Path("data/processed/2023_pace_laps_with_delta_phase.csv")
OUTPUT_DIR = Path("data/processed")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_PATH = OUTPUT_DIR / "2023_pace_laps_with_delta_phase_trackcluster.csv"


def main():
    print("📥 Loading dataset...")
    df = pd.read_csv(INPUT_PATH)

    print("🏎️ Aggregating track-level features...")
    track_features = (
        df.groupby("RaceName")
        .agg(
            MeanLapTime=("LapTime_seconds", "mean"),
            StdLapTime=("LapTime_seconds", "std"),
            MeanLapDelta=("LapDelta_seconds", "mean"),
            MeanTyreLife=("TyreLife", "mean"),
            RaceLength=("LapNumber", "max"),
        )
        .reset_index()
    )

    print("🔄 Scaling track features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(
        track_features.drop(columns=["RaceName"])
    )

    print("🔍 Clustering tracks...")
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    track_features["TrackCluster"] = kmeans.fit_predict(X_scaled)

    print("🔗 Merging clusters back to lap data...")
    df = df.merge(
        track_features[["RaceName", "TrackCluster"]],
        on="RaceName",
        how="left"
    )

    print("💾 Saving dataset with track clusters...")
    df.to_csv(OUTPUT_PATH, index=False)

    print("✅ Track clustering added")
    print(f"📁 Saved to: {OUTPUT_PATH}")

    print("\n📊 Track clusters:")
    print(track_features[["RaceName", "TrackCluster"]].sort_values("TrackCluster"))


if __name__ == "__main__":
    main()
