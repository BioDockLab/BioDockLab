import { Award, Brain, CheckCircle2, Dna, ShieldCheck } from 'lucide-react';
import { Brand } from './Brand';
import { QrPlaceholder } from './ScienceArt';
import type { Candidate, Disease, ResearchSession } from '../types';

type PrintProps = {
  session: ResearchSession;
  disease: Disease;
  candidate: Candidate;
};

export function PrintOutputs({ session, disease, candidate }: PrintProps) {
  const name = session.researcherName.trim() || '미래 연구원';
  const role = session.dreamRole.trim() || '바이오 AI 연구원';
  return (
    <div id="print-output" className="print-output" aria-hidden="true">
      <article className="a4-report print-sheet">
        <div className="report-header">
          <Brand />
          <span>Report No.<strong>{session.sessionId}</strong></span>
        </div>
        <h1>AI RESEARCH REPORT</h1>
        <p className="report-subtitle">Cell-based Bio AI Educational Research Report</p>
        <div className="report-grid">
          <section className="report-profile">
            <dl>
              <div><dt>연구원 이름</dt><dd>{name}</dd></div>
              <div><dt>희망 직업</dt><dd>{role}</dd></div>
              <div><dt>연구 주제</dt><dd>{disease.title} · 3D 뇌 오가노이드</dd></div>
              <div><dt>단백질 표적</dt><dd>EGFR (P00533)</dd></div>
              <div><dt>분석 완료일</dt><dd>{new Date().toLocaleDateString('ko-KR')}</dd></div>
            </dl>
          </section>
          <section className="report-score">
            <span>AI 종합 점수</span>
            <div className="score-ring"><strong>84</strong><small>/100</small></div>
            <p>Research Potential</p>
          </section>
          <section className="report-flow">
            <Brain /><span>AI ANALYSIS</span><b>↓</b><Dna /><span>BIO DATA</span><b>↓</b><Award /><span>RESEARCH RESULT</span>
          </section>
          <section className="report-summary">
            <h2>AI 분석 요약</h2>
            <p>{disease.title} 연구 사례에서 3D 오가노이드 모델과 EGFR 구조를 살펴보고, 세 후보물질의 구조적 상호작용을 비교했습니다.</p>
            <h2>선택한 연구 방향</h2>
            <ul>
              <li>{candidate.name} ({candidate.code})</li>
              <li>{candidate.feature}</li>
              <li>도킹 점수는 연구 참고용 계산값이며 실제 약효를 의미하지 않음</li>
            </ul>
          </section>
          <section className="report-metrics">
            <div><strong>92%</strong><span>AI Confidence</span></div>
            <div><strong>86%</strong><span>Structure Coverage</span></div>
            <div><strong>{candidate.dockingScore}</strong><span>Docking Reference</span></div>
            <div><strong>12:48</strong><span>Experience Time</span></div>
          </section>
        </div>
        <div className="report-footer">
          <span className="verified"><ShieldCheck /> AI VERIFIED</span>
          <span><CheckCircle2 /> Today's Research Completed</span>
          <QrPlaceholder />
        </div>
        <small className="report-disclaimer">본 결과는 교육·체험 목적의 시뮬레이션이며 실제 의료 진단, 치료 또는 처방을 의미하지 않습니다.</small>
      </article>

      <article className="research-card-print print-sheet">
        <div className="card-side card-front">
          <Brand compact />
          <span>OFFICIAL AI RESEARCH CARD</span>
          <dl><div><dt>Research ID</dt><dd>{session.sessionId}</dd></div><div><dt>Main Field</dt><dd>Cell-based Bio AI</dd></div></dl>
          <div className="card-level"><span>AI LEVEL</span><strong>4</strong><small>Advanced</small></div>
          <Brand compact />
        </div>
        <div className="card-side card-back">
          <Brand compact />
          <dl><div><dt>Researcher</dt><dd>{name}</dd></div><div><dt>Main Field</dt><dd>{disease.title}</dd></div><div><dt>Issued</dt><dd>{new Date().toLocaleDateString('ko-KR')}</dd></div></dl>
          <QrPlaceholder />
          <small>Touch Experience Laboratory</small>
        </div>
      </article>
    </div>
  );
}
