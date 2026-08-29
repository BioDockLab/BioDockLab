from pathlib import Path
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from PIL import Image

BASE = Path(".")
SHOT_DIR = BASE / "docs/review/screenshots"
OUT_DIR = BASE / "docs/review/output"
OUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT = OUT_DIR / "BioDockLab_화면자료_전체13장_ProteinAtlas확장기획포함.pdf"

SCREENS = [
    (
        "00_integrated_bio_platform_dashboard.png",
        "00. Integrated Bio Platform Dashboard",
        "BioDockLab 전체 플랫폼 개요",
        "환자 설명, 연구 실험, 보안 감사, 역할 기반 접근 구조가 하나의 플랫폼으로 연결된다는 첫인상을 보여주는 통합 대시보드 화면입니다."
    ),
    (
        "01_login_role_based_access.png",
        "01. Login Screen",
        "역할 기반 로그인 화면",
        "환자·간호사·의사·약사·원무·연구자·보안관리자가 서로 다른 권한으로 접속한다는 구조를 보여주는 진입 화면입니다."
    ),
    (
        "02_patient_explanation_report.png",
        "02. Patient Explanation Report",
        "환자/의사용 결과 설명 리포트",
        "복잡한 검사 결과와 후보 치료제 정보를 환자와 의료진이 이해하기 쉽게 확인할 수 있도록 구성한 설명 보조 화면입니다."
    ),
    (
        "03_nurse_handoff_workspace.png",
        "03. Nurse Workspace",
        "간호사용 바이탈·인수인계 보조 화면",
        "바이탈 요약, 투약 전 확인, 인수인계 요약을 제공하지만 EMR이나 간호기록을 대체하지 않는 보조 화면입니다."
    ),
    (
        "04_doctor_result_summary.png",
        "04. Doctor Workspace",
        "의사용 결과 요약 화면",
        "환자 상태, 검사 결과, 설명 리포트, 상담 준비 정보를 의료진 관점에서 확인하는 화면입니다."
    ),
    (
        "05_pharmacist_prescription_review.png",
        "05. Pharmacist Workspace",
        "약사용 처방 검토 화면",
        "처방량, 병용약, 약물상호작용, 유전자 적합성 정보를 중심으로 검토하는 화면입니다."
    ),
    (
        "06_admin_consent_document_view.png",
        "06. Administration View",
        "원무용 예약·동의서·서류 상태 화면",
        "원무는 예약, 동의서, 서류 발급 상태 등 업무에 필요한 최소 정보만 확인하고 진단·처방 상세는 제한되는 구조입니다."
    ),
    (
        "07_research_virtual_docking_lab.png",
        "07. Research Lab",
        "연구자용 단백질-화합물 가상 도킹 실험 화면",
        "타겟 단백질, 후보 화합물, 3D 구조, 도킹 점수, 실험 파라미터를 확인하는 연구 워크플로우 화면입니다."
    ),
    (
        "08_security_audit_center.png",
        "08. Security Center",
        "보안관리자용 접근 감사 로그 화면",
        "누가 어떤 정보에 접근했는지, 권한 밖 접근이 있었는지, 내부자 과다열람 의심 이벤트가 있는지 확인하는 화면입니다."
    ),
    (
        "09_platform_admin_policy_matrix.png",
        "09. Platform Admin Console",
        "플랫폼 관리자용 권한 정책 매트릭스 화면",
        "역할별 접근 가능 화면, 차단 정책, 계정 관리, 상용화 보안 체크리스트를 확인하는 관리자 화면입니다."
    ),
    (
        "10_access_denied_audit_log.png",
        "10. Access Denied",
        "권한 없는 접근 차단 화면",
        "사용자가 허용되지 않은 화면에 접근하려 할 때 차단하고, 해당 시도를 보안 감사 로그에 기록한다는 구조를 보여주는 화면입니다."
    ),
    (
        "11_nurse_role_workspace.png",
        "11. My Workspace - Nurse",
        "간호사 역할별 워크스페이스 화면",
        "간호사가 수행하는 주요 업무, 접근 가능한 데이터, 제한되는 데이터, 생성 산출물을 정리한 역할 설명 화면입니다."
    ),
    (
        "12_bio_security_architect_workspace.png",
        "12. My Workspace - Bio Security Architect",
        "Bio Security Architect 워크스페이스 화면",
        "바이오그래머 직무 중 보안·권한·감사 로그·내부자 위험 탐지를 설계하는 역할을 보여주는 화면입니다."
    ),
]

def wrap_text(text, max_chars):
    words = text.split()
    lines = []
    line = ""
    for word in words:
        if len(line + " " + word) > max_chars:
            lines.append(line)
            line = word
        else:
            line = (line + " " + word).strip()
    if line:
        lines.append(line)
    return lines

