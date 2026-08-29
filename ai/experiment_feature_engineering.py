"""
BioDockLab experiment feature engineering module.

This module converts raw bio experiment records into numeric features
that can later be used by machine learning models.
"""

RISK_SCORE = {
    "Low": 1,
    "Medium": 2,
    "High": 3,
}


def encode_experiment(exp: dict) -> dict:
    return {
        "id": exp["id"],
        "domain": exp["domain"],
        "temperature": exp.get("temperature") or 0,
        "duration_hours": exp.get("duration_hours") or 0,
        "success_rate": exp.get("success_rate") or 0,
        "risk_score": RISK_SCORE.get(exp.get("risk_level", "Medium"), 2),
    }


def build_feature_vector(exp: dict) -> list[float]:
    encoded = encode_experiment(exp)

    return [
        float(encoded["temperature"]),
        float(encoded["duration_hours"]),
        float(encoded["success_rate"]),
        float(encoded["risk_score"]),
    ]


def normalize_success_rate(success_rate: float) -> float:
    return max(0.0, min(1.0, success_rate / 100))