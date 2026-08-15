import {
  ArrowLeft,
  ArrowRight,
  Atom,
  Award,
  BarChart3,
  Beaker,
  BookMarked,
  Brain,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Dna,
  FileText,
  FlaskConical,
  Info,
  Microscope,
  Network,
  Printer,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { candidates, diseases, themes } from './data/content';
import { Brand } from './components/Brand';
import { ChemicalSketch, ProteinArt, QrPlaceholder, ScienceOrb } from './components/ScienceArt';
import { Shell } from './components/Shell';
import { PrintOutputs } from './components/PrintOutputs';
import type { CellModelId, DiseaseId, ResearchSession, ThemeId } from './types';

const createSessionId = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `BDL-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}-${Math.floor(100 + Math.random() * 900)}`;
};

const defaultSession = (): ResearchSession => ({
  sessionId: createSessionId(),
  researcherName: '',
  dreamRole: '바이오 AI 연구원',
  themeId: 'brain-organoid',
  diseaseId: 'glioblastoma',
  cellModelId: '3d-organoid',
  proteinId: 'egfr',
  selectedCandidateId: 'candidate-a',
  startedAt: new Date().toISOString(),
});

function App() {
  const [step, setStep] = useState(1);
  const [session, setSession] = useState<ResearchSession>(() => {
    try {
      const cached = localStorage.getItem('biodocklab-session');
      return cached ? { ...defaultSession(), ...JSON.parse(cached) } : defaultSession();
    } catch {
      return defaultSession();
    }
  });
  const [printKind, setPrintKind] = useState<'report' | 'card'>('report');

  useEffect(() => {
    localStorage.setItem('biodocklab-session', JSON.stringify(session));
  }, [session]);

  const disease = useMemo(() => diseases.find((item) => item.id === session.diseaseId)!, [session.diseaseId]);
  const candidate = useMemo(() => candidates.find((item) => item.id === session.selectedCandidateId)!, [session.selectedCandidateId]);

  const update = <K extends keyof ResearchSession>(key: K, value: ResearchSession[K]) => {
    setSession((current) => ({ ...current, [key]: value }));
  };

  const reset = () => {
    localStorage.removeItem('biodocklab-session');
    setSession(defaultSession());
    setStep(1);
  };

  const print = (kind: 'report' | 'card') => {
    setPrintKind(kind);
    document.body.dataset.printKind = kind;
    window.setTimeout(() => window.print(), 80);
  };

  return (
    <>
      <Shell step={step} onStep={setStep} onReset={reset} sessionId={session.sessionId}>
        {step === 1 && <HomeScreen session={session} updateTheme={(value) => update('themeId', value)} next={() => setStep(2)} />}
        {step === 2 && <OrganoidScreen session={session} updateDisease={(value) => update('diseaseId', value)} updateCellModel={(value) => update('cellModelId', value)} previous={() => setStep(1)} next={() => setStep(3)} />}
        {step === 3 && <ProteinScreen diseaseName={disease.title} previous={() => setStep(2)} next={() => setStep(4)} />}
        {step === 4 && <PredictionScreen session={session} diseaseName={disease.title} previous={() => setStep(3)} next={() => setStep(5)} />}
        {step === 5 && <CandidateScreen selectedId={session.selectedCandidateId} select={(value) => update('selectedCandidateId', value)} previous={() => setStep(4)} next={() => setStep(6)} />}
        {step === 6 && <ReportScreen session={session} diseaseName={disease.title} selectedCandidate={candidate} updateName={(value) => update('researcherName', value)} updateRole={(value) => update('dreamRole', value)} previous={() => setStep(5)} print={print} reset={reset} />}
      </Shell>
      <PrintOutputs session={session} disease={disease} candidate={candidate} />
      <span className="print-kind-state" data-kind={printKind} />
    </>
  );
}

