"""
Organoid response simulator for BioDockLab.

This is an early digital-twin style simulation module.
It estimates organoid response from treatment strength, duration,
and biological risk.
"""


def simulate_organoid_response(
    base_viability: float,
    treatment_strength: float,
    duration_hours: float,
    risk_score: float,
) -> dict:
    response = base_viability
    response += treatment_strength * 6
    response -= risk_score * 4
    response -= max(0, duration_hours - 72) * 0.15

    response = max(0, min(100, response))

    if response >= 80:
        label = "Strong response"
    elif response >= 60:
        label = "Moderate response"
    else:
        label = "Weak response"

    return {
        "predicted_viability": round(response, 2),
        "response_label": label,
    }


if __name__ == "__main__":
    print(
        simulate_organoid_response(
            base_viability=72,
            treatment_strength=1.4,
            duration_hours=72,
            risk_score=2,
        )
    )