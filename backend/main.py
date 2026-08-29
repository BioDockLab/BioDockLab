from pathlib import Path
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "sample_data"
CORE_DATA_DIR = ROOT_DIR / "data" / "sample"

app = FastAPI(
    title="BioDockLab API",
    version="2.1.0",
    description="Role-based medical and bio research data platform API",
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

    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


@app.get("/")
def root():
    return {
        "project": "BioDockLab",
        "version": "2.1",
        "message": "Bio AI research software platform API",
        "modules": [
            "roles",
            "experiments",
            "analysis",
            "access-policies",
            "risk-events",
            "audit-logs",
        ],
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "biodocklab-api",
        "version": "2.1.0",
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
            "id": "admin",
            "name": "Admin",
            "description": "예약, 동의서, 서류 상태를 관리하는 사용자",
            "focus": "동의서, 문서 상태, 접수 흐름",
        },
        {
            "id": "researcher",
            "name": "Researcher",
            "description": "실험 데이터와 시뮬레이션 결과를 분석하는 사용자",
            "focus": "실험 데이터, 연구 분석, 시뮬레이션",
        },
        {
            "id": "security",
            "name": "Security Officer",
            "description": "접근 로그와 민감정보 사용을 감사하는 사용자",
            "focus": "접근 제어, 감사 로그, 보안 정책",
        },
    ]


@app.get("/experiments")
def get_experiments():
    fallback = [
        {
            "id": "EXP-ORG-001",
            "domain": "Organoid",
            "sample": "Patient-derived mini organoid sample",
            "condition": "Drug response screening / 72h culture",
            "success_rate": 86,
            "risk_level": "Low",
        },
        {
            "id": "EXP-DT-002",
            "domain": "Digital Twin",
            "sample": "Virtual patient response model",
            "condition": "Treatment strength simulation",
            "success_rate": 78,
            "risk_level": "Medium",
        },
        {
            "id": "EXP-CFPS-003",
            "domain": "CFPS",
            "sample": "Cell-free protein synthesis batch",
            "condition": "Temperature / enzyme quality / substrate level",
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


@app.get("/access-policies")
def get_access_policies():
    return load_json(DATA_DIR / "access_policies.json", [])


@app.get("/risk-events")
def get_risk_events():
    return load_json(DATA_DIR / "risk_events.json", [])


@app.get("/audit-logs")
def get_audit_logs():
    return load_json(DATA_DIR / "audit_logs.json", [])


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
        "research_directions": [
            "Organoid",
            "Surgery AI",
            "Quantum Biocomputing",
            "Digital Twin",
            "CFPS",
        ],
    }


@app.get("/role-detail/{role_id}")
def get_role_detail(role_id: str):
    role_details = {
        "patient": {
            "title": "Patient Right-to-Know View",
            "summary": "환자가 자신의 검사 결과, 위험도, 설명 리포트를 이해할 수 있도록 제공하는 화면",
            "data_scope": [
                "검사 결과 요약",
                "위험도 설명",
                "의료진 상담 준비 자료",
                "환자 친화형 리포트",
            ],
            "restricted": [
                "타 환자 정보",
                "내부 의료진 메모",
                "보안 로그",
            ],
        },
        "nurse": {
            "title": "Nurse Vital Sign & Handoff View",
            "summary": "간호사가 바이탈사인, 인수인계, 상태 변화를 빠르게 확인하는 화면",
            "data_scope": [
                "바이탈사인",
                "투약 전 확인",
                "인수인계 메모",
                "상태 변화 알림",
            ],
            "restricted": [
                "관리자 보안 정책",
                "연구자 전용 실험 데이터",
            ],
        },
        "doctor": {
            "title": "Doctor Decision Support View",
            "summary": "의사가 검사 결과와 AI 위험도 분석을 기반으로 판단을 보조받는 화면",
            "data_scope": [
                "검사 결과",
                "AI 위험도 평가",
                "치료 방향 후보",
                "환자 상담 자료",
            ],
            "restricted": [
                "원무 서류 처리 내역",
                "시스템 내부 보안 설정",
            ],
        },
        "pharmacist": {
            "title": "Pharmacist Prescription Review View",
            "summary": "약사가 처방, 약물상호작용, 유전자 적합성을 검토하는 화면",
            "data_scope": [
                "처방 정보",
                "약물상호작용",
                "유전자 적합성",
                "복약 안전성",
            ],
            "restricted": [
                "진료 판단 메모",
                "보안 감사 로그",
            ],
        },
        "security": {
            "title": "Security Audit View",
            "summary": "보안관리자가 접근 기록, 권한 위반, 민감정보 접근을 감사하는 화면",
            "data_scope": [
                "접근 로그",
                "권한 정책",
                "위험 이벤트",
                "민감정보 접근 기록",
            ],
            "restricted": [
                "환자 친화형 설명 화면 조작",
                "실험 결과 임의 수정",
            ],
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
        "focus": [
            "Patient right-to-know",
            "Vital sign monitoring",
            "Nurse handoff support",
            "Doctor decision support",
        ],
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
        "focus": [
            "Role-based access control",
            "Patient privacy",
            "Audit trail",
            "Sensitive medical data governance"
        ]
    }
