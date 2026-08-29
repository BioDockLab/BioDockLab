import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [experiments, setExperiments] = useState([]);
  const [analysis, setAnalysis] = useState([]);
  const [summary, setSummary] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [hospitalSummary, setHospitalSummary] = useState(null);
  const [patientReports, setPatientReports] = useState([]);
  const [doctorDecisions, setDoctorDecisions] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [auditSummary, setAuditSummary] = useState(null);
  const [status, setStatus] = useState("loading");

  async function loadRoleDetail(roleId) {
    const res = await fetch(`${API_BASE}/role-detail/${roleId}`);
    const data = await res.json();
    setSelectedRole(data);
  }

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          experimentsRes,
          analysisRes,
          summaryRes,
          rolesRes,
          vitalsRes,
          hospitalSummaryRes,
          reportsRes,
          doctorDecisionsRes,
          timelineRes,
          auditEventsRes,
          auditSummaryRes,
        ] = await Promise.all([
          fetch(`${API_BASE}/experiments`),
          fetch(`${API_BASE}/analysis`),
          fetch(`${API_BASE}/platform-summary`),
          fetch(`${API_BASE}/roles`),
          fetch(`${API_BASE}/vital-signs`),
          fetch(`${API_BASE}/hospital-summary`),
          fetch(`${API_BASE}/patient-reports`),
          fetch(`${API_BASE}/doctor-decisions`),
          fetch(`${API_BASE}/clinical-timeline/P-002`),
          fetch(`${API_BASE}/hospital-audit-events`),
          fetch(`${API_BASE}/hospital-audit-summary`),
        ]);

        const rolesData = await rolesRes.json();

        setExperiments(await experimentsRes.json());
        setAnalysis(await analysisRes.json());
        setSummary(await summaryRes.json());
        setRoles(rolesData);
        setVitals(await vitalsRes.json());
        setHospitalSummary(await hospitalSummaryRes.json());
        setPatientReports(await reportsRes.json());
        setDoctorDecisions(await doctorDecisionsRes.json());
        setTimeline(await timelineRes.json());
        setAuditEvents(await auditEventsRes.json());
        setAuditSummary(await auditSummaryRes.json());
        setStatus("connected");

        if (rolesData.length > 0) {
          await loadRoleDetail(rolesData[0].id);
        }
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    }

    loadDashboard();
  }, []);

  const analysisMap = useMemo(() => {
    return new Map(analysis.map((item) => [item.id, item]));
  }, [analysis]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">B</div>
          <div>
            <strong>BioDockLab</strong>
            <span>Hospital AI Platform</span>
          </div>
        </div>

        <nav>
          <a className="active">Dashboard</a>
          <a>Patients</a>
          <a>Vital Signs</a>
          <a>Doctor Support</a>
          <a>Reports</a>
          <a>Research</a>
          <a>Access Control</a>
        </nav>

        <div className="sidebar-card">
          <strong>v2.4 MVP</strong>
          <span>API-connected hospital data layer</span>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">BioDockLab v2.4 · Clinical Decision Support</span>
            <h1>환자의 알 권리와 의료진 판단을 연결하는 AI Bio-Platform</h1>
            <p>
              바이탈사인, 환자 설명 리포트, 의사 판단 보조, 연구 실험 분석을 하나의 플랫폼으로 통합합니다.
            </p>
          </div>

          <div className="runtime-card">
            <span>Frontend · Vite 5173</span>
            <span>Backend · FastAPI 8000</span>
            <strong>{status === "connected" ? "API Connected" : status}</strong>
          </div>
        </header>

        <section className="metric-grid">
          <div className="metric-card">
            <span>Roles</span>
            <strong>{summary?.roles ?? "-"}</strong>
            <p>role-based access</p>
          </div>
          <div className="metric-card">
            <span>Patients</span>
            <strong>{hospitalSummary?.patients ?? "-"}</strong>
            <p>active hospital samples</p>
          </div>
          <div className="metric-card warning">
            <span>Watch Cases</span>
            <strong>{hospitalSummary?.watch ?? "-"}</strong>
            <p>needs attention</p>
          </div>
          <div className="metric-card">
            <span>Average SpO₂</span>
            <strong>{hospitalSummary?.average_spo2 ?? "-"}%</strong>
            <p>oxygen saturation</p>
          </div>
        </section>


        <section className="section-header">
          <div>
            <h2>Clinical Timeline</h2>
            <p>P-002 환자의 바이탈 변화부터 의사 판단, 환자 설명 리포트, 감사 로그까지 이어지는 흐름</p>
          </div>
        </section>

        <section className="timeline-panel">
          {timeline.map((item) => (
            <article className={`timeline-item ${item.status}`} key={`${item.time}-${item.type}`}>
              <div className="timeline-time">{item.time}</div>
              <div className="timeline-body">
                <div className="decision-header">
                  <span className="patient-chip">{item.type}</span>
                  <span className="risk-chip medium">{item.role}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="section-header">
          <div>
            <h2>Doctor Decision Support</h2>
            <p>의사가 보는 환자별 위험도 요약과 다음 행동 제안</p>
          </div>
        </section>

        <section className="decision-grid">
          {doctorDecisions.map((item) => (
            <article className={`decision-card ${item.risk_level.includes("Medium") ? "highlight" : ""}`} key={item.patient_id}>
              <div className="decision-header">
                <span className="patient-chip">{item.patient_id}</span>
                <span className={`risk-chip ${item.risk_level.includes("Medium") ? "medium" : ""}`}>
                  {item.risk_level}
                </span>
              </div>
              <h3>{item.next_action}</h3>
              <p>{item.clinical_summary}</p>
              <ul>
                {item.decision_support.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="section-header">
          <div>
            <h2>Vital Sign Monitoring</h2>
            <p>간호사 인수인계와 의료진 확인을 위한 바이탈사인 요약</p>
          </div>
        </section>

        <section className="patient-grid">
          {vitals.map((item) => (
            <article className="patient-card" key={item.patient_id}>
              <div className="patient-top">
                <div>
                  <span className="patient-chip">{item.patient_id}</span>
                  <h3>{item.name}</h3>
                  <p>Age {item.age}</p>
                </div>
                <span className={`status-chip ${item.status === "Watch" ? "watch" : ""}`}>
                  {item.status}
                </span>
              </div>

              <div className="vital-grid">
                <span>HR <strong>{item.heart_rate}</strong></span>
                <span>BP <strong>{item.blood_pressure}</strong></span>
                <span>Temp <strong>{item.temperature}℃</strong></span>
                <span>SpO₂ <strong>{item.spo2}%</strong></span>
              </div>

              <p className="note">{item.note}</p>
            </article>
          ))}
        </section>

        <section className="two-column">
          <div>
            <section className="section-header compact">
              <div>
                <h2>Patient Right-to-Know Reports</h2>
                <p>환자가 이해할 수 있는 검사 결과 설명</p>
              </div>
            </section>

            <section className="report-grid">
              {patientReports.map((report) => (
                <article className="report-card" key={report.patient_id}>
                  <span className="patient-chip">{report.patient_id}</span>
                  <h3>{report.title}</h3>
                  <p>{report.summary}</p>
                  <ul>
                    {report.right_to_know.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </section>
          </div>

          <aside className="access-panel">
            <div className="section-header compact">
              <div>
                <h2>Role Access</h2>
                <p>역할 기반 데이터 접근 요약</p>
              </div>
            </div>

            <div className="role-list">
              {roles.map((role) => (
                <button key={role.id} onClick={() => loadRoleDetail(role.id)}>
                  <strong>{role.name}</strong>
                  <span>{role.focus}</span>
                </button>
              ))}
            </div>

            {selectedRole && (
              <div className="role-detail">
                <span className="eyebrow">Selected Role</span>
                <h3>{selectedRole.title}</h3>
                <p>{selectedRole.summary}</p>
              </div>
            )}
          </aside>
        </section>

        <section className="section-header">
          <div>
            <h2>Research Experiment Analysis</h2>
            <p>연구 확장성을 위한 실험 분석 레이어</p>
          </div>
        </section>

        <section className="research-grid">
          {experiments.map((exp) => {
            const result = analysisMap.get(exp.id);

            return (
              <article className="research-card" key={exp.id}>
                <div className="decision-header">
                  <span className="patient-chip">{exp.id}</span>
                  <span className="risk-chip medium">{result?.priority ?? "Pending"}</span>
                </div>
                <h3>{exp.domain}</h3>
                <p>{exp.sample}</p>
                <div className="progress">
                  <div style={{ width: `${exp.success_rate}%` }} />
                </div>
                <strong>{exp.success_rate}%</strong>
                <p>{result?.recommendation}</p>
              </article>
            );
          })}
        </section>


        <section className="section-header">
          <div>
            <h2>Audit & Access Control</h2>
            <p>환자 데이터 접근 기록과 역할 기반 허용/차단 로그</p>
          </div>
        </section>

        <section className="audit-layout">
          <div className="audit-summary">
            <div>
              <span>Total Events</span>
              <strong>{auditSummary?.events ?? "-"}</strong>
            </div>
            <div>
              <span>Allowed</span>
              <strong>{auditSummary?.allowed ?? "-"}</strong>
            </div>
            <div className="denied">
              <span>Denied</span>
              <strong>{auditSummary?.denied ?? "-"}</strong>
            </div>
          </div>

          <div className="audit-table">
            {auditEvents.map((event) => (
              <article className="audit-row" key={`${event.time}-${event.actor}-${event.action}`}>
                <div>
                  <strong>{event.time}</strong>
                  <span>{event.actor}</span>
                </div>
                <div>
                  <strong>{event.action}</strong>
                  <span>{event.reason}</span>
                </div>
                <div>
                  <span className={`audit-result ${event.result === "Denied" ? "denied" : ""}`}>
                    {event.result}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="pipeline">
          {["Role Access", "Vital Signs", "Patient Report", "Doctor Support", "AI Analysis", "Simulation"].map((step) => (
            <div key={step}>{step}</div>
          ))}
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
