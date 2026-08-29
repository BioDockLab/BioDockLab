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

OUTPUT = OUT_DIR / "BioDockLab_화면자료_전체12장_확장기획포함.pdf"

SCREENS = [
    (
        "01_login_role_based_access.png",
        "01. Login Screen",
        "역할 기반 시스템이라는 첫인상",
        "로그인 전에는 내부 화면에 접근할 수 없고, 환자·간호사·의사·약사·원무·연구자·보안관리자 등 역할에 따라 진입합니다."
    ),
    (
        "02_patient_explanation_report.png",
        "02. Patient View",
        "환자 설명 보조 방향",
        "환자는 진단을 받는 것이 아니라, 의료진 상담을 준비하기 위한 쉬운 설명 리포트를 확인합니다."
    ),
    (
        "03_nurse_handoff_workspace.png",
        "03. Nurse Workspace",
        "간호학과 검토 요청의 핵심",
        "간호사 화면은 바이탈, 인수인계, 투약 전 확인을 보조하며 EMR이나 간호기록을 대체하지 않습니다."
    ),
    (
        "04_doctor_result_summary.png",
        "04. Doctor Workspace",
        "의사용 결과 요약 및 설명 연결",
        "의사는 환자 설명 리포트와 전문가용 해석을 함께 확인하여 상담 준비를 보조받습니다."
    ),
    (
        "05_pharmacist_prescription_review.png",
        "05. Pharmacist Workspace",
        "처방량·상호작용 검토",
        "약사는 처방량, 병용약, 약물상호작용, 유전자 적합성 정보를 중심으로 검토합니다."
    ),
    (
        "06_admin_consent_document_view.png",
        "06. Administration View",
        "예약·동의서·서류 상태",
        "원무는 예약, 동의서, 서류 상태 등 업무에 필요한 최소 정보만 확인하고 진단·처방 상세는 제한됩니다."
    ),
    (
        "07_research_virtual_docking_lab.png",
        "07. Research Lab",
        "바이오그래머/연구자 포인트",
        "연구자는 비식별 연구 데이터와 단백질-화합물 가상 도킹 실험 흐름을 확인합니다."
    ),
    (
        "08_security_audit_center.png",
        "08. Security Center",
        "보안·접근 로그 차별점",
        "보안관리자는 누가 어떤 정보에 접근했는지, 권한 밖 접근이 있었는지 감사 로그와 위험 이벤트로 확인합니다."
    ),
    (
        "09_platform_admin_policy_matrix.png",
        "09. Platform Admin Console",
        "상용화형 권한 정책 구조",
        "플랫폼 관리자는 역할별 권한 매트릭스와 접근 정책을 확인하고 관리합니다."
    ),
    (
        "10_access_denied_audit_log.png",
        "10. Access Denied",
        "권한 없는 접근 차단",
        "권한 없는 화면 접근은 차단되고, 해당 시도는 보안 감사 로그에 기록됩니다."
    ),
    (
        "11_nurse_role_workspace.png",
        "11. My Workspace - Nurse",
        "간호사 역할별 업무 정리",
        "역할별 워크스페이스는 각 직군이 수행하는 업무, 접근 가능한 데이터, 제한되는 데이터를 정리합니다."
    ),
    (
        "12_bio_security_architect_workspace.png",
        "12. My Workspace - Bio Security Architect",
        "바이오그래머 보안 직무 예시",
        "Bio Security Architect는 의료·바이오 데이터의 접근권한, 감사 로그, 내부자 과다열람 탐지 구조를 설계하는 역할입니다."
    ),
]

def draw_header(c, title, subtitle):
    w, h = landscape(A4)
    c.setFillColor(colors.HexColor("#0f172a"))
    c.setFont("Helvetica-Bold", 18)
    c.drawString(18 * mm, h - 18 * mm, title)

    c.setFillColor(colors.HexColor("#2563eb"))
    c.setFont("Helvetica-Bold", 11)
    c.drawString(18 * mm, h - 26 * mm, subtitle)

def draw_caption(c, caption):
    w, h = landscape(A4)
    c.setFillColor(colors.HexColor("#334155"))
    c.setFont("Helvetica", 10)
    text = c.beginText(18 * mm, 15 * mm)
    text.setLeading(13)

    max_chars = 118
    words = caption.split()
    line = ""
    for word in words:
        if len(line + " " + word) > max_chars:
            text.textLine(line)
            line = word
        else:
            line = (line + " " + word).strip()
    if line:
        text.textLine(line)

    c.drawText(text)

