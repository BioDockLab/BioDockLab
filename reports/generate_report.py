from datetime import datetime
from pathlib import Path
import json

DATA_PATH = Path("../data/sample/bio_experiments.json")
OUTPUT_PATH = Path("BioDockLab_Report.md")


def load_data():
    with DATA_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def generate_report():
    experiments = load_data()

    lines = []
    lines.append("# BioDockLab Research Report")
    lines.append("")
    lines.append(f"Generated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append("")
    lines.append("## Experiment Summary")
    lines.append("")

    for exp in experiments:
        lines.append(f"### {exp['id']} - {exp['domain']}")
        lines.append("")
        lines.append(f"- Sample: {exp['sample']}")
        lines.append(f"- Condition: {exp['condition']}")
        lines.append(f"- Success Rate: {exp['success_rate']}%")
        lines.append(f"- Risk Level: {exp['risk_level']}")
        lines.append(f"- Note: {exp['note']}")
        lines.append("")

    OUTPUT_PATH.write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    generate_report()
    print(f"Report generated: {OUTPUT_PATH}")