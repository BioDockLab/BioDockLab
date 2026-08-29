import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API_BASE = "http://127.0.0.1:8000";

const fallbackVitals = [
  {
    patient_id: "P-001",
    name: "Sample Patient A",
    age: 42,
    heart_rate: 88,
    blood_pressure: "124/82",
    temperature: 36.8,
    spo2: 97,
    respiratory_rate: 18,
    status: "Stable",
    note: "수술 후 회복 관찰 중. 산소포화도 안정적."
  },
  {
    patient_id: "P-002",
    name: "Sample Patient B",
    age: 67,
    heart_rate: 112,
    blood_pressure: "148/92",
    temperature: 37.9,
    spo2: 92,
    respiratory_rate: 24,
    status: "Watch",
    note: "호흡수 증가 및 산소포화도 저하. 간호사 재확인 필요."
  },
  {
    patient_id: "P-003",
    name: "Sample Patient C",
    age: 55,
    heart_rate: 76,
    blood_pressure: "118/78",
    temperature: 36.5,
    spo2: 98,
    respiratory_rate: 16,
    status: "Stable",
    note: "바이탈 안정. 정기 관찰 유지."
  }
];

const fallbackReports = [
  {
    patient_id: "P-002",
    title: "주의 관찰 설명 리포트",
    summary: "산소포화도 저하와 호흡수 증가가 관찰되어 의료진 확인이 필요하다.",
    explanation: "환자가 자신의 상태를 이해할 수 있도록 위험 신호를 쉬운 언어로 설명합니다.",
    right_to_know: [
      "산소포화도가 낮아졌다는 의미를 이해할 수 있다.",
      "호흡수가 증가했을 때 어떤 확인이 필요한지 알 수 있다.",
      "의료진에게 현재 증상과 불편감을 정확히 설명할 수 있다."
    ]
  }
];

const fallbackDecisions = [
  {
    patient_id: "P-002",
    risk_level: "Medium-High",
    clinical_summary: "산소포화도 저하와 호흡수 증가가 관찰되어 의료진 확인이 필요하다.",
    decision_support: [
      "간호사 바이탈 재확인",
      "산소포화도 추세 확인",
      "호흡 불편감 문진",
      "필요 시 담당의 알림"
    ],
    next_action: "Clinical review required"
  }
];

const fallbackTimeline = [
  {
    time: "08:10",
    type: "Vital Sign Alert",
    role: "Nurse",
    title: "산소포화도 저하 감지",
    description: "SpO₂ 92%, 호흡수 24/min으로 주의 관찰 기준에 진입했다."
  },
  {
    time: "08:18",
    type: "Nurse Handoff",
    role: "Nurse",
    title: "간호사 재확인 요청",
    description: "호흡 불편감 문진 및 산소포화도 추세 확인이 필요하다."
  },
  {
    time: "08:27",
    type: "Doctor Decision",
    role: "Doctor",
    title: "Clinical review required",
    description: "담당 의료진 확인과 추가 모니터링이 필요하다."
  },
  {
    time: "08:35",
    type: "Patient Report",
    role: "Patient",
    title: "환자 설명 리포트 생성",
    description: "환자가 현재 상태를 이해할 수 있도록 쉬운 설명 리포트를 제공한다."
  }
];


const fallbackAuditEvents = [
  {
    id: "AUD-001",
    time: "08:02",
    actor: "Nurse",
    actor_name: "간호사 A",
    patient_id: "P-001",
    action: "Viewed vital signs",
    data_scope: "Vital Signs",
    result: "Allowed",
    reason: "정기 바이탈 확인"
  },
  {
    id: "AUD-005",
    time: "08:39",
    actor: "Researcher",
    actor_name: "연구자 계정",
    patient_id: "P-002",
    action: "Tried to access identifiable patient report",
    data_scope: "Patient Report",
    result: "Denied",
    reason: "연구자 권한은 식별 가능한 환자 리포트 접근 불가"
  }
];