def draw_image_page(c, image_path, title, subtitle, caption):
    w, h = landscape(A4)

    draw_header(c, title, subtitle)

    top = h - 34 * mm
    bottom = 27 * mm
    left = 14 * mm
    right = w - 14 * mm

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
    c.roundRect(x - 2 * mm, y - 2 * mm, draw_w + 4 * mm, draw_h + 4 * mm, 5 * mm, stroke=1, fill=0)

    c.drawImage(str(image_path), x, y, width=draw_w, height=draw_h, preserveAspectRatio=True, mask="auto")
    draw_caption(c, caption)
    c.showPage()

def draw_protein_atlas_page(c):
    w, h = landscape(A4)

    draw_header(
        c,
        "13. BioDockLab Protein Atlas",
        "교육·연구용 단백질 구조·변이·질환 탐색 확장기획"
    )

    c.setFillColor(colors.HexColor("#0f172a"))
    c.setFont("Helvetica-Bold", 22)
    c.drawString(18 * mm, h - 45 * mm, "Protein Atlas Extension Concept")

    c.setFillColor(colors.HexColor("#475569"))
    c.setFont("Helvetica", 11)

    intro = (
        "BioDockLab Protein Atlas는 환자 진료용 기능이 아니라, 학생·연구자·비전공자가 "
        "단백질 구조, 주요 변이, 관련 질환, 후보 리간드 정보를 한 화면에서 이해할 수 있도록 돕는 "
        "교육·연구 보조 기능입니다."
    )

    text = c.beginText(18 * mm, h - 58 * mm)
    text.setLeading(15)
    for line in [
        "Purpose",
        intro,
        "",
        "Core Functions",
        "- 단백질 기본 정보: 이름, PDB ID, 기능, 구조 유형",
        "- 질환 연계: 관련 암/감염병/유전 변이 정보",
        "- 변이 정보: EGFR L858R, KRAS G12D, BRAF V600E 등",
        "- 3D 구조 미리보기: 활성 부위, 결합 리간드, 변이 위치 강조",
        "- 대표 리간드/후보 화합물: 연구자용 도킹 실험 화면과 연결",
        "- Glossary: 활성 부위, 리간드, 도킹, RMSD, 결합 친화도 등 용어 설명",
        "",
        "Recommended Protein Samples",
        "- EGFR L858R",
        "- KRAS G12D",
        "- BRAF V600E",
        "- ALK",
        "- HER2",
        "- SARS-CoV-2 Main Protease",
        "",
        "Positioning",
        "이 기능은 진단·처방을 위한 화면이 아니라, BioDockLab의 연구자 화면과 연결되는 교육·연구용 탐색 기능입니다."
    ]:
        text.textLine(line)

    c.drawText(text)

    # right side concept cards
    x = 180 * mm
    y = h - 60 * mm
    card_w = 95 * mm
    card_h = 23 * mm

    cards = [
        ("EGFR L858R", "비소세포폐암(NSCLC) 관련 변이 예시"),
        ("KRAS G12D", "암 표적 연구와 도킹 실험 예시"),
        ("BRAF V600E", "표적치료와 변이 이해 교육 예시"),
        ("Protein → Disease → Ligand", "단백질-질환-후보화합물 연결 탐색")
    ]

    for title, desc in cards:
        c.setFillColor(colors.HexColor("#f8fafc"))
        c.setStrokeColor(colors.HexColor("#dbeafe"))
        c.roundRect(x, y, card_w, card_h, 5 * mm, fill=1, stroke=1)

        c.setFillColor(colors.HexColor("#1d4ed8"))
        c.setFont("Helvetica-Bold", 12)
        c.drawString(x + 6 * mm, y + 13 * mm, title)

        c.setFillColor(colors.HexColor("#475569"))
        c.setFont("Helvetica", 9)
        c.drawString(x + 6 * mm, y + 6 * mm, desc)

        y -= 30 * mm

    c.showPage()

def main():
    missing = []
    for filename, *_ in SCREENS:
        if not (SHOT_DIR / filename).exists():
            missing.append(filename)

    if missing:
        print("Missing screenshot files:")
        for f in missing:
            print(" -", SHOT_DIR / f)
        print()
        print("먼저 캡처 파일명을 위 목록에 맞춰 docs/review/screenshots/ 폴더에 넣어주세요.")
        raise SystemExit(1)

    c = canvas.Canvas(str(OUTPUT), pagesize=landscape(A4))

    for filename, title, subtitle, caption in SCREENS:
        draw_image_page(c, SHOT_DIR / filename, title, subtitle, caption)

    draw_protein_atlas_page(c)
    c.save()

    print("created:", OUTPUT)

if __name__ == "__main__":
    main()