function HomeScreen({ session, updateTheme, next }: { session: ResearchSession; updateTheme: (id: ThemeId) => void; next: () => void }) {
  return (
    <div className="screen screen--home">
      <section className="hero-panel">
        <div className="hero-panel__content">
          <small>WELCOME TO BIODOCKLAB</small>
          <h1>세포 기반 바이오 AI <span>연구 체험</span></h1>
          <p>하나의 질환 연구 스토리를 따라 세포, 오가노이드, 단백질 구조, 후보물질 비교 과정을 탐색하고 나만의 연구 리포트를 완성합니다.</p>
          <div className="mini-flow">
            {[['세포 선택', Microscope], ['오가노이드', Brain], ['단백질 구조', Atom], ['AI 구조 예측', Sparkles], ['후보물질 비교', Beaker], ['리포트 출력', FileText]].map(([label, Icon], index) => {
              const IconComponent = Icon as typeof Brain;
              return <span key={String(label)}><IconComponent />{String(label)}{index < 5 && <ChevronRight />}</span>;
            })}
          </div>
        </div>
        <div className="hero-panel__action">
          <div className="dna-hero"><Dna /></div>
          <button type="button" className="button button--hero" onClick={next}>연구 시작하기 <ArrowRight /></button>
          <small>약 7–10분 · 교육용 시뮬레이션</small>
        </div>
      </section>

      <div className="home-grid">
        <section className="panel theme-panel">
          <header className="section-header"><div><h2>연구 테마 선택</h2><p>관심 있는 연구 테마를 선택하고 체험을 시작해 보세요.</p></div></header>
          <div className="theme-cards">
            {themes.map((theme) => (
              <button key={theme.id} type="button" className={`theme-card ${session.themeId === theme.id ? 'is-selected' : ''}`} onClick={() => updateTheme(theme.id)}>
                <ScienceOrb type={theme.icon === 'cells' ? 'cells' : theme.icon === 'neuron' ? 'neuron' : 'brain'} size={92} />
                <div><h3>{theme.title}</h3><p>{theme.description}</p><div className="tag-row">{theme.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
                <span className="round-arrow"><ArrowRight /></span>
              </button>
            ))}
          </div>
        </section>
        <aside className="panel mobile-panel">
          <h2>모바일 연동 <small>(선택)</small></h2>
          <p>체험 결과 페이지를 모바일에서도 확인할 수 있도록 확장할 수 있습니다.</p>
          <QrPlaceholder />
          <strong>QR 코드를 스캔하세요</strong>
        </aside>
      </div>
      <Notice>본 체험의 모든 분석 결과는 교육용 시뮬레이션으로, 실제 의료 진단·치료·처방을 목적으로 하지 않습니다.</Notice>
    </div>
  );
}

function OrganoidScreen({ session, updateDisease, updateCellModel, previous, next }: { session: ResearchSession; updateDisease: (id: DiseaseId) => void; updateCellModel: (id: CellModelId) => void; previous: () => void; next: () => void }) {
  const selectedDisease = diseases.find((item) => item.id === session.diseaseId)!;
  return (
    <div className="screen screen--organoid">
      <section className="page-intro panel">
        <div><span className="eyebrow"><Network /> 연구 경로 선택</span><h1>뇌 질환 연구를 위한 오가노이드 모델을 선택하세요.</h1><p>세포 모델의 차이를 비교하며 3차원 오가노이드가 연구에서 어떤 역할을 하는지 알아봅니다.</p></div>
        <ScienceOrb type="brain" size={118} />
      </section>
      <div className="content-with-summary">
        <div className="main-column">
          <section className="panel selection-section">
            <div className="section-side-label"><Target /><h3>질환 선택</h3><p>연구하고자 하는 질환 사례를 선택하세요.</p></div>
            <div className="disease-cards">
              {diseases.map((item) => (
                <button key={item.id} type="button" className={`disease-card ${session.diseaseId === item.id ? 'is-selected' : ''}`} onClick={() => updateDisease(item.id)}>
                  <ScienceOrb type={item.icon === 'cells' ? 'cells' : item.icon === 'neuron' ? 'neuron' : 'brain'} size={72} />
                  <div><h3>{item.title}</h3><small>{item.titleEn}</small><p>{item.description}</p></div>
                  {item.recommended && <em>추천 예시</em>}
                  {session.diseaseId === item.id && <Check className="selected-check" />}
                </button>
              ))}
            </div>
          </section>

          <section className="panel selection-section model-section">
            <div className="section-side-label"><FlaskConical /><h3>세포 모델 비교</h3><p>2D 세포 모델과 3D 오가노이드의 차이를 확인하세요.</p></div>
            <div className="model-compare">
              <button type="button" className={`model-card ${session.cellModelId === '2d-cell' ? 'is-selected' : ''}`} onClick={() => updateCellModel('2d-cell')}>
                <h3>2D 세포 모델</h3><small>평면 배양 환경의 단일 세포층</small><ScienceOrb type="cells" size={100} />
                <strong>한계점</strong><ul><li>세포 간 상호작용 표현이 제한적</li><li>3D 구조와 미세환경 반영이 어려움</li><li>기초 연구에 유용한 단순 모델</li></ul><Rating value={2} />
              </button>
              <span className="vs">VS</span>
              <button type="button" className={`model-card model-card--primary ${session.cellModelId === '3d-organoid' ? 'is-selected' : ''}`} onClick={() => updateCellModel('3d-organoid')}>
                <h3>3D 뇌 오가노이드 모델</h3><small>일부 조직 특성을 모사하는 3차원 연구 모델</small><ScienceOrb type="organoid" size={112} />
                <strong>강점</strong><ul><li>3D 구조와 세포 다양성을 일부 반영</li><li>세포 간 상호작용 연구에 활용</li><li>실제 인체 조직과 동일한 것은 아님</li></ul><Rating value={5} />
              </button>
            </div>
          </section>
          <div className="screen-actions"><Notice compact>공개 데이터 기반 교육용 체험이며 실제 임상 판단에 사용되지 않습니다.</Notice><NavButtons previous={previous} next={next} /></div>
        </div>
        <aside className="panel summary-panel">
          <h2>선택 요약 <BookMarked /></h2>
          <SummaryItem icon={<Brain />} label="질환"><strong>{selectedDisease.title}</strong><span>{selectedDisease.titleEn}</span></SummaryItem>
          <SummaryItem icon={<Atom />} label="세포 모델"><strong>{session.cellModelId === '3d-organoid' ? '3D 뇌 오가노이드 모델' : '2D 세포 모델'}</strong><span>선택됨</span></SummaryItem>
          <SummaryItem icon={<Target />} label="오가노이드 목적"><strong>질환 모델링과 연구 질문 탐색</strong><span>후보물질의 구조적 특징을 비교합니다.</span></SummaryItem>
          <SummaryItem icon={<Clock3 />} label="예상 체험 시간"><strong>약 7–10분</strong><span>전체 체험 기준</span></SummaryItem>
          <div className="tip-card"><Sparkles /><strong>연구 팁</strong><p>오가노이드는 실제 장기 전체가 아니라 일부 특성을 모사하는 연구 모델입니다.</p></div>
        </aside>
      </div>
    </div>
  );
}

function ProteinScreen({ diseaseName, previous, next }: { session: ResearchSession; diseaseName: string; previous: () => void; next: () => void }) {
  return (
    <div className="screen screen--protein">
      <div className="content-with-summary">
        <section className="panel protein-viewer">
          <div className="viewer-header"><div><small>선택 단백질</small><h1>EGFR</h1><p>Epidermal Growth Factor Receptor</p><span>UniProt ID: P00533</span></div><button type="button">뷰 옵션⌄</button></div>
          <ProteinArt />
          <div className="viewer-toolbar"><span>↻ 회전</span><span>＋ 줌</span><span>✣ 이동</span><span>⌖ 측정</span><span>○ 리셋</span></div>
        </section>
        <aside className="panel structure-info">
          <span className="eyebrow"><Atom /> 단백질 구조 확인</span><h1>왜 단백질 구조를 살펴볼까요?</h1>
          <p>단백질의 3차원 형태는 후보물질이 어느 위치에서 어떻게 상호작용할 수 있는지 탐색하는 출발점이 됩니다.</p>
          <div className="info-stat"><strong>EGFR</strong><span>연구 사례용 대표 표적 단백질</span></div>
          <div className="info-stat"><strong>PDB 구조</strong><span>공개 실험 구조 자료 활용 예정</span></div>
          <div className="info-stat"><strong>{diseaseName}</strong><span>선택한 질환 연구 사례</span></div>
          <Notice compact>단백질 표적과 질환의 관계는 교수 자문 및 공신력 있는 공개 자료로 검증해야 합니다.</Notice>
          <NavButtons previous={previous} next={next} nextLabel="AI 구조 예측 체험" />
        </aside>
      </div>
    </div>
  );
}

function PredictionScreen({ session, diseaseName, previous, next }: { session: ResearchSession; diseaseName: string; previous: () => void; next: () => void }) {
  return (
    <div className="screen screen--prediction">
      <div className="prediction-grid">
        <section className="panel protein-viewer protein-viewer--compact"><div className="viewer-header"><div><small>선택 단백질</small><h1>EGFR</h1><span>UniProt ID: P00533</span></div></div><ProteinArt /><div className="confidence-legend"><span>낮은 신뢰도</span><i /><span>높은 신뢰도</span></div></section>
        <section className="panel structure-card"><header><h2>실험 구조</h2><span>PDB: 예시 구조</span></header><ProteinArt /><Progress label="구조 커버리지" value={86} /><dl><div><dt>기반</dt><dd>실험 구조 자료</dd></div><div><dt>해석</dt><dd>관찰된 구조 범위 중심</dd></div></dl><p>실험 조건과 구조 해석 범위에 따라 확인되지 않는 영역이 있을 수 있습니다.</p></section>
        <section className="panel structure-card structure-card--wide"><header><h2>AI 예측 구조 <small>(AlphaFold 개념 체험)</small></h2><span className="confidence-badge"><strong>92</strong>/100</span></header><ProteinArt uncertain /><Progress label="예측 구조 커버리지" value={98} /><dl><div><dt>기반</dt><dd>AI 기반 구조 예측 개념</dd></div><div><dt>낮은 신뢰도</dt><dd>유연한 말단·루프 영역</dd></div></dl><p>예측 구조는 실험 구조를 대체하는 정답이 아니며, 영역별 신뢰도를 함께 해석해야 합니다.</p></section>
      </div>
      <section className="panel ai-analysis-result">
  <header className="section-header">
    <div>
      <h2>AI 분석 결과</h2>
      <p>선택한 샘플과 분석 결과를 바탕으로 체험용 AI 분석 결과를 제공합니다.</p>
    </div>
  </header>

  <div className="ai-analysis-metrics"> 
  <div className="ai-metric">
    <div className="ai-metric-label">
  <ShieldCheck />
  <span>위험도</span>
</div> 
    <strong>중간</strong>

    <div className="ai-progress">
      <div className="ai-progress__bar" style={{ width: '62%' }} />
    </div>

    <small>AI 분석 기준 · 62%</small>
  </div>

    <div className="ai-metric ai-metric--priority">
  <div className="ai-metric-label">
  <Target />
  <span>우선순위</span>
</div>
  <strong>높음</strong>

  <div className="ai-progress">
    <div className="ai-progress__bar" style={{ width: '86%' }} />
  </div>

  <small>추가 분석 권장 · 86%</small>
</div>

    <div className="ai-metric ai-metric--research">
  <div className="ai-metric-label">
  <Beaker />
  <span>추천 연구 분야</span>
</div>
  <strong>표적 단백질 분석</strong>

  <div className="ai-progress">
    <div className="ai-progress__bar" style={{ width: '92%' }} />
  </div>

  <small>EGFR 기반 분석 · 92%</small>
</div>
  </div>
</section>
      <div className="prediction-lower">
        <section className="panel explainer"><h2>AI는 어떻게 단백질 구조를 예측할까요?</h2><p>아미노산 서열과 알려진 구조 패턴을 활용해 3차원 좌표와 영역별 신뢰도를 예측하는 개념을 체험합니다.</p><div className="concept-flow"><span><ScanLine />서열 입력</span><ArrowRight /><span><Network />패턴 학습</span><ArrowRight /><span><Atom />3D 좌표 예측</span><ArrowRight /><span><BarChart3 />신뢰도 확인</span></div></section>
        <aside className="panel research-note"><h2>연구 메모</h2><p><Brain /> 선택 질환 <strong>{diseaseName}</strong></p><p><Microscope /> 샘플 종류 <strong>{session.cellModelId === '2d-cell' ? '2D 세포 모델' : '3D 오가노이드'}</strong></p><p><Target /> 단백질 표적 <strong>EGFR</strong></p><NavButtons previous={previous} next={next} nextLabel="후보물질 비교" /></aside>
      </div>
      <Notice>본 화면은 AlphaFold의 구조 예측 개념을 이해하기 위한 교육용 인터페이스입니다. 실제 예측 계산이나 진단 기능이 아닙니다.</Notice>
    </div>
  );
}

function CandidateScreen({ selectedId, select, previous, next }: { selectedId: ResearchSession['selectedCandidateId']; select: (id: ResearchSession['selectedCandidateId']) => void; previous: () => void; next: () => void }) {
  return (
    <div className="screen screen--candidate">
      <section className="panel candidate-workspace">
        <header className="section-header"><div><h1>후보물질 비교</h1><p>후보 구조의 계산상 상호작용과 참고 지표를 비교하고, 더 탐색하고 싶은 연구 방향을 선택하세요.</p></div><span className="educational-chip">연구 참고용 비교</span></header>
        <div className="candidate-cards">
          {candidates.map((item, index) => (
            <button key={item.id} type="button" className={`candidate-card candidate-card--${item.accent} ${selectedId === item.id ? 'is-selected' : ''}`} onClick={() => select(item.id)}>
              <header><div><h2>{item.name}</h2><span>{item.code}</span></div>{selectedId === item.id && <CheckCircle2 />}</header>
              <ChemicalSketch variant={(index + 1) as 1 | 2 | 3} />
              <div className="candidate-score"><span>Docking Score</span><strong>{item.dockingScore} <small>kcal/mol</small></strong></div>
              <Rating value={item.stability} label="예측 결합 안정성" />
              <div className="candidate-details"><strong>주요 상호작용</strong>{item.interactions.map((text) => <p key={text}>• {text}</p>)}<em>{item.feature}</em></div>
            </button>
          ))}
        </div>
        <ComparisonTable />
      </section>
      <div className="screen-actions"><Notice compact>점수가 더 낮다고 실제 약효가 더 좋다는 뜻은 아닙니다. 독성, 흡수, 대사와 실험 검증이 별도로 필요합니다.</Notice><NavButtons previous={previous} next={next} nextLabel="리포트 생성" /></div>
    </div>
  );
}

function ReportScreen({ session, diseaseName, selectedCandidate, updateName, updateRole, previous, print, reset }: { session: ResearchSession; diseaseName: string; selectedCandidate: (typeof candidates)[number]; updateName: (value: string) => void; updateRole: (value: string) => void; previous: () => void; print: (kind: 'report' | 'card') => void; reset: () => void }) {
  return (
    <div className="screen screen--report">
      <div className="report-layout">
        <section className="panel report-preview">
          <header className="section-header"><div><h1>개인 맞춤형 리포트 미리보기</h1><p>체험 과정에서 선택한 연구 내용을 바탕으로 교육용 결과물을 생성합니다.</p></div></header>
          <div className="personal-fields"><label><UserRound /> 연구원 이름<input value={session.researcherName} onChange={(event) => updateName(event.target.value)} placeholder="이름 또는 닉네임" maxLength={20} /></label><label><Award /> 희망 직업<input value={session.dreamRole} onChange={(event) => updateRole(event.target.value)} maxLength={24} /></label></div>
          <div className="preview-grid">
            <div className="a4-thumbnail"><Brand compact /><strong>AI RESEARCH REPORT</strong><span>{session.researcherName || '미래 연구원'}</span><div className="thumb-ring">84</div><p>{diseaseName}</p><p>EGFR · {selectedCandidate.name}</p><small>교육용 연구 결과</small></div>
            <div className="card-thumbnails"><div className="mini-card"><Brand compact /><small>OFFICIAL AI RESEARCH CARD</small><strong>AI LEVEL 4</strong><span>{session.researcherName || '미래 연구원'}</span></div><div className="mini-card mini-card--back"><Brand compact /><QrPlaceholder /><span>{session.sessionId}</span></div></div>
          </div>
        </section>
        <aside className="report-side">
          <section className="panel print-ready"><CheckCircle2 /><div><h2>인쇄 준비 완료</h2><p>리포트와 연구원 카드가 생성되었습니다.</p></div><ul><li><Check /> A4 AI Research Report</li><li><Check /> AI Research Card Front</li><li><Check /> AI Research Card Back</li></ul><button type="button" className="button button--primary" onClick={() => print('report')}><Printer /> A4 리포트 출력</button><button type="button" className="button button--secondary" onClick={() => print('card')}><Printer /> 연구원 카드 출력</button></section>
          <section className="panel generated-info"><h2>생성 정보</h2><dl><div><dt>Research ID</dt><dd>{session.sessionId}</dd></div><div><dt>Main Field</dt><dd>Cell-based Bio AI</dd></div><div><dt>AI LEVEL</dt><dd>Advanced (4/5)</dd></div><div><dt>선택 연구</dt><dd>{diseaseName}</dd></div><div><dt>후보 방향</dt><dd>{selectedCandidate.name}</dd></div></dl><QrPlaceholder /></section>
        </aside>
      </div>
      <div className="screen-actions"><Notice compact>출력물은 학습 경험을 기록하는 기념품이며 의학적 판단이나 연구 검증 결과가 아닙니다.</Notice><div className="nav-buttons"><button type="button" className="button button--ghost" onClick={previous}><ArrowLeft /> 이전</button><button type="button" className="button button--outline" onClick={reset}>새 연구 시작</button></div></div>
    </div>
  );
}

function ComparisonTable() {
  return <div className="comparison-table"><h2>후보물질 비교 요약 <small>(연구 참고용)</small></h2><div className="comparison-row comparison-row--head"><span>항목</span>{candidates.map((item) => <strong key={item.id}>{item.name}<small>{item.code}</small></strong>)}</div><div className="comparison-row"><span>Docking Score</span>{candidates.map((item) => <strong key={item.id}>{item.dockingScore}</strong>)}</div><div className="comparison-row"><span>결합 안정성</span>{candidates.map((item) => <Rating key={item.id} value={item.stability} compact />)}</div><div className="comparison-row"><span>선택성 참고 지표</span>{candidates.map((item) => <Rating key={item.id} value={item.selectivity} compact />)}</div><div className="comparison-row"><span>용해도 참고 지표</span>{candidates.map((item) => <Rating key={item.id} value={item.solubility} compact />)}</div></div>;
}

function Notice({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return <div className={`notice ${compact ? 'notice--compact' : ''}`}><Info /> <strong>안내사항</strong><span>{children}</span></div>;
}

function Rating({ value, label, compact = false }: { value: number; label?: string; compact?: boolean }) {
  return <div className={`rating ${compact ? 'rating--compact' : ''}`}>{label && <span>{label}</span>}<div>{Array.from({ length: 5 }, (_, index) => <i key={index} className={index < value ? 'is-on' : ''} />)}</div></div>;
}

function SummaryItem({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return <div className="summary-item"><span className="summary-item__icon">{icon}</span><div><small>{label}</small>{children}</div></div>;
}

function Progress({ label, value }: { label: string; value: number }) {
  return <div className="progress"><div><span>{label}</span><strong>{value}%</strong></div><i><b style={{ width: `${value}%` }} /></i></div>;
}

function NavButtons({ previous, next, nextLabel = '다음 단계' }: { previous: () => void; next: () => void; nextLabel?: string }) {
  return <div className="nav-buttons"><button type="button" className="button button--ghost" onClick={previous}><ArrowLeft /> 이전</button><button type="button" className="button button--primary" onClick={next}>{nextLabel} <ArrowRight /></button></div>;
}

export default App;
