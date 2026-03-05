import argparse
import json
import os
import sys
from typing import Any, Dict

import dill
import joblib
import numpy as np

FEATURE_ORDER = [
    "bodyType",
    "sex",
    "diet",
    "showerFrequency",
    "heatingEnergySource",
    "transport",
    "vehicleType",
    "socialActivity",
    "monthlyGroceryBill",
    "airTravelFrequency",
    "vehicleMonthlyDistanceKm",
    "wasteBagSize",
    "wasteBagWeeklyCount",
    "tvPcHoursDaily",
    "newClothesMonthly",
    "internetHoursDaily",
    "energyEfficiency",
    "recycling",
    "cookingWith"
]

NUMERIC_FEATURES = {
    "monthlyGroceryBill",
    "vehicleMonthlyDistanceKm",
    "wasteBagWeeklyCount",
    "tvPcHoursDaily",
    "newClothesMonthly",
    "internetHoursDaily"
}

CATEGORICAL_OPTIONS = {
    "bodyType": ["slender", "average", "athletic", "heavy"],
    "sex": ["male", "female"],
    "diet": ["vegan", "vegetarian", "omnivore", "pescatarian"],
    "showerFrequency": ["daily", "twice a day", "less often"],
    "heatingEnergySource": ["electricity", "natural gas", "coal / wood"],
    "transport": ["public", "car", "walk"],
    "vehicleType": ["none", "petrol", "diesel", "hybrid", "electric"],
    "socialActivity": ["never", "sometimes", "often"],
    "airTravelFrequency": ["never", "rarely", "frequently", "very frequently"],
    "wasteBagSize": ["small", "medium", "large"],
    "energyEfficiency": ["no", "sometimes", "yes"],
    "recycling": ["no", "yes"],
    "cookingWith": ["induction", "gas", "microwave"]
}


def normalize_value(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip().lower()
    return str(value).strip().lower()


def normalize_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    transport = normalize_value(payload.get("transport"))
    if transport and transport != "car":
        payload = dict(payload)
        payload["vehicleType"] = payload.get("vehicleType") or "none"
        payload["vehicleMonthlyDistanceKm"] = 0
    return payload


def encode_payload(payload: Dict[str, Any]) -> np.ndarray:
    payload = normalize_payload(payload)
    errors = []
    features = []

    for key in FEATURE_ORDER:
        if key in NUMERIC_FEATURES:
            raw = payload.get(key, 0)
            try:
                value = float(raw)
            except (TypeError, ValueError):
                errors.append(f"Invalid numeric value for {key}: {raw}")
                value = 0.0
            features.append(value)
        else:
            raw = payload.get(key)
            if key == "vehicleType" and (raw is None or str(raw).strip() == ""):
                raw = "none"
            normalized = normalize_value(raw)
            options = CATEGORICAL_OPTIONS[key]
            mapping = {option: index for index, option in enumerate(options)}
            if normalized not in mapping:
                errors.append(f"Invalid value for {key}: {raw}")
                value = 0.0
            else:
                value = float(mapping[normalized])
            features.append(value)

    if errors:
        raise ValueError("; ".join(errors))

    return np.array([features], dtype=float)


def load_model(model_path: str):
    with open(model_path, "rb") as handle:
        return dill.load(handle)


def load_scaler(scaler_path: str):
    return joblib.load(scaler_path)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default=os.environ.get("MODEL_PATH"))
    parser.add_argument("--scaler", default=os.environ.get("SCALER_PATH"))
    args = parser.parse_args()

    if not args.model or not args.scaler:
        print("Missing --model or --scaler path.", file=sys.stderr)
        return 1

    raw = sys.stdin.read()
    if not raw.strip():
        print("Missing input payload.", file=sys.stderr)
        return 1

    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as exc:
        print(f"Invalid JSON input: {exc}", file=sys.stderr)
        return 1

    try:
        features = encode_payload(payload)
        scaler = load_scaler(args.scaler)
        model = load_model(args.model)
        scaled = scaler.transform(features)
        prediction = float(model.predict(scaled)[0])
    except Exception as exc:
        print(f"Prediction failed: {exc}", file=sys.stderr)
        return 1

    print(json.dumps({"prediction": prediction}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