const fallbackTwin = {
  patient_id: "P-002",
  model_type: "prototype-risk-map",
  overall_risk: "High",
  summary: "실제 3D 인체 모델이 아니라, 바이탈사인 기반 위험 위치를 시각화하는 초기 디지털 트윈 모형입니다.",
  findings: [
    {
      id: "BLEED-ABD-001",
      label: "복부 출혈 의심",
      region: "Abdomen",
      severity: "High",
      description: "저혈압과 빈맥이 동반되어 내부 출혈 가능성을 표시합니다.",
      x: 50,
      y: 47
    },
    {
      id: "BLEED-PEL-002",
      label: "골반 부위 출혈 의심",
      region: "Pelvic Region",
      severity: "High",
      description: "골반 손상 가능성을 함께 추적합니다.",
      x: 50,
      y: 59
    },
    {
      id: "INJ-FEM-003",
      label: "대퇴부 손상 가능성",
      region: "Left Femur",
      severity: "Medium",
      description: "대퇴부 손상과 출혈 가능성을 추적합니다.",
      x: 43,
      y: 76
    }
  ]
};

async function getJson(path, fallback) {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

function App() {
  const [apiStatus, setApiStatus] = useState("fallback mode");
  const [vitals, setVitals] = useState(fallbackVitals);
  const [reports, setReports] = useState(fallbackReports);
  const [decisions, setDecisions] = useState(fallbackDecisions);
  const [allTimeline, setAllTimeline] = useState(fallbackTimeline);
  const [digitalTwin, setDigitalTwin] = useState(fallbackTwin);
  const [auditEvents, setAuditEvents] = useState(fallbackAuditEvents);
  const [selectedPatientId, setSelectedPatientId] = useState("P-002");
  const [roleMode, setRoleMode] = useState("dashboard");

  useEffect(() => {
    async function load() {
      const [health, vitalData, reportData, decisionData, timelineData, twinData, auditData] =
        await Promise.all([
          getJson("/health", null),
          getJson("/vital-signs", fallbackVitals),
          getJson("/patient-reports", fallbackReports),
          getJson("/doctor-decisions", fallbackDecisions),
          getJson("/clinical-timeline", fallbackTimeline),
          getJson("/digital-twin-findings/P-002", fallbackTwin),
          getJson("/hospital-audit-events", fallbackAuditEvents)
        ]);

      setApiStatus(health ? "connected" : "fallback mode");
      setVitals(vitalData.length ? vitalData : fallbackVitals);
      setReports(reportData.length ? reportData : fallbackReports);
      setDecisions(decisionData.length ? decisionData : fallbackDecisions);
      setTimeline(timelineData.length ? timelineData : fallbackTimeline);
      setDigitalTwin(twinData?.findings ? twinData : fallbackTwin);
      setAuditEvents(auditData.length ? auditData : fallbackAuditEvents);
    }

    load();
  }, []);

  const selectedPatient = useMemo(() => {
    return vitals.find((item) => item.patient_id === selectedPatientId) || vitals[0];
  }, [vitals, selectedPatientId]);

  const selectedReport = useMemo(() => {
    return reports.find((item) => item.patient_id === selectedPatientId) || reports[0];
  }, [reports, selectedPatientId]);

  const selectedDecision = useMemo(() => {
    return decisions.find((item) => item.patient_id === selectedPatientId) || decisions[0];
  }, [decisions, selectedPatientId]);

  const selectedTimeline = useMemo(() => {
    const filtered = allTimeline.filter((item) => item.patient_id === selectedPatientId);
    return filtered.length ? filtered : fallbackTimeline.filter((item) => item.patient_id === selectedPatientId);
  }, [allTimeline, selectedPatientId]);

  const selectedTwin = useMemo(() => {
    if (digitalTwin?.patient_id === selectedPatientId) return digitalTwin;
    const fallbackList = Array.isArray(fallbackTwin) ? fallbackTwin : [fallbackTwin];
    return fallbackList.find((item) => item.patient_id === selectedPatientId) || digitalTwin;
  }, [digitalTwin, selectedPatientId]);

  const selectedAuditEvents = useMemo(() => {
    return auditEvents.filter((item) => item.patient_id === selectedPatientId);
  }, [auditEvents, selectedPatientId]);

  const deniedAuditCount = auditEvents.filter((item) => item.result === "Denied").length;

  const watchCount = vitals.filter((item) => item.status === "Watch").length;
  const reportsReady = reports.length;
  const doctorReviews = decisions.filter((item) => item.risk_level !== "Low").length;

  return (
    <main className={`v3-shell role-${roleMode}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">B</div>
          <div>
            <strong>BioDockLab v3</strong>
            <span>Hospital Role-based UI</span>
          </div>
        </div>

        <nav className="side-nav">
          <button className={roleMode === "dashboard" ? "active" : ""} onClick={() => setRoleMode("dashboard")}>Dashboard</button>
          <button className={roleMode === "patient" ? "active" : ""} onClick={() => setRoleMode("patient")}>Patient View</button>
          <button className={roleMode === "nurse" ? "active" : ""} onClick={() => setRoleMode("nurse")}>Nurse View</button>
          <button className={roleMode === "doctor" ? "active" : ""} onClick={() => setRoleMode("doctor")}>Doctor View</button>
          <button className={roleMode === "security" ? "active" : ""} onClick={() => setRoleMode("security")}>Security View</button>
        </nav>

        <div className="side-card">
          <strong>v2 Data Core</strong>
          <span>FastAPI · 샘플 의료 데이터 · 분석 API</span>
        </div>
      </aside>

      <section className="content">
        <header className="header">
          <div>
            <span className="eyebrow">BioDockLab v3 · Hospital Main Dashboard</span>
            <h1>병원 역할 기반 의료 데이터 플랫폼</h1>
            <p>
              환자, 간호사, 의사, 보안관리자가 각자 필요한 의료 데이터를 확인하고
              환자의 알 권리와 의료진 판단을 연결하는 제품 화면입니다.
            </p>
          </div>

          <div className={`api-card ${apiStatus === "connected" ? "ok" : "fallback"}`}>
            <span>Backend API</span>
            <strong>{apiStatus}</strong>
            <small>v2 data science core</small>
          </div>
        </header>


        <section className="role-mode-banner">
          <div>
            <span className="eyebrow">Current Role View</span>
            <strong>
              {roleMode === "dashboard" && "Hospital Dashboard"}
              {roleMode === "patient" && "Patient Right-to-Know View"}
              {roleMode === "nurse" && "Nurse Vital Monitoring View"}
              {roleMode === "doctor" && "Doctor Decision Support View"}
              {roleMode === "security" && "Security Audit View"}
            </strong>
            <p>
              {roleMode === "dashboard" && "전체 병원 운영 현황과 환자 상태를 한 화면에서 확인합니다."}
              {roleMode === "patient" && "환자가 본인의 상태와 검사 결과를 이해할 수 있도록 쉬운 설명을 우선 표시합니다."}
              {roleMode === "nurse" && "간호사가 바이탈사인, 주의 환자, 인수인계 흐름을 빠르게 확인합니다."}
              {roleMode === "doctor" && "의사가 위험도, 판단 보조, 디지털 트윈 위험 위치를 중심으로 확인합니다."}
              {roleMode === "security" && "보안관리자가 접근 기록과 민감정보 접근 흐름을 확인합니다."}
            </p>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Active Patients</span>
            <strong>{vitals.length}</strong>
            <p>현재 관리 중인 환자</p>
          </div>
          <div className="stat-card warning">
            <span>Watch Cases</span>
            <strong>{watchCount}</strong>
            <p>주의 관찰 필요</p>
          </div>
          <div className="stat-card warning">
            <span>Doctor Review</span>
            <strong>{doctorReviews}</strong>
            <p>의사 확인 필요</p>
          </div>
          <div className="stat-card">
            <span>Reports Ready</span>
            <strong>{reportsReady}</strong>
            <p>환자 설명 리포트</p>
          </div>
          <div className="stat-card danger">
            <span>Denied Access</span>
            <strong>{deniedAuditCount}</strong>
            <p>권한 차단 이벤트</p>
          </div>
        </section>

        <section className="main-grid">
          <section className="panel patient-list">
            <div className="panel-title">
              <h2>Patient List</h2>
              <span>오늘 모니터링 대상</span>
            </div>

            {vitals.map((patient) => (
              <button
                key={patient.patient_id}
                className={`patient-row ${patient.patient_id === selectedPatientId ? "selected" : ""}`}
                onClick={() => setSelectedPatientId(patient.patient_id)}
              >
                <div>
                  <strong>{patient.patient_id}</strong>
                  <span>{patient.name} · {patient.age}세</span>
                </div>
                <em className={patient.status === "Watch" ? "watch" : ""}>{patient.status}</em>
              </button>
            ))}
          </section>

          <section className="panel patient-detail">
            <div className="patient-hero">
              <div>
                <span className="patient-chip">{selectedPatient.patient_id}</span>
                <h2>{selectedPatient.name}</h2>
                <p>{selectedPatient.note}</p>
              </div>
              <em className={selectedPatient.status === "Watch" ? "watch big" : "big"}>
                {selectedPatient.status}
              </em>
            </div>

            <div className="vital-grid">
              <div>
                <span>Heart Rate</span>
                <strong>{selectedPatient.heart_rate}</strong>
                <small>bpm</small>
              </div>
              <div>
                <span>Blood Pressure</span>
                <strong>{selectedPatient.blood_pressure}</strong>
                <small>mmHg</small>
              </div>
              <div>
                <span>Temperature</span>
                <strong>{selectedPatient.temperature}℃</strong>
                <small>body temp</small>
              </div>
              <div>
                <span>SpO₂</span>
                <strong>{selectedPatient.spo2}%</strong>
                <small>oxygen</small>
              </div>
            </div>

            <div className="doctor-box">
              <span className="eyebrow">Doctor Decision Support</span>
              <h3>{selectedDecision?.next_action}</h3>
              <p>{selectedDecision?.clinical_summary}</p>
              <ul>
                {selectedDecision?.decision_support?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="right-column">
            <section className="panel report-panel">
              <div className="panel-title">
                <h2>Patient Right-to-Know</h2>
                <span>환자 설명 리포트</span>
              </div>
              <h3>{selectedReport?.title}</h3>
              <p>{selectedReport?.summary}</p>
              <ul>
                {selectedReport?.right_to_know?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="panel twin-panel">
              <div className="panel-title">
                <h2>Digital Twin Risk Map</h2>
                <span>초기 모형 기반 위험 위치 시각화</span>
              </div>

              <div className="mini-body">
                <div className="body-head" />
                <div className="body-torso" />
                <div className="body-leg left" />
                <div className="body-leg right" />

                {selectedTwin.findings.map((finding) => (
                  <span
                    key={finding.id}
                    className={`marker ${finding.severity.toLowerCase()}`}
                    style={{ left: `${finding.x}%`, top: `${finding.y}%` }}
                  />
                ))}
              </div>

              <p>{selectedTwin.summary}</p>
            </section>
          </aside>
        </section>

        <section className="bottom-grid">
          <section className="panel timeline-panel">
            <div className="panel-title">
              <h2>Clinical Timeline</h2>
              <span>바이탈 → 판단 → 설명 리포트 흐름</span>
            </div>

            {selectedTimeline.map((item) => (
              <article className="timeline-row" key={`${item.time}-${item.type}`}>
                <strong>{item.time}</strong>
                <div>
                  <span>{item.type} · {item.role}</span>
                  <p>{item.title}</p>
                </div>
              </article>
            ))}
          </section>


          <section className="panel audit-panel">
            <div className="panel-title">
              <h2>Security Audit Log</h2>
              <span>선택 환자 기준 접근 기록</span>
            </div>

            {selectedAuditEvents.length === 0 && (
              <p className="empty-text">선택 환자의 감사 로그가 없습니다.</p>
            )}

            {selectedAuditEvents.map((event) => (
              <article className={`audit-row ${event.result === "Denied" ? "denied" : "allowed"}`} key={event.id}>
                <div>
                  <strong>{event.time}</strong>
                  <span>{event.actor} · {event.actor_name}</span>
                </div>
                <div>
                  <h3>{event.action}</h3>
                  <p>{event.data_scope} · {event.reason}</p>
                </div>
                <em className={event.result === "Denied" ? "watch" : ""}>{event.result}</em>
              </article>
            ))}
          </section>

          <section className="panel twin-finding-panel">
            <div className="panel-title">
              <h2>Digital Twin Findings</h2>
              <span>의료진 확인용 위험 부위 요약</span>
            </div>

            {selectedTwin.findings.map((finding) => (
              <article className="finding-row" key={finding.id}>
                <div>
                  <strong>{finding.label}</strong>
                  <span>{finding.region}</span>
                  <p>{finding.description}</p>
                </div>
                <em className={finding.severity === "High" ? "watch" : ""}>
                  {finding.severity}
                </em>
              </article>
            ))}
          </section>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
