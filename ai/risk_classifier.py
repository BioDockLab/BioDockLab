"""
BioDockLab risk classifier.

This module provides a lightweight rule-based classifier before
a full machine learning model is introduced.
"""


def classify_risk(success_rate: float, risk_level: str) -> str:
    if risk_level == "High" and success_rate < 70:
        return "Critical"

    if risk_level == "Medium" and success_rate < 75:
        return "Watch"

    if risk_level == "Low" and success_rate >= 80:
        return "Stable"

    return "Review"


def recommend_action(classification: str) -> str:
    actions = {
        "Critical": "Stop and redesign experiment condition",
        "Watch": "Compare with similar experiment records",
        "Stable": "Proceed to next validation stage",
        "Review": "Run additional analysis before decision",
    }

    return actions.get(classification, "Review experiment manually")


def analyze_experiment_risk(exp: dict) -> dict:
    classification = classify_risk(
        success_rate=exp.get("success_rate", 0),
        risk_level=exp.get("risk_level", "Medium"),
    )

    return {
        "id": exp["id"],
        "domain": exp["domain"],
        "classification": classification,
        "recommendation": recommend_action(classification),
    }