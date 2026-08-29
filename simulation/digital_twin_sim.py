def simulate_response(success_rate: float, risk_score: float, treatment_strength: float):
    adjusted = success_rate + (treatment_strength * 8) - (risk_score * 5)

    if adjusted >= 80:
        level = "Positive"
    elif adjusted >= 60:
        level = "Uncertain"
    else:
        level = "Negative"

    return {
        "predicted_response": round(adjusted, 2),
        "response_level": level
    }


if __name__ == "__main__":
    result = simulate_response(
        success_rate=72,
        risk_score=2.4,
        treatment_strength=1.1
    )
    print(result)