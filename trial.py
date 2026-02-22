
import joblib

model = joblib.load("models/lap_delta_random_forest_prelap_phase_trackcluster.pkl")

print("Model loaded successfully!")
print("Number of trees:", len(model.estimators_))
