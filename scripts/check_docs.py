from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGETS = [ROOT / "README.md"] + list((ROOT / "docs").rglob("*.md"))

required_sections = {
    "README.md": ["Overview", "Documentation", "Current Status", "Roadmap", "Limitations", "Disclaimer"],
}

def check_fences(path: Path, text: str) -> list[str]:
    if text.count("```") % 2 != 0:
        return [f"Unclosed code fence: {path}"]
    return []

def check_required_sections(path: Path, text: str) -> list[str]:
    rel = str(path.relative_to(ROOT))
    issues = []
    for section in required_sections.get(rel, []):
        if f"## {section}" not in text:
            issues.append(f"Missing section '{section}': {rel}")
    return issues

def main() -> int:
    issues = []

    for path in TARGETS:
        text = path.read_text(errors="ignore")
        issues.extend(check_fences(path.relative_to(ROOT), text))
        issues.extend(check_required_sections(path, text))

    if issues:
        print("Documentation check failed:")
        for issue in issues:
            print(f"- {issue}")
        return 1

    print("Documentation check passed.")
    print(f"Checked files: {len(TARGETS)}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
