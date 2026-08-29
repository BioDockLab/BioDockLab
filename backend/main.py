from pathlib import Path
import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "sample_data"
CORE_DATA_DIR = ROOT_DIR / "data" / "sample"

app = FastAPI(
    title="BioDockLab API",
    version="2.7.0",
    description="Patient digital twin, vital sign, clinical decision support API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_json(path: Path, fallback):
    if not path.exists():
        return fallback

    try:
        with path.open("r", encoding="utf-8") as file:
            return json.load(file)
    except Exception:
        return fallback


@app.get("/")
def root():
    return {
        "project": "BioDockLab",
        "version": "2.7",
        "message": "Patient digital twin hospital AI platform API",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "biodocklab-api",
        "version": "2.7.0",
    }


@app.get("/roles")
def get_roles():
    return [
        {
            "id": "patient",
            "name": "Patient",
            "description": "검사 결과와 설명 리포트를 확인하는 사용자",
            "focus": "알 권리, 결과 이해, 상담 준비",
        },
        {
            "id": "nurse",
            "name": "Nurse",
            "description": "바이탈사인과 인수인계 정보를 확인하는 사용자",
            "focus": "바이탈사인, 투약 전 확인, 상태 변화",
        },
        {
            "id": "doctor",
            "name": "Doctor",
            "description": "검사 결과와 위험도 평가를 기반으로 판단을 보조받는 사용자",
            "focus": "진단 보조, 치료 방향, 위험도 해석",
        },
        {
            "id": "pharmacist",
            "name": "Pharmacist",
            "description": "처방, 약물상호작용, 유전자 적합성을 검토하는 사용자",
            "focus": "처방 검토, 상호작용, 안전성",
        },
        {
            "id": "security",
            "name": "Security Officer",
            "description": "접근 로그와 민감정보 사용을 감사하는 사용자",
            "focus": "접근 제어, 감사 로그, 보안 정책",
        },
    ]


@app.get("/role-detail/{role_id}")
def get_role_detail(role_id: str):
    role_details = {
        "patient": {
            "title": "Patient Right-to-Know View",
            "summary": "환자가 자신의 검사 결과, 위험도, 설명 리포트를 이해할 수 있도록 제공하는 화면",
            "data_scope": ["검사 결과 요약", "위험도 설명", "의료진 상담 준비 자료", "환자 친화형 리포트"],
            "restricted": ["타 환자 정보", "내부 의료진 메모", "보안 로그"],
        },
        "nurse": {
            "title": "Nurse Vital Sign & Handoff View",
            "summary": "간호사가 바이탈사인, 인수인계, 상태 변화를 빠르게 확인하는 화면",
            "data_scope": ["바이탈사인", "투약 전 확인", "인수인계 메모", "상태 변화 알림"],
            "restricted": ["관리자 보안 정책", "연구자 전용 실험 데이터"],
        },
        "doctor": {
            "title": "Doctor Decision Support View",
            "summary": "의사가 검사 결과와 AI 위험도 분석을 기반으로 판단을 보조받는 화면",
            "data_scope": ["검사 결과", "AI 위험도 평가", "치료 방향 후보", "환자 상담 자료"],
            "restricted": ["원무 서류 처리 내역", "시스템 내부 보안 설정"],
        },
        "security": {
            "title": "Security Audit View",
            "summary": "보안관리자가 접근 기록, 권한 위반, 민감정보 접근을 감사하는 화면",
            "data_scope": ["접근 로그", "권한 정책", "위험 이벤트", "민감정보 접근 기록"],
            "restricted": ["환자 친화형 설명 화면 조작", "실험 결과 임의 수정"],
        },
    }

    return role_details.get(
        role_id,
        {
            "title": "Unknown Role",
            "summary": "등록되지 않은 역할이다.",
            "data_scope": [],
            "restricted": [],
        },
    )


@app.get("/experiments")
def get_experiments():
    fallback = [
        {
            "id": "ORG-001",
            "domain": "Organoid",
            "sample": "intestinal organoid",
            "condition": "growth factor A + drug candidate X",
            "success_rate": 78,
            "risk_level": "Medium",
        },
        {
            "id": "CFPS-001",
            "domain": "CFPS",
            "sample": "cell-free protein synthesis",
            "condition": "enzyme mix B + amino acid pool",
            "success_rate": 84,
            "risk_level": "Low",
        },
        {
            "id": "DT-001",
            "domain": "Digital Twin",
            "sample": "virtual patient model",
            "condition": "treatment response prediction",
            "success_rate": 69,
            "risk_level": "High",
        },
    ]

    data = load_json(CORE_DATA_DIR / "bio_experiments.json", fallback)

    if isinstance(data, dict):
        return data.get("experiments", fallback)

    return data


@app.get("/analysis")
def get_analysis():
    experiments = get_experiments()
    results = []

    for exp in experiments:
        success_rate = exp.get("success_rate", 0)
        risk_level = exp.get("risk_level", "Medium")

        if success_rate >= 80 and risk_level == "Low":
            priority = "High Priority"
            recommendation = "Proceed to validation report"
        elif success_rate >= 70:
            priority = "Review"
            recommendation = "Compare with baseline and request secondary review"
        else:
            priority = "Needs Improvement"
            recommendation = "Adjust experiment condition and rerun analysis"

        results.append(
            {
                "id": exp.get("id"),
                "priority": priority,
                "risk_level": risk_level,
                "recommendation": recommendation,
            }
        )

    return results


@app.get("/platform-summary")
def get_platform_summary():
    experiments = get_experiments()
    analysis = get_analysis()
    roles = get_roles()

    high_priority = sum(1 for item in analysis if item["priority"] == "High Priority")
    avg_success = round(
        sum(exp.get("success_rate", 0) for exp in experiments) / max(len(experiments), 1),
        1,
    )

    return {
        "roles": len(roles),
        "experiments": len(experiments),
        "high_priority": high_priority,
        "average_success_rate": avg_success,
        "research_directions": ["Organoid", "Surgery AI", "Quantum Biocomputing", "Digital Twin", "CFPS"],
    }


@app.get("/vital-signs")
def get_vital_signs():
    return load_json(DATA_DIR / "vital_signs.json", [])


@app.get("/patient-reports")
def get_patient_reports():
    return load_json(DATA_DIR / "patient_reports.json", [])


@app.get("/patient-reports/{patient_id}")
def get_patient_report(patient_id: str):
    reports = get_patient_reports()

    for report in reports:
        if report.get("patient_id") == patient_id:
            return report

    return {
        "patient_id": patient_id,
        "title": "Report Not Found",
        "summary": "해당 환자 설명 리포트가 없다.",
        "explanation": "",
        "right_to_know": [],
    }


@app.get("/hospital-summary")
def get_hospital_summary():
    vital_signs = get_vital_signs()
    watch_count = sum(1 for item in vital_signs if item.get("status") == "Watch")
    stable_count = sum(1 for item in vital_signs if item.get("status") == "Stable")

    avg_spo2 = round(
        sum(item.get("spo2", 0) for item in vital_signs) / max(len(vital_signs), 1),
        1,
    )

    return {
        "patients": len(vital_signs),
        "stable": stable_count,
        "watch": watch_count,
        "average_spo2": avg_spo2,
    }


@app.get("/doctor-decisions")
def get_doctor_decisions():
    return load_json(DATA_DIR / "doctor_decisions.json", [])


@app.get("/doctor-decisions/{patient_id}")
def get_doctor_decision(patient_id: str):
    decisions = get_doctor_decisions()

    for decision in decisions:
        if decision.get("patient_id") == patient_id:
            return decision

    return {
        "patient_id": patient_id,
        "risk_level": "Unknown",
        "clinical_summary": "해당 환자 판단 보조 데이터가 없다.",
        "decision_support": [],
        "next_action": "No action",
    }


@app.get("/clinical-timeline")
def get_clinical_timeline():
    return load_json(DATA_DIR / "clinical_timeline.json", [])


@app.get("/clinical-timeline/{patient_id}")
def get_clinical_timeline_by_patient(patient_id: str):
    timeline = get_clinical_timeline()
    return [item for item in timeline if item.get("patient_id") == patient_id]


@app.get("/hospital-audit-events")
def get_hospital_audit_events():
    return load_json(DATA_DIR / "hospital_audit_events.json", [])


@app.get("/hospital-audit-summary")
def get_hospital_audit_summary():
    events = get_hospital_audit_events()
    allowed = sum(1 for item in events if item.get("result") == "Allowed")
    denied = sum(1 for item in events if item.get("result") == "Denied")

    return {
        "events": len(events),
        "allowed": allowed,
        "denied": denied,
    }


@app.get("/digital-twin-findings")
def get_digital_twin_findings():
    fallback = [
        {
            "patient_id": "P-002",
            "model_type": "human-trauma-digital-twin",
            "overall_risk": "High",
            "summary": "혈압 저하, 심박수 증가, 산소포화도 저하가 함께 관찰되어 내부 출혈 가능성을 시각적으로 추적한다.",
            "findings": [
                {
                    "id": "BLEED-ABD-001",
                    "region": "Left Upper Abdomen",
                    "label": "복부 상부 출혈 의심",
                    "severity": "High",
                    "description": "저혈압과 빈맥이 동반되어 복부 내부 출혈 가능성이 있다.",
                    "x": 50,
                    "y": 44,
                },
                {
                    "id": "BLEED-PEL-002",
                    "region": "Pelvic Region",
                    "label": "골반 부위 출혈 의심",
                    "severity": "High",
                    "description": "골반 부위 손상 또는 내부 출혈 가능성을 모니터링한다.",
                    "x": 50,
                    "y": 58,
                },
                {
                    "id": "INJ-FEM-003",
                    "region": "Left Femur",
                    "label": "좌측 대퇴부 손상",
                    "severity": "Medium",
                    "description": "대퇴부 손상과 출혈 가능성을 함께 추적한다.",
                    "x": 42,
                    "y": 75,
                },
            ],
            "patient_explanation": [
                "현재 몸 안쪽에서 출혈이 의심되는 위치를 모형으로 보여준다.",
                "빨간색은 의료진이 빠르게 확인해야 하는 위험 위치를 의미한다.",
                "이 정보는 환자가 자신의 상태를 이해하고 의료진에게 질문할 수 있도록 돕는다.",
            ],
        }
    ]

    return load_json(DATA_DIR / "digital_twin_findings.json", fallback)


@app.get("/digital-twin-findings/{patient_id}")
def get_digital_twin_finding_by_patient(patient_id: str):
    twins = get_digital_twin_findings()

    for twin in twins:
        if twin.get("patient_id") == patient_id:
            return twin

    return {
        "patient_id": patient_id,
        "model_type": "unknown",
        "overall_risk": "Unknown",
        "summary": "해당 환자의 디지털 트윈 데이터가 없다.",
        "findings": [],
        "patient_explanation": [],
    }
