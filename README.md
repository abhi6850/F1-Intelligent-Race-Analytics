F1 Intelligent Race Analytics

AI-powered Formula 1 race strategy and performance simulation engine built using Machine Learning, vectorized simulation logic, and a full-stack analytics dashboard.

🚀 Overview

F1 Intelligent Race Analytics is a full-stack ML-driven race simulation platform that predicts lap performance and simulates race strategies using real 2023 Formula 1 telemetry.

The system uses a trained RandomForestRegressor model to predict lap delta performance and builds advanced race strategy simulations on top of it.

This is not a static dashboard — it is a vectorized race simulation engine with optimized inference and strategy modeling.

🧠 Core Features
📊 Lap Delta Prediction

Predicts lap time delta using ML based on:

Tyre life

Stint number

Fuel proxy

Race progress

Compound type

Driver

Team

Track features

🏎 Strategy Simulation Engine

Optimal pit strategy evaluation

Strategy A vs B comparison

Undercut analysis

Tyre degradation modeling

Race pace simulation

Precomputed stint delta optimization

All simulations are vectorized and optimized for sub-0.5 second execution.

📈 Interactive Dashboard

Built using React + Recharts:

Lap delta visualizations

Tyre degradation graphs

Strategy comparison charts

Race simulation outputs

🏗 System Architecture
React Frontend  →  FastAPI Backend  →  ML Model  →  Simulation Layer
Backend

FastAPI

scikit-learn

pandas

numpy

joblib

Frontend

React (Vite)

React Router

Recharts

Custom analytics components

🤖 Machine Learning Model
Model

RandomForestRegressor

n_estimators = 300

max_depth = 18

min_samples_split = 5

min_samples_leaf = 2

random_state = 42

n_jobs = -1

Target

LapDelta_seconds

Feature Engineering

TyreLifeSquared = TyreLife²

FuelProxy = 1 - (LapNumber / TotalLaps)

RaceProgress = LapNumber / TotalLaps

Track one-hot encoding

Track-specific tyre interaction features

Performance

Mean Absolute Error (MAE): ≈ 0.42 seconds

Trained on 2023 lap-level F1 dataset

⚡ Performance Optimization

Originally strategy simulation required thousands of model calls.

Optimizations implemented:

Batch inference (predict_lap_delta_batch)

Vectorized NumPy slicing

Reduced DataFrame reconstruction

Precomputed stint deltas

Eliminated redundant model loading

Current simulation runtime: < 0.5 seconds

📁 Project Structure
F1-Intelligent-Race-Analytics/
│
├── backend/              # FastAPI inference & simulation
├── frontend/             # React analytics dashboard
├── training/             # Model training & feature pipeline
├── data/                 # Dataset documentation (raw data excluded)
├── models/               # Model documentation (model excluded)
├── README.md
└── requirements.txt
🔄 Reproducibility

Raw telemetry and trained model files are excluded from the repository to keep it lightweight and scalable.

To reproduce:

Regenerate dataset using the training pipeline.

Train model using training/train_model.py.

Place trained model inside models/.

This design follows professional ML repository standards.

🌍 Deployment Plan

Backend → Render
Frontend → Vercel

Environment variable for model path:

MODEL_PATH=models/lap_delta_driveraware_v3_final.pkl
🎯 Future Improvements

Probabilistic lap delta prediction (quantile regression)

Safety car event modeling

Driver aggressiveness coefficient

Dynamic track temperature modeling

Reinforcement learning strategy agent

🏆 Why This Project Stands Out

Real-world telemetry-based modeling

Optimized inference architecture

Vectorized simulation engine

Production-ready API design

Full-stack analytics interface

Clean ML reproducibility structure

👤 Author

Abhijeet Kulkarni
AI & Systems Enthusiast
Formula 1 Analytics Developer