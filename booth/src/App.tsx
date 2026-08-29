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
import { candidates, diseases } from './data/content';
import { Brand } from './components/Brand';
import {
  ChemicalSketch,
  ProteinArt,
  QrPlaceholder,
  ScienceOrb,
} from './components/ScienceArt';
import { Shell } from './components/Shell';
import { PrintOutputs } from './components/PrintOutputs';
import { CellScopeExperience } from './components/CellScopeExperience';
import type {
  CellModelId,
  DiseaseId,
  ResearchSession,
} from './types';
import { aiAnalysisByDisease } from './data/aiAnalysis';

const createSessionId = () => {
  const now = new Date();
  const pad = (value: number) =>
    String(value).padStart(2, '0');

  return `BDL-${now.getFullYear()}${pad(
    now.getMonth() + 1,
  )}${pad(now.getDate())}-${pad(now.getHours())}${pad(
    now.getMinutes(),
  )}-${Math.floor(100 + Math.random() * 900)}`;
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

  const [session, setSession] =
    useState<ResearchSession>(() => {
      try {
        const cached = localStorage.getItem(
          'biodocklab-session',
        );

        return cached
          ? {
              ...defaultSession(),
              ...JSON.parse(cached),
            }
          : defaultSession();
      } catch {
        return defaultSession();
      }
    });

  const [printKind, setPrintKind] =
    useState<'report' | 'card'>('report');

  useEffect(() => {
    localStorage.setItem(
      'biodocklab-session',
      JSON.stringify(session),
    );
  }, [session]);

  const disease = useMemo(
    () =>
      diseases.find(
        (item) => item.id === session.diseaseId,
      )!,
    [session.diseaseId],
  );

  const candidate = useMemo(
    () =>
      candidates.find(
        (item) =>
          item.id === session.selectedCandidateId,
      )!,
    [session.selectedCandidateId],
  );

  const update = <
    K extends keyof ResearchSession,
  >(
    key: K,
    value: ResearchSession[K],
  ) => {
    setSession((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const reset = () => {
    localStorage.removeItem(
      'biodocklab-session',
    );

    setSession(defaultSession());
    setStep(1);
  };

  const print = (
    kind: 'report' | 'card',
  ) => {
    setPrintKind(kind);
    document.body.dataset.printKind = kind;

    window.setTimeout(
      () => window.print(),
      80,
    );
  };

  return (
    <>
      <Shell
        step={step}
        onStep={setStep}
        onReset={reset}
        sessionId={session.sessionId}
      >
        {step === 1 && (
          <HomeScreen
            next={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <OrganoidScreen
            session={session}
            updateDisease={(value) =>
              update('diseaseId', value)
            }
            updateCellModel={(value) =>
              update('cellModelId', value)
            }
            previous={() => setStep(1)}
            next={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <ProteinScreen
            diseaseName={disease.title}
            previous={() => setStep(2)}
            next={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <PredictionScreen
            session={session}
            diseaseName={disease.title}
            previous={() => setStep(3)}
            next={() => setStep(5)}
          />
        )}

        {step === 5 && (
          <CandidateScreen
            selectedId={
              session.selectedCandidateId
            }
            select={(value) =>
              update(
                'selectedCandidateId',
                value,
              )
            }
            previous={() => setStep(4)}
            next={() => setStep(6)}
          />
        )}

        {step === 6 && (
          <ReportScreen
            session={session}
            diseaseName={disease.title}
            selectedCandidate={candidate}
            updateName={(value) =>
              update('researcherName', value)
            }
            updateRole={(value) =>
              update('dreamRole', value)
            }
            previous={() => setStep(5)}
            print={print}
            reset={reset}
          />
        )}
      </Shell>

      <PrintOutputs
        session={session}
        disease={disease}
        candidate={candidate}
      />

      <span
        className="print-kind-state"
        data-kind={printKind}
      />
    </>
  );
}

function HomeScreen({
  next,
}: {
  next: () => void;
}) {
  return (
    <div className="screen screen--home">
      <section className="hero-panel">
        <div className="hero-panel__content">
          <small>
            BIO AI RESEARCH EXPERIENCE
          </small>

          <h1>
            3분 동안
            <br />
            <span>
              바이오 AI 연구자
            </span>
            가 되어보세요.
          </h1>

          <p>
            샘플을 직접 스캔한 뒤,
            질환과 오가노이드 모델을 선택하고
            단백질 구조와 AI 연구 과정을
            따라갑니다.
          </p>

          <div className="mini-flow">
            {[
              ['샘플 관찰', Microscope],
              ['연구 질문', Brain],
              ['단백질 탐색', Atom],
              ['AI 연구', Sparkles],
              ['연구 기록', FileText],
            ].map(
              ([label, Icon], index) => {
                const IconComponent =
                  Icon as typeof Brain;

                return (
                  <span key={String(label)}>
                    <IconComponent />
                    {String(label)}

                    {index < 4 && (
                      <ChevronRight />
                    )}
                  </span>
                );
              },
            )}
          </div>
        </div>

        <div className="hero-panel__action">
          <div className="dna-hero">
            <Microscope />
          </div>

          <strong>
            STEP 1
          </strong>

          <p>
            먼저 CellScope에
            샘플을 넣어주세요.
          </p>

          <small>
            예상 소요시간 약 30초
          </small>
        </div>
      </section>

      <CellScopeExperience />

      <section className="panel kiosk-next-panel">
        <div>
          <span className="eyebrow">
            <CheckCircle2 />
            NEXT RESEARCH STEP
          </span>

          <h2>
            샘플 관찰을 마쳤나요?
          </h2>

          <p>
            이제 이 샘플로 어떤 질환을
            연구할지 선택합니다.
          </p>
        </div>

        <button
          type="button"
          className="button button--hero"
          onClick={next}
        >
          연구 질문 선택
          <ArrowRight />
        </button>
      </section>

      <Notice>
        본 체험은 바이오 연구의 사고 과정을
        이해하기 위한 교육용 시뮬레이션입니다.
        실제 의료 진단·치료·처방을 목적으로
        하지 않습니다.
      </Notice>
    </div>
  );
}

function OrganoidScreen({
  session,
  updateDisease,
  updateCellModel,
  previous,
  next,
}: {
  session: ResearchSession;
  updateDisease: (
    id: DiseaseId,
  ) => void;
  updateCellModel: (
    id: CellModelId,
  ) => void;
  previous: () => void;
  next: () => void;
}) {
  const selectedDisease = diseases.find(
    (item) =>
      item.id === session.diseaseId,
  )!;

  return (
    <div className="screen screen--organoid">
      <section className="page-intro panel">
        <div>
          <span className="eyebrow">
            <Network />
            연구 질문
          </span>

          <h1>
            이 샘플로 어떤 질환을
            연구하시겠어요?
          </h1>

          <p>
            하나의 질환을 선택하고,
            그 질환을 살펴보기 위한
            연구 모델을 비교합니다.
          </p>
        </div>

        <ScienceOrb
          type="brain"
          size={118}
        />
      </section>

      <div className="content-with-summary">
        <div className="main-column">
          <section className="panel selection-section">
            <div className="section-side-label">
              <Target />

              <h3>
                질환 선택
              </h3>

              <p>
                오늘 탐색할 연구 질문을
                선택하세요.
              </p>
            </div>

            <div className="disease-cards">
              {diseases.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`disease-card ${
                    session.diseaseId ===
                    item.id
                      ? 'is-selected'
                      : ''
                  }`}
                  onClick={() =>
                    updateDisease(
                      item.id,
                    )
                  }
                >
                  <ScienceOrb
                    type={
                      item.icon ===
                      'cells'
                        ? 'cells'
                        : item.icon ===
                            'neuron'
                          ? 'neuron'
                          : 'brain'
                    }
                    size={72}
                  />

                  <div>
                    <h3>
                      {item.title}
                    </h3>

                    <small>
                      {item.titleEn}
                    </small>

                    <p>
                      {item.description}
                    </p>
                  </div>

                  {item.recommended && (
                    <em>
                      추천 예시
                    </em>
                  )}

                  {session.diseaseId ===
                    item.id && (
                    <Check className="selected-check" />
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="panel selection-section model-section">
            <div className="section-side-label">
              <FlaskConical />

              <h3>
                연구 모델
              </h3>

              <p>
                같은 연구 질문도 어떤
                모델을 사용하느냐에 따라
                관찰할 수 있는 정보가
                달라집니다.
              </p>
            </div>

            <div className="model-compare">
              <button
                type="button"
                className={`model-card ${
                  session.cellModelId ===
                  '2d-cell'
                    ? 'is-selected'
                    : ''
                }`}
                onClick={() =>
                  updateCellModel(
                    '2d-cell',
                  )
                }
              >
                <h3>
                  2D 세포 모델
                </h3>

                <small>
                  평면 배양 환경의 단일
                  세포층
                </small>

                <ScienceOrb
                  type="cells"
                  size={100}
                />

                <strong>
                  특징
                </strong>

                <ul>
                  <li>
                    단순하고 관찰이 쉬운
                    연구 모델
                  </li>

                  <li>
                    세포 간 입체적
                    상호작용 표현은 제한적
                  </li>

                  <li>
                    기초적인 세포 반응
                    비교에 활용
                  </li>
                </ul>

                <Rating value={2} />
              </button>

              <span className="vs">
                VS
              </span>

              <button
                type="button"
                className={`model-card model-card--primary ${
                  session.cellModelId ===
                  '3d-organoid'
                    ? 'is-selected'
                    : ''
                }`}
                onClick={() =>
                  updateCellModel(
                    '3d-organoid',
                  )
                }
              >
                <h3>
                  3D 뇌 오가노이드
                </h3>

                <small>
                  일부 조직 특성을 모사하는
                  3차원 연구 모델
                </small>

                <ScienceOrb
                  type="organoid"
                  size={112}
                />

                <strong>
                  특징
                </strong>

                <ul>
                  <li>
                    3D 구조를 일부 반영
                  </li>

                  <li>
                    세포 간 상호작용 연구에
                    활용
                  </li>

                  <li>
                    실제 인체 조직 전체와
                    동일한 것은 아님
                  </li>
                </ul>

                <Rating value={5} />
              </button>
            </div>
          </section>

          <div className="screen-actions">
            <Notice compact>
              공개 데이터 기반 교육용
              체험이며 실제 임상 판단에
              사용되지 않습니다.
            </Notice>

            <NavButtons
              previous={previous}
              next={next}
              nextLabel="단백질 탐색"
            />
          </div>
        </div>

        <aside className="panel summary-panel">
          <h2>
            오늘의 연구 경로
            <BookMarked />
          </h2>

          <SummaryItem
            icon={<Brain />}
            label="연구 질문"
          >
            <strong>
              {selectedDisease.title}
            </strong>

            <span>
              {selectedDisease.titleEn}
            </span>
          </SummaryItem>

          <SummaryItem
            icon={<Atom />}
            label="연구 모델"
          >
            <strong>
              {session.cellModelId ===
              '3d-organoid'
                ? '3D 뇌 오가노이드'
                : '2D 세포 모델'}
            </strong>

            <span>
              선택됨
            </span>
          </SummaryItem>

          <SummaryItem
            icon={<Target />}
            label="다음 단계"
          >
            <strong>
              관련 단백질 구조 탐색
            </strong>

            <span>
              연구 질문을 분자 수준으로
              이어갑니다.
            </span>
          </SummaryItem>

          <SummaryItem
            icon={<Clock3 />}
            label="남은 체험"
          >
            <strong>
              약 2–3분
            </strong>

            <span>
              전체 체험 기준
            </span>
          </SummaryItem>

          <div className="tip-card">
            <Sparkles />

            <strong>
              연구 포인트
            </strong>

            <p>
              오가노이드는 실제 장기 전체가
              아니라 일부 특성을 모사하는
              연구 모델입니다.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ProteinScreen({
  diseaseName,
  previous,
  next,
}: {
  diseaseName: string;
  previous: () => void;
  next: () => void;
}) {
  return (
    <div className="screen screen--protein">
      <div className="content-with-summary">
        <section className="panel protein-viewer">
          <div className="viewer-header">
            <div>
              <small>
                선택 단백질
              </small>

              <h1>
                EGFR
              </h1>

              <p>
                Epidermal Growth Factor
                Receptor
              </p>

              <span>
                UniProt ID: P00533
              </span>
            </div>

            <button type="button">
              뷰 옵션⌄
            </button>
          </div>

          <ProteinArt />

          <div className="viewer-toolbar">
            <span>
              ↻ 회전
            </span>

            <span>
              ＋ 줌
            </span>

            <span>
              ✣ 이동
            </span>

            <span>
              ⌖ 측정
            </span>

            <span>
              ○ 리셋
            </span>
          </div>
        </section>

        <aside className="panel structure-info">
          <span className="eyebrow">
            <Atom />
            단백질 구조 탐색
          </span>

          <h1>
            왜 단백질 구조를
            살펴볼까요?
          </h1>

          <p>
            단백질의 3차원 형태는
            후보물질이 어느 위치에서 어떻게
            상호작용할 수 있는지 탐색하는
            출발점이 됩니다.
          </p>

          <div className="info-stat">
            <strong>
              EGFR
            </strong>

            <span>
              연구 사례용 대표 표적 단백질
            </span>
          </div>

          <div className="info-stat">
            <strong>
              공개 구조 자료
            </strong>

            <span>
              실험으로 확인된 구조 정보를
              참고합니다.
            </span>
          </div>

          <div className="info-stat">
            <strong>
              {diseaseName}
            </strong>

            <span>
              선택한 질환 연구 사례
            </span>
          </div>

          <Notice compact>
            단백질 표적과 질환의 관계는
            공신력 있는 공개 자료와
            전문가 검증을 바탕으로
            해석해야 합니다.
          </Notice>

          <NavButtons
            previous={previous}
            next={next}
            nextLabel="AI 구조 탐색"
          />
        </aside>
      </div>
    </div>
  );
}

function PredictionScreen({
  session,
  diseaseName,
  previous,
  next,
}: {
  session: ResearchSession;
  diseaseName: string;
  previous: () => void;
  next: () => void;
}) {
  const aiAnalysis =
    aiAnalysisByDisease[
      session.diseaseId
    ];

  return (
    <div className="screen screen--prediction">
      <div className="prediction-grid">
        <section className="panel protein-viewer protein-viewer--compact">
          <div className="viewer-header">
            <div>
              <small>
                선택 단백질
              </small>

              <h1>
                EGFR
              </h1>

              <span>
                UniProt ID: P00533
              </span>
            </div>
          </div>

          <ProteinArt />

          <div className="confidence-legend">
            <span>
              낮은 신뢰도
            </span>

            <i />

            <span>
              높은 신뢰도
            </span>
          </div>
        </section>

        <section className="panel structure-card">
          <header>
            <h2>
              실험 구조
            </h2>

            <span>
              공개 구조 사례
            </span>
          </header>

          <ProteinArt />

          <Progress
            label="구조 커버리지"
            value={86}
          />

          <dl>
            <div>
              <dt>
                기반
              </dt>

              <dd>
                실험 구조 자료
              </dd>
            </div>

            <div>
              <dt>
                해석
              </dt>

              <dd>
                관찰된 구조 범위 중심
              </dd>
            </div>
          </dl>

          <p>
            실험 조건과 구조 해석 범위에
            따라 확인되지 않는 영역이 있을
            수 있습니다.
          </p>
        </section>

        <section className="panel structure-card structure-card--wide">
          <header>
            <h2>
              AI 구조 예측
              <small>
                (개념 체험)
              </small>
            </h2>

            <span className="educational-chip">
              교육용 시각화
            </span>
          </header>

          <ProteinArt uncertain />

          <Progress
            label="예측 구조 범위"
            value={98}
          />

          <dl>
            <div>
              <dt>
                기반
              </dt>

              <dd>
                AI 기반 구조 예측 개념
              </dd>
            </div>

            <div>
              <dt>
                주의
              </dt>

              <dd>
                영역별 신뢰도를 함께 해석
              </dd>
            </div>
          </dl>

          <p>
            예측 구조는 실험 구조를
            대체하는 정답이 아니며,
            연구자가 다음 질문을 만드는 데
            활용하는 정보 중 하나입니다.
          </p>
        </section>
      </div>

      <section className="panel ai-analysis-result">
        <header className="section-header">
          <div>
            <h2>
              AI 연구 가이드
            </h2>

            <p>
              선택한 연구 질문을 바탕으로
              다음 탐색 방향을 정리합니다.
            </p>
          </div>
        </header>

        <div className="ai-analysis-metrics">
          <div className="ai-metric">
            <div className="ai-metric-label">
              <ShieldCheck />

              <span>
                관찰 포인트
              </span>
            </div>

            <strong>
              {aiAnalysis.riskLabel}
            </strong>

            <small>
              교육용 연구 시나리오
            </small>
          </div>

          <div className="ai-metric ai-metric--priority">
            <div className="ai-metric-label">
              <Target />

              <span>
                다음 질문
              </span>
            </div>

            <strong>
              {
                aiAnalysis.priorityLabel
              }
            </strong>

            <small>
              추가 탐색 방향
            </small>
          </div>

          <div className="ai-metric ai-metric--research">
            <div className="ai-metric-label">
              <Beaker />

              <span>
                연구 분야
              </span>
            </div>

            <strong>
              {
                aiAnalysis.researchLabel
              }
            </strong>

            <small>
              EGFR 관련 연구 사례
            </small>
          </div>
        </div>
      </section>

      <div className="prediction-lower">
        <section className="panel explainer">
          <h2>
            AI는 단백질 구조 연구를
            어떻게 도울까요?
          </h2>

          <p>
            아미노산 서열과 알려진 구조
            정보를 바탕으로 3차원 구조를
            예측하고, 연구자가 확인해야 할
            영역을 탐색하는 데 활용됩니다.
          </p>

          <div className="concept-flow">
            <span>
              <ScanLine />
              서열 입력
            </span>

            <ArrowRight />

            <span>
              <Network />
              패턴 탐색
            </span>

            <ArrowRight />

            <span>
              <Atom />
              3D 구조 예측
            </span>

            <ArrowRight />

            <span>
              <BarChart3 />
              결과 검토
            </span>
          </div>
        </section>

        <aside className="panel research-note">
          <h2>
            오늘의 연구 메모
          </h2>

          <p>
            <Brain />
            연구 질문
            <strong>
              {diseaseName}
            </strong>
          </p>

          <p>
            <Microscope />
            연구 모델
            <strong>
              {session.cellModelId ===
              '2d-cell'
                ? '2D 세포 모델'
                : '3D 오가노이드'}
            </strong>
          </p>

          <p>
            <Target />
            탐색 단백질
            <strong>
              EGFR
            </strong>
          </p>

          <NavButtons
            previous={previous}
            next={next}
            nextLabel="후보 방향 탐색"
          />
        </aside>
      </div>

      <Notice>
        본 화면은 AI 기반 구조 예측의
        개념을 이해하기 위한 교육용
        인터페이스입니다. 실제 구조 예측
        계산이나 의료 진단 기능이 아닙니다.
      </Notice>
    </div>
  );
}

function CandidateScreen({
  selectedId,
  select,
  previous,
  next,
}: {
  selectedId:
    ResearchSession['selectedCandidateId'];
  select: (
    id: ResearchSession['selectedCandidateId'],
  ) => void;
  previous: () => void;
  next: () => void;
}) {
  return (
    <div className="screen screen--candidate">
      <section className="panel candidate-workspace">
        <header className="section-header">
          <div>
            <h1>
              후보 방향 비교
            </h1>

            <p>
              여러 구조적 후보를 비교하고,
              더 탐색하고 싶은 연구 방향을
              하나 선택하세요.
            </p>
          </div>

          <span className="educational-chip">
            교육용 연구 비교
          </span>
        </header>

        <div className="candidate-cards">
          {candidates.map(
            (item, index) => (
              <button
                key={item.id}
                type="button"
                className={`candidate-card candidate-card--${item.accent} ${
                  selectedId === item.id
                    ? 'is-selected'
                    : ''
                }`}
                onClick={() =>
                  select(item.id)
                }
              >
                <header>
                  <div>
                    <h2>
                      {item.name}
                    </h2>

                    <span>
                      {item.code}
                    </span>
                  </div>

                  {selectedId ===
                    item.id && (
                    <CheckCircle2 />
                  )}
                </header>

                <ChemicalSketch
                  variant={
                    (index +
                      1) as
                      | 1
                      | 2
                      | 3
                  }
                />

                <div className="candidate-score">
                  <span>
                    계산 참고값
                  </span>

                  <strong>
                    {
                      item.dockingScore
                    }

                    <small>
                      {' '}
                      kcal/mol
                    </small>
                  </strong>
                </div>

                <Rating
                  value={
                    item.stability
                  }
                  label="예측 결합 안정성"
                />

                <div className="candidate-details">
                  <strong>
                    주요 상호작용
                  </strong>

                  {item.interactions.map(
                    (text) => (
                      <p key={text}>
                        • {text}
                      </p>
                    ),
                  )}

                  <em>
                    {item.feature}
                  </em>
                </div>
              </button>
            ),
          )}
        </div>

        <ComparisonTable />
      </section>

      <div className="screen-actions">
        <Notice compact>
          계산 참고값은 실제 약효를
          의미하지 않습니다. 실제 연구에는
          실험 검증과 다양한 추가 평가가
          필요합니다.
        </Notice>

        <NavButtons
          previous={previous}
          next={next}
          nextLabel="나의 연구 기록"
        />
      </div>
    </div>
  );
}

function ReportScreen({
  session,
  diseaseName,
  selectedCandidate,
  updateName,
  updateRole,
  previous,
  print,
  reset,
}: {
  session: ResearchSession;
  diseaseName: string;
  selectedCandidate:
    (typeof candidates)[number];
  updateName: (
    value: string,
  ) => void;
  updateRole: (
    value: string,
  ) => void;
  previous: () => void;
  print: (
    kind: 'report' | 'card',
  ) => void;
  reset: () => void;
}) {
  return (
    <div className="screen screen--report">
      <div className="report-layout">
        <section className="panel report-preview">
          <header className="section-header">
            <div>
              <h1>
                오늘의 연구 기록
              </h1>

              <p>
                체험 과정에서 선택한 내용을
                하나의 Research Trail로
                정리합니다.
              </p>
            </div>
          </header>

          <div className="personal-fields">
            <label>
              <UserRound />
              연구원 이름

              <input
                value={
                  session.researcherName
                }
                onChange={(event) =>
                  updateName(
                    event.target.value,
                  )
                }
                placeholder="이름 또는 닉네임"
                maxLength={20}
              />
            </label>

            <label>
              <Award />
              관심 분야

              <input
                value={
                  session.dreamRole
                }
                onChange={(event) =>
                  updateRole(
                    event.target.value,
                  )
                }
                maxLength={24}
              />
            </label>
          </div>

          <div className="preview-grid">
            <div className="a4-thumbnail">
              <Brand compact />

              <strong>
                RESEARCH TRAIL
              </strong>

              <span>
                {session.researcherName ||
                  '미래 연구원'}
              </span>

              <p>
                샘플 관찰
              </p>

              <p>
                {diseaseName}
              </p>

              <p>
                {session.cellModelId ===
                '3d-organoid'
                  ? '3D Organoid'
                  : '2D Cell'}
              </p>

              <p>
                EGFR
              </p>

              <p>
                AI Structure Exploration
              </p>

              <p>
                {
                  selectedCandidate.name
                }
              </p>

              <small>
                교육용 연구 체험 기록
              </small>
            </div>

            <div className="card-thumbnails">
              <div className="mini-card">
                <Brand compact />

                <small>
                  BIODOCKLAB
                </small>

                <strong>
                  RESEARCHER
                </strong>

                <span>
                  {session.researcherName ||
                    '미래 연구원'}
                </span>
              </div>

              <div className="mini-card mini-card--back">
                <Brand compact />

                <QrPlaceholder />

                <span>
                  {session.sessionId}
                </span>
              </div>
            </div>
          </div>
        </section>

        <aside className="report-side">
          <section className="panel print-ready">
            <CheckCircle2 />

            <div>
              <h2>
                연구 체험 완료
              </h2>

              <p>
                오늘 선택한 연구 경로가
                완성되었습니다.
              </p>
            </div>

            <ul>
              <li>
                <Check />
                샘플 관찰
              </li>

              <li>
                <Check />
                질환 연구 질문
              </li>

              <li>
                <Check />
                오가노이드 모델
              </li>

              <li>
                <Check />
                EGFR 구조 탐색
              </li>

              <li>
                <Check />
                AI 구조 연구
              </li>
            </ul>

            <button
              type="button"
              className="button button--primary"
              onClick={() =>
                print('report')
              }
            >
              <Printer />
              연구 기록 보기
            </button>

            <button
              type="button"
              className="button button--secondary"
              onClick={() =>
                print('card')
              }
            >
              <Printer />
              연구원 카드 보기
            </button>
          </section>

          <section className="panel generated-info">
            <h2>
              Research Trail
            </h2>

            <dl>
              <div>
                <dt>
                  Research ID
                </dt>

                <dd>
                  {session.sessionId}
                </dd>
              </div>

              <div>
                <dt>
                  Research Question
                </dt>

                <dd>
                  {diseaseName}
                </dd>
              </div>

              <div>
                <dt>
                  Model
                </dt>

                <dd>
                  {session.cellModelId ===
                  '3d-organoid'
                    ? '3D Organoid'
                    : '2D Cell'}
                </dd>
              </div>

              <div>
                <dt>
                  Protein
                </dt>

                <dd>
                  EGFR
                </dd>
              </div>

              <div>
                <dt>
                  Next Direction
                </dt>

                <dd>
                  {
                    selectedCandidate.name
                  }
                </dd>
              </div>
            </dl>

            <QrPlaceholder />
          </section>
        </aside>
      </div>

      <div className="screen-actions">
        <Notice compact>
          결과물은 바이오 연구 과정을
          이해하기 위한 교육용 체험
          기록입니다.
        </Notice>

        <div className="nav-buttons">
          <button
            type="button"
            className="button button--ghost"
            onClick={previous}
          >
            <ArrowLeft />
            이전
          </button>

          <button
            type="button"
            className="button button--outline"
            onClick={reset}
          >
            다음 참가자 준비
          </button>
        </div>
      </div>
    </div>
  );
}

function ComparisonTable() {
  return (
    <div className="comparison-table">
      <h2>
        후보 방향 비교
        <small>
          (교육용 참고)
        </small>
      </h2>

      <div className="comparison-row comparison-row--head">
        <span>
          항목
        </span>

        {candidates.map((item) => (
          <strong key={item.id}>
            {item.name}

            <small>
              {item.code}
            </small>
          </strong>
        ))}
      </div>

      <div className="comparison-row">
        <span>
          계산 참고값
        </span>

        {candidates.map((item) => (
          <strong key={item.id}>
            {item.dockingScore}
          </strong>
        ))}
      </div>

      <div className="comparison-row">
        <span>
          결합 안정성
        </span>

        {candidates.map((item) => (
          <Rating
            key={item.id}
            value={item.stability}
            compact
          />
        ))}
      </div>

      <div className="comparison-row">
        <span>
          선택성 참고 지표
        </span>

        {candidates.map((item) => (
          <Rating
            key={item.id}
            value={item.selectivity}
            compact
          />
        ))}
      </div>

      <div className="comparison-row">
        <span>
          용해도 참고 지표
        </span>

        {candidates.map((item) => (
          <Rating
            key={item.id}
            value={item.solubility}
            compact
          />
        ))}
      </div>
    </div>
  );
}

function Notice({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`notice ${
        compact
          ? 'notice--compact'
          : ''
      }`}
    >
      <Info />

      <strong>
        안내
      </strong>

      <span>
        {children}
      </span>
    </div>
  );
}

function Rating({
  value,
  label,
  compact = false,
}: {
  value: number;
  label?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`rating ${
        compact
          ? 'rating--compact'
          : ''
      }`}
    >
      {label && (
        <span>
          {label}
        </span>
      )}

      <div>
        {Array.from(
          {
            length: 5,
          },
          (_, index) => (
            <i
              key={index}
              className={
                index < value
                  ? 'is-on'
                  : ''
              }
            />
          ),
        )}
      </div>
    </div>
  );
}

function SummaryItem({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="summary-item">
      <span className="summary-item__icon">
        {icon}
      </span>

      <div>
        <small>
          {label}
        </small>

        {children}
      </div>
    </div>
  );
}

function Progress({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="progress">
      <div>
        <span>
          {label}
        </span>

        <strong>
          {value}%
        </strong>
      </div>

      <i>
        <b
          style={{
            width: `${value}%`,
          }}
        />
      </i>
    </div>
  );
}

function NavButtons({
  previous,
  next,
  nextLabel = '다음 단계',
}: {
  previous: () => void;
  next: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="nav-buttons">
      <button
        type="button"
        className="button button--ghost"
        onClick={previous}
      >
        <ArrowLeft />
        이전
      </button>

      <button
        type="button"
        className="button button--primary"
        onClick={next}
      >
        {nextLabel}
        <ArrowRight />
      </button>
    </div>
  );
}

export default App;