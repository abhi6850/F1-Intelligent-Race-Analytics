F1 Intelligent Race Analytics

F1 Intelligent Race Analytics is a machine learning–based race simulation platform designed to model lap performance and evaluate race strategies using real 2023 Formula 1 telemetry data.

The system predicts lap time deltas using a trained RandomForestRegressor and builds a simulation layer on top of it to analyze pit strategies, tyre behavior, and race pace under different conditions.

Unlike a static analytics dashboard, this project focuses on efficient simulation through vectorized computations and optimized model inference.

Overview

This project combines a FastAPI backend, a React-based frontend, and a machine learning model to simulate race scenarios and provide insights into strategy decisions.

The model is trained on lap-level telemetry data and captures factors such as tyre degradation, fuel load, race progression, and track characteristics to estimate lap performance.

Features
Lap Delta Prediction

The system predicts lap time delta using features such as:

Tyre life

Stint number

Fuel proxy

Race progress

Compound type

Driver and team encoding

Track-specific features

Strategy Simulation

The simulation engine supports:

Optimal pit strategy evaluation

Strategy A vs Strategy B comparison

Undercut analysis

Tyre degradation modeling

Race pace simulation

All simulations are implemented using vectorized operations to ensure fast execution.

Interactive Dashboard

The frontend is built using React and provides:

Lap delta visualizations

Tyre degradation graphs

Strategy comparison charts

Race simulation outputs

System Architecture

The system follows a simple layered architecture:

React Frontend → FastAPI Backend → ML Model → Simulation Layer

Backend

FastAPI

scikit-learn

pandas

NumPy

joblib

Frontend

React (Vite)

React Router

Recharts

Machine Learning Model

The model used is a RandomForestRegressor trained on lap-level data.

Hyperparameters:

n_estimators = 300

max_depth = 18

min_samples_split = 5

min_samples_leaf = 2

random_state = 42

n_jobs = -1

Target:
LapDelta_seconds

Feature Engineering

The following features were engineered to improve prediction quality:

TyreLifeSquared = TyreLife²

FuelProxy = 1 − (LapNumber / TotalLaps)

RaceProgress = LapNumber / TotalLaps

Track one-hot encoding

Track-specific tyre interaction features

Model Performance

Mean Absolute Error (MAE): approximately 0.42 seconds

Dataset: 2023 Formula 1 lap-level telemetry

Performance Optimization

The initial implementation relied on repeated model calls, leading to slow simulations.

The system was optimized by:

Introducing batch prediction for lap delta computation

Using vectorized NumPy operations

Reducing DataFrame reconstruction overhead

Precomputing stint-level deltas

Avoiding repeated model loading

As a result, most simulations now execute in under 0.5 seconds.

Project Structure
F1-Intelligent-Race-Analytics/
│
├── backend/       # FastAPI inference and simulation logic
├── frontend/      # React dashboard
├── training/      # Model training and feature pipeline
├── data/          # Dataset documentation (raw data excluded)
├── models/        # Model documentation (model excluded)
├── README.md
└── requirements.txt
Reproducibility

Raw telemetry data and trained model files are not included in the repository to keep it lightweight.

To reproduce results:

Generate the dataset using the training pipeline

Train the model using the provided training scripts

Place the trained model inside the models/ directory

Deployment

The project is designed to be deployed as:

Backend: Render

Frontend: Vercel

The model path is configured using an environment variable:

MODEL_PATH=models/lap_delta_driveraware_v3_final.pkl
Future Work

Probabilistic lap delta prediction

Safety car and race event modeling

Driver-specific behavior modeling

Track condition and temperature effects

Reinforcement learning–based strategy optimization

Author

Abhijeet Kulkarni
AI and Systems Enthusiast
Formula 1 Analytics Developer