def draw_image_page(c, image_path, title, subtitle, caption):
    w, h = landscape(A4)

    c.setFillColor(colors.HexColor("#0f172a"))
    c.setFont("Helvetica-Bold", 18)
    c.drawString(16 * mm, h - 15 * mm, title)

    c.setFillColor(colors.HexColor("#2563eb"))
    c.setFont("Helvetica-Bold", 11)
    c.drawString(16 * mm, h - 23 * mm, subtitle)

    c.setFillColor(colors.HexColor("#475569"))
    c.setFont("Helvetica", 9)

    y_caption_top = h - 31 * mm
    for line in wrap_text(caption, 115):
        c.drawString(16 * mm, y_caption_top, line)
        y_caption_top -= 5 * mm

    top = h - 43 * mm
    bottom = 14 * mm
    left = 13 * mm
    right = w - 13 * mm

    max_w = right - left
    max_h = top - bottom

    with Image.open(image_path) as img:
        iw, ih = img.size

    scale = min(max_w / iw, max_h / ih)
    draw_w = iw * scale
    draw_h = ih * scale

    x = (w - draw_w) / 2
    y = bottom + (max_h - draw_h) / 2

    c.setStrokeColor(colors.HexColor("#e2e8f0"))
    c.setLineWidth(1)
    c.roundRect(x - 2 * mm, y - 2 * mm, draw_w + 4 * mm, draw_h + 4 * mm, 4 * mm, stroke=1, fill=0)

    c.drawImage(str(image_path), x, y, width=draw_w, height=draw_h, preserveAspectRatio=True, mask="auto")

    c.setFillColor(colors.HexColor("#64748b"))
    c.setFont("Helvetica", 8)
    c.drawString(16 * mm, 7 * mm, "※ 샘플 데이터 기반 프로토타입 화면이며, 실제 진단·처방·임상 판단 기능이 아닙니다.")

    c.showPage()

def draw_protein_atlas_page(c):
    w, h = landscape(A4)

    c.setFillColor(colors.HexColor("#0f172a"))
    c.setFont("Helvetica-Bold", 20)
    c.drawString(16 * mm, h - 16 * mm, "13. BioDockLab Protein Atlas 확장기획")

    c.setFillColor(colors.HexColor("#2563eb"))
    c.setFont("Helvetica-Bold", 11)
    c.drawString(16 * mm, h - 25 * mm, "교육·연구용 단백질 구조·변이·질환 탐색 기능")

    y = h - 40 * mm

    sections = [
        ("기능 정의", [
            "Protein Atlas는 환자 진료용 기능이 아니라, 학생·연구자·비전공자가 단백질 구조, 주요 변이, 관련 질환, 후보 리간드 정보를 이해하도록 돕는 교육·연구 보조 기능입니다.",
            "BioDockLab의 핵심인 역할 기반 접근제어와 설명 보조 기능을 연구자·교육용 화면으로 확장하는 방향입니다."
        ]),
        ("핵심 기능", [
            "단백질 기본 정보 카드: 단백질명, PDB ID, 주요 기능, 관련 질환, 구조 유형, 주요 변이",
            "3D 구조 미리보기: 단백질 표면, 활성 부위, 결합 리간드, 변이 위치 강조",
            "질환·변이·리간드 연결: 단백질 → 주요 변이 → 관련 질환 → 후보 리간드/화합물 → 연구 실험",
            "용어 설명: 활성 부위, 리간드, 도킹, 결합 친화도, RMSD, 변이, 표적치료, 비식별 데이터"
        ]),
        ("추천 샘플 단백질", [
            "EGFR L858R: 폐암 표적치료 예시",
            "KRAS G12D: 암 표적 연구 예시",
            "BRAF V600E: 변이 기반 표적치료 설명",
            "ALK: 융합유전자 및 표적치료 예시",
            "HER2: 유방암/위암 관련 표적 예시",
            "SARS-CoV-2 Main Protease: 감염병·항바이러스제 연구 예시"
        ]),
        ("활용 가능성", [
            "간호학과·생명과학·보건계열 학생 교육",
            "바이오그래머 직무 설명 자료",
            "연구자용 실험 전 사전 탐색 화면",
            "환자 설명 리포트의 배경 이해 자료",
            "단백질-화합물 도킹 실험 흐름의 시각자료"
        ]),
        ("주의할 점", [
            "이 기능은 실제 진단, 처방, 치료 결정 기능이 아닙니다.",
            "Protein Atlas는 교육·연구 보조 화면이며, 실제 의료 판단은 의료진이 수행해야 합니다.",
            "단백질 구조나 도킹 점수는 실제 임상 효능을 보장하지 않습니다."
        ]),
    ]

    for heading, lines in sections:
        c.setFillColor(colors.HexColor("#1d4ed8"))
        c.setFont("Helvetica-Bold", 13)
        c.drawString(16 * mm, y, heading)
        y -= 8 * mm

        c.setFillColor(colors.HexColor("#334155"))
        c.setFont("Helvetica", 9.5)
        for item in lines:
            wrapped = wrap_text("• " + item, 105)
            for line in wrapped:
                c.drawString(20 * mm, y, line)
                y -= 5 * mm
            y -= 1 * mm

        y -= 4 * mm

    c.setFillColor(colors.HexColor("#0f172a"))
    c.setFont("Helvetica-Bold", 11)
    c.drawString(16 * mm, 14 * mm, "한 줄 요약")
    c.setFillColor(colors.HexColor("#334155"))
    c.setFont("Helvetica", 9.5)
    c.drawString(16 * mm, 8 * mm, "BioDockLab Protein Atlas는 단백질 구조·변이·질환·후보 화합물 정보를 연결해 보여주는 교육·연구용 단백질 도감 기능입니다.")

    c.showPage()

def main():
    missing = []
    for filename, *_ in SCREENS:
        if not (SHOT_DIR / filename).exists():
            missing.append(filename)

    if missing:
        print("Missing screenshot files:")
        for filename in missing:
            print(" -", SHOT_DIR / filename)
        raise SystemExit(1)

    c = canvas.Canvas(str(OUTPUT), pagesize=landscape(A4))

    for filename, title, subtitle, caption in SCREENS:
        draw_image_page(c, SHOT_DIR / filename, title, subtitle, caption)

    draw_protein_atlas_page(c)

    c.save()
    print("created:", OUTPUT)

if __name__ == "__main__":
    main()
