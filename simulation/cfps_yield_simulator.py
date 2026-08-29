"""
CFPS yield simulator for BioDockLab.

CFPS means Cell-Free Protein Synthesis.
This module estimates protein production yield from temperature,
reaction time, enzyme quality, and substrate availability.
"""


def simulate_cfps_yield(
    temperature: float,
    duration_hours: float,
    enzyme_quality: float,
    substrate_level: float,
) -> dict:
    temp_penalty = abs(30 - temperature) * 2.5
    time_effect = min(duration_hours * 8, 60)
    enzyme_effect = enzyme_quality * 25
    substrate_effect = substrate_level * 20

    yield_score = time_effect + enzyme_effect + substrate_effect - temp_penalty
    yield_score = max(0, min(100, yield_score))

    if yield_score >= 80:
        status = "High yield"
    elif yield_score >= 55:
        status = "Usable yield"
    else:
        status = "Low yield"

    return {
        "predicted_yield": round(yield_score, 2),
        "status": status,
    }


if __name__ == "__main__":
    print(
        simulate_cfps_yield(
            temperature=30,
            duration_hours=6,
            enzyme_quality=0.8,
            substrate_level=0.7,
        )
    )