"""
BioDockLab report builder.

This module turns experiment analysis results into a structured
research note that can later be exported to Markdown or PDF.
"""


def build_experiment_section(exp: dict, analysis: dict | None = None) -> str:
    lines = [
        f"### {exp['id']} - {exp['domain']}",
        "",
        f"- Sample: {exp['sample']}",
        f"- Condition: {exp['condition']}",
        f"- Success Rate: {exp['success_rate']}%",
        f"- Risk Level: {exp['risk_level']}",
        f"- Note: {exp['note']}",
    ]

    if analysis:
        lines.extend(
            [
                "",
                "#### Analysis",
                f"- Classification: {analysis.get('classification', 'N/A')}",
                f"- Recommendation: {analysis.get('recommendation', 'N/A')}",
            ]
        )

    return "\n".join(lines)


def build_research_report(experiments: list[dict], analyses: list[dict]) -> str:
    analysis_map = {item["id"]: item for item in analyses}

    sections = [
        "# BioDockLab Research Report",
        "",
        "## Summary",
        "",
        "This report summarizes bio experiment data and analysis results.",
        "",
    ]

    for exp in experiments:
        sections.append(build_experiment_section(exp, analysis_map.get(exp["id"])))
        sections.append("")

    return "\n".join(sections)