import json
from pathlib import Path


DATA_PATH = Path("../data/sample/bio_experiments.json")


def load_experiments():
    with DATA_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def classify_priority(exp):
    success = exp.get("success_rate", 0)
    risk = exp.get("risk_level", "Medium")

    if success >= 80 and risk == "Low":
        return "High Priority"
    if success >= 70:
        return "Review"
    return "Needs Improvement"


def analyze():
    experiments = load_experiments()

    results = []
    for exp in experiments:
        results.append({
            "id": exp["id"],
            "domain": exp["domain"],
            "success_rate": exp["success_rate"],
            "risk_level": exp["risk_level"],
            "priority": classify_priority(exp)
        })

    return results


if __name__ == "__main__":
    for item in analyze():
        print(item)