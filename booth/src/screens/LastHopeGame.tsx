import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Protein3DViewer,
} from '../components/Protein3DViewer';

import {
  dockingTargets,
  type DeepDiveProteinId,
} from '../data/dockingTargets';

import {
  dockingResultByProteinId,
} from '../data/dockingResults';

type Stage =
  | 'intro'
  | 'quiz'
  | 'memory'
  | 'match'
  | 'pocket'
  | 'candidate'
  | 'escape'
  | 'success'
  | 'fail';

const TOTAL_SECONDS = 90;

const ALL_IDS: DeepDiveProteinId[] = [
  'sars2-mpro',
  'mers-mpro',
  'h1n1-neuraminidase',
];

const ROUTE = [
  'ENTRY',
  'BIO LAB',
  'STRUCTURE',
  'SYNTHESIS',
  'EXIT',
];

function formatTime(seconds: number) {
  const safe = Math.max(0, seconds);

  const minutes = String(
    Math.floor(safe / 60),
  ).padStart(2, '0');

  const secs = String(
    safe % 60,
  ).padStart(2, '0');

  return `${minutes}:${secs}`;
}

function shuffled<T>(
  items: T[],
): T[] {
  return [...items].sort(
    () => Math.random() - 0.5,
  );
}

function stageIndex(stage: Stage) {
  switch (stage) {
    case 'quiz':
      return 0;

    case 'memory':
    case 'match':
      return 1;

    case 'pocket':
      return 2;

    case 'candidate':
      return 3;

    case 'escape':
    case 'success':
      return 4;

    default:
      return 0;
  }
}

export default function LastHopeGame() {
  const [stage, setStage] =
    useState<Stage>('intro');

  const [targetId, setTargetId] =
    useState<DeepDiveProteinId>(
      'sars2-mpro',
    );

  const [matchOrder, setMatchOrder] =
    useState<DeepDiveProteinId[]>(
      ALL_IDS,
    );

  const [startedAt, setStartedAt] =
    useState<number | null>(null);

  const [penaltySeconds, setPenaltySeconds] =
    useState(0);

  const [remaining, setRemaining] =
    useState(TOTAL_SECONDS);

  const [score, setScore] =
    useState(0);

  const [memoryCount, setMemoryCount] =
    useState(5);

  const [feedback, setFeedback] =
    useState('');

  const [pocketChoice, setPocketChoice] =
    useState<string | null>(null);

  const [candidateIndex, setCandidateIndex] =
    useState<number | null>(null);

  const [correctCount, setCorrectCount] =
    useState(0);

  const [escapeProgress, setEscapeProgress] =
    useState(0);

  const memoryAdvanceRef =
    useRef(false);

  const target =
    dockingTargets[targetId];

  const candidates =
    dockingResultByProteinId(targetId)
      ?.candidates ?? [];

  const running =
    ![
      'intro',
      'success',
      'fail',
    ].includes(stage);

  const infection = useMemo(() => {
    if (stage === 'intro') {
      return 12;
    }

    if (stage === 'success') {
      return Math.min(
        92,
        Math.round(
          10 +
            ((TOTAL_SECONDS -
              remaining) /
              TOTAL_SECONDS) *
              90,
        ),
      );
    }

    if (stage === 'fail') {
      return 100;
    }

    return Math.min(
      99,
      Math.round(
        10 +
          ((TOTAL_SECONDS -
            remaining) /
            TOTAL_SECONDS) *
            90,
      ),
    );
  }, [
    remaining,
    stage,
  ]);

  const danger =
    remaining <= 30;

  const critical =
    remaining <= 15;

  useEffect(() => {
    if (
      !running ||
      startedAt === null
    ) {
      return;
    }

    const timer =
      window.setInterval(() => {
        const elapsed =
          Math.floor(
            (Date.now() -
              startedAt) /
              1000,
          );

        const next =
          TOTAL_SECONDS -
          elapsed -
          penaltySeconds;

        if (next <= 0) {
          setRemaining(0);
          setStage('fail');
          return;
        }

        setRemaining(next);
      }, 150);

    return () =>
      window.clearInterval(timer);
  }, [
    running,
    startedAt,
    penaltySeconds,
  ]);

  useEffect(() => {
    if (stage !== 'memory') {
      return;
    }

    memoryAdvanceRef.current =
      false;

    setMemoryCount(5);

    const timer =
      window.setInterval(() => {
        setMemoryCount(
          (current) => {
            if (current <= 1) {
              window.clearInterval(
                timer,
              );

              if (
                !memoryAdvanceRef.current
              ) {
                memoryAdvanceRef.current =
                  true;

                window.setTimeout(
                  () =>
                    setStage(
                      'match',
                    ),
                  300,
                );
              }

              return 0;
            }

            return current - 1;
          },
        );
      }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'escape') {
      return;
    }

    setEscapeProgress(0);

    const timer =
      window.setInterval(() => {
        setEscapeProgress(
          (current) => {
            const next =
              current + 4;

            if (next >= 100) {
              window.clearInterval(
                timer,
              );

              window.setTimeout(
                () =>
                  setStage(
                    'success',
                  ),
                300,
              );

              return 100;
            }

            return next;
          },
        );
      }, 90);

    return () =>
      window.clearInterval(timer);
  }, [stage]);

  const resetGame = () => {
    setStage('intro');
    setStartedAt(null);
    setPenaltySeconds(0);
    setRemaining(TOTAL_SECONDS);
    setScore(0);
    setFeedback('');
    setPocketChoice(null);
    setCandidateIndex(null);
    setCorrectCount(0);
    setEscapeProgress(0);
  };

  const beginGame = () => {
    const randomTarget =
      ALL_IDS[
        Math.floor(
          Math.random() *
            ALL_IDS.length,
        )
      ];

    setTargetId(randomTarget);

    setMatchOrder(
      shuffled(ALL_IDS),
    );

    setPenaltySeconds(0);
    setRemaining(
      TOTAL_SECONDS,
    );
    setScore(0);
    setCorrectCount(0);
    setCandidateIndex(null);
    setPocketChoice(null);
    setFeedback('');
    setStartedAt(Date.now());
    setStage('quiz');
  };

  const applyPenalty = (
    seconds: number,
  ) => {
    setPenaltySeconds(
      (current) =>
        current + seconds,
    );
  };

  const answerQuiz = (
    answer: 'O' | 'X',
  ) => {
    if (answer === 'O') {
      setScore(
        (current) =>
          current + 100,
      );

      setCorrectCount(
        (current) =>
          current + 1,
      );

      setFeedback(
        'ACCESS GRANTED · +100',
      );

      window.setTimeout(() => {
        setFeedback('');
        setStage('memory');
      }, 650);

      return;
    }

    applyPenalty(5);

    setFeedback(
      'WRONG ANSWER · -5 SEC',
    );

    window.setTimeout(
      () =>
        setFeedback(''),
      750,
    );
  };

  const answerMatch = (
    id: DeepDiveProteinId,
  ) => {
    if (id === targetId) {
      setScore(
        (current) =>
          current + 200,
      );

      setCorrectCount(
        (current) =>
          current + 1,
      );

      setFeedback(
        'TARGET MATCHED · +200',
      );

      window.setTimeout(() => {
        setFeedback('');
        setStage('pocket');
      }, 700);

      return;
    }

    applyPenalty(7);

    setFeedback(
      'WRONG SAMPLE · -7 SEC',
    );

    window.setTimeout(
      () =>
        setFeedback(''),
      750,
    );
  };

  const answerPocket = (
    choice: string,
  ) => {
    setPocketChoice(choice);

    if (choice === 'B') {
      setScore(
        (current) =>
          current + 250,
      );

      setCorrectCount(
        (current) =>
          current + 1,
      );

      setFeedback(
        'BINDING SITE FOUND · +250',
      );

      window.setTimeout(() => {
        setFeedback('');
        setStage(
          'candidate',
        );
      }, 800);

      return;
    }

    applyPenalty(5);

    setFeedback(
      'SITE NOT MATCHED · -5 SEC',
    );

    window.setTimeout(
      () =>
        setFeedback(''),
      700,
    );
  };

  const secureCandidate = () => {
    if (
      candidateIndex === null
    ) {
      return;
    }

    setScore(
      (current) =>
        current +
        300 +
        remaining * 4,
    );

    setStage('escape');
  };

  return (
    <div
      className={[
        'lh-app',
        danger ? 'is-danger' : '',
        critical
          ? 'is-critical'
          : '',
        stage === 'fail'
          ? 'is-failed'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="lh-header">
        <div className="lh-brand">
          <span>
            PAEJAE UNIVERSITY
          </span>

          <strong>
            BioDockLab
          </strong>

          <b>
            : LAST HOPE
          </b>
        </div>

        <div className="lh-header-copy">
          가상 바이러스 대응
          구조생물학 체험
        </div>
      </header>

      {stage !== 'intro' && (
        <>
          <section className="lh-top-hud">
            <div className="lh-time-box">
              <small>
                TIME LIMIT
              </small>

              <strong>
                {formatTime(
                  remaining,
                )}
              </strong>
            </div>

            <div className="lh-route-mini">
              {ROUTE.map(
                (label, index) => (
                  <div
                    key={label}
                    className={[
                      'lh-route-mini__node',
                      index <=
                      stageIndex(stage)
                        ? 'active'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <i>
                      {index + 1}
                    </i>

                    <span>
                      {label}
                    </span>
                  </div>
                ),
              )}
            </div>

            <div className="lh-score-box">
              <small>
                MISSION SCORE
              </small>

              <strong>
                {score}
              </strong>
            </div>
          </section>

          <div className="lh-time-line">
            <i
              style={{
                width: `${
                  (remaining /
                    TOTAL_SECONDS) *
                  100
                }%`,
              }}
            />
          </div>
        </>
      )}

      <main className="lh-layout">
        <section className="lh-game-panel">
          {stage === 'intro' && (
            <IntroScreen
              beginGame={
                beginGame
              }
            />
          )}

          {stage === 'quiz' && (
            <QuizScreen
              answer={
                answerQuiz
              }
              feedback={
                feedback
              }
            />
          )}

          {stage === 'memory' && (
            <MemoryScreen
              target={target}
              count={
                memoryCount
              }
            />
          )}

          {stage === 'match' && (
            <MatchScreen
              order={
                matchOrder
              }
              answer={
                answerMatch
              }
              feedback={
                feedback
              }
            />
          )}

          {stage === 'pocket' && (
            <PocketScreen
              target={target}
              choice={
                pocketChoice
              }
              answer={
                answerPocket
              }
              feedback={
                feedback
              }
            />
          )}

          {stage ===
            'candidate' && (
            <CandidateScreen
              candidates={
                candidates
              }
              selected={
                candidateIndex
              }
              select={
                setCandidateIndex
              }
              secure={
                secureCandidate
              }
            />
          )}

          {stage === 'escape' && (
            <EscapeScreen
              progress={
                escapeProgress
              }
              remaining={
                remaining
              }
            />
          )}

          {stage === 'success' && (
            <SuccessScreen
              remaining={
                remaining
              }
              score={score}
              correctCount={
                correctCount
              }
              targetName={
                target.proteinName
              }
              pdbId={
                target.pdbId
              }
              resetGame={
                resetGame
              }
            />
          )}

          {stage === 'fail' && (
            <FailScreen
              retry={
                beginGame
              }
              reset={
                resetGame
              }
            />
          )}
        </section>

        {stage !== 'intro' &&
          stage !== 'success' &&
          stage !== 'fail' && (
            <CityMap
              infection={
                infection
              }
              stage={
                stage
              }
            />
          )}
      </main>

      <footer className="lh-footer">
        ZVX-26은 가상의
        바이러스입니다.
        실제 공개 PDB 구조를
        활용한 교육용 체험이며
        치료 효과를 판정하지
        않습니다.
      </footer>
    </div>
  );
}

function IntroScreen({
  beginGame,
}: {
  beginGame: () => void;
}) {
  return (
    <div className="lh-intro">
      <div className="lh-intro__warning">
        <span />
        GLOBAL BIO EMERGENCY
      </div>

      <div className="lh-intro-grid">
        <div>
          <small>
            MISSION CODE
            · ZVX-26
          </small>

          <h1>
            LAST
            <br />
            <strong>
              HOPE
            </strong>
          </h1>

          <h2>
            90초 안에
            치료 후보를 확보하고
            연구소를 탈출하라
          </h2>

          <p>
            가상 좀비 바이러스
            ZVX-26이 도시 전체로
            확산되고 있습니다.
            당신은 마지막 연구원입니다.
          </p>
        </div>

        <div className="lh-intro-clock">
          <span>
            OUTBREAK
            PROTOCOL
          </span>

          <strong>
            01:30
          </strong>

          <b>
            CITY STATUS
            · CRITICAL
          </b>
        </div>
      </div>

      <div className="lh-intro-route">
        <span>
          O/X QUIZ
        </span>
        <i>→</i>
        <span>
          MEMORY
        </span>
        <i>→</i>
        <span>
          MATCH
        </span>
        <i>→</i>
        <span>
          POCKET
        </span>
        <i>→</i>
        <span>
          ESCAPE
        </span>
      </div>

      <button
        type="button"
        className="lh-big-start"
        onClick={beginGame}
      >
        <span>
          EMERGENCY START
        </span>

        <strong>
          90초 미션 시작
        </strong>

        <i>▶</i>
      </button>
    </div>
  );
}

function QuizScreen({
  answer,
  feedback,
}: {
  answer: (
    value: 'O' | 'X',
  ) => void;

  feedback: string;
}) {
  return (
    <div className="lh-stage">
      <StageTitle
        number="01"
        label="VIRUS QUIZ"
        title="바이러스 연구소에 진입하라"
        description="첫 번째 보안 질문을 통과하세요."
      />

      <div className="lh-quiz-card">
        <div className="lh-quiz-icon">
          ZVX
        </div>

        <div>
          <small>
            SECURITY QUESTION
          </small>

          <h2>
            단백질의 기능은
            3차원 구조와
            관련이 있다.
          </h2>
        </div>
      </div>

      <div className="lh-ox-grid">
        <button
          onClick={() =>
            answer('O')
          }
          className="lh-answer-o"
        >
          <strong>O</strong>
          <span>
            맞다
          </span>
        </button>

        <button
          onClick={() =>
            answer('X')
          }
          className="lh-answer-x"
        >
          <strong>X</strong>
          <span>
            아니다
          </span>
        </button>
      </div>

      <Feedback
        value={feedback}
      />
    </div>
  );
}

function MemoryScreen({
  target,
  count,
}: {
  target:
    (typeof dockingTargets)[DeepDiveProteinId];

  count: number;
}) {
  return (
    <div className="lh-stage">
      <StageTitle
        number="02"
        label="PROTEIN MEMORY"
        title="목표 단백질을 기억하라"
        description="잠시 후 같은 구조를 찾아야 합니다."
      />

      <div className="lh-memory-grid">
        <div className="lh-protein-window">
          <Protein3DViewer
            target={target}
          />

          <div className="lh-protein-label">
            <small>
              TARGET PROTEIN
            </small>

            <strong>
              {target.proteinName}
            </strong>

            <span>
              PDB {target.pdbId}
            </span>
          </div>
        </div>

        <div className="lh-memory-count">
          <small>
            MEMORIZE
          </small>

          <strong>
            {count}
          </strong>

          <span>
            구조의 전체적인
            모양을 기억하세요
          </span>
        </div>
      </div>
    </div>
  );
}

function MatchScreen({
  order,
  answer,
  feedback,
}: {
  order:
    DeepDiveProteinId[];

  answer: (
    id: DeepDiveProteinId,
  ) => void;

  feedback: string;
}) {
  return (
    <div className="lh-stage">
      <StageTitle
        number="03"
        label="STRUCTURE MATCH"
        title="방금 본 단백질을 찾아라"
        description="A / B / C 중 기억한 구조와 같은 단백질을 선택하세요."
      />

      <div className="lh-match-grid">
        {order.map(
          (id, index) => {
            const item =
              dockingTargets[id];

            return (
              <button
                key={id}
                type="button"
                className="lh-match-card"
                onClick={() =>
                  answer(id)
                }
              >
                <div className="lh-match-letter">
                  {String.fromCharCode(
                    65 + index,
                  )}
                </div>

                <div className="lh-match-view">
                  <Protein3DViewer
                    target={item}
                    compact
                  />
                </div>

                <strong>
                  SAMPLE{' '}
                  {String.fromCharCode(
                    65 + index,
                  )}
                </strong>
              </button>
            );
          },
        )}
      </div>

      <Feedback
        value={feedback}
      />
    </div>
  );
}

function PocketScreen({
  target,
  choice,
  answer,
  feedback,
}: {
  target:
    (typeof dockingTargets)[DeepDiveProteinId];

  choice:
    string | null;

  answer: (
    value: string,
  ) => void;

  feedback: string;
}) {
  return (
    <div className="lh-stage">
      <StageTitle
        number="04"
        label="FIND THE WEAK POINT"
        title="단백질의 결합 부위를 찾아라"
        description="초록색 기준 리간드가 위치한 주변 공간을 찾아보세요."
      />

      <div className="lh-pocket-layout">
        <div className="lh-pocket-view">
          <Protein3DViewer
            target={target}
          />

          {[
            {
              id: 'A',
              className:
                'a',
            },
            {
              id: 'B',
              className:
                'b',
            },
            {
              id: 'C',
              className:
                'c',
            },
          ].map(
            (point) => (
              <button
                key={
                  point.id
                }
                type="button"
                className={[
                  'lh-pocket-marker',
                  point.className,
                  choice ===
                  point.id
                    ? 'selected'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() =>
                  answer(
                    point.id,
                  )
                }
              >
                {point.id}
              </button>
            ),
          )}
        </div>

        <aside className="lh-hint-panel">
          <small>
            RESEARCH HINT
          </small>

          <h3>
            기준 리간드를
            관찰하세요
          </h3>

          <p>
            실제 공개 구조에서
            함께 관찰된
            reference ligand 주변을
            결합 부위 탐색의
            단서로 사용합니다.
          </p>

          <div className="lh-hint-box">
            PDB
            <strong>
              {target.pdbId}
            </strong>
          </div>

          <div className="lh-hint-box">
            REFERENCE
            <strong>
              {
                target
                  .referenceLigand
                  .name
              }
            </strong>
          </div>
        </aside>
      </div>

      <Feedback
        value={feedback}
      />
    </div>
  );
}

function CandidateScreen({
  candidates,
  selected,
  select,
  secure,
}: {
  candidates: Array<{
    id: string;
    name: string;
    code: string;
    status: 'pending' | 'verified';
    vinaScore: number | null;
    interactions: string[];
    note: string;
  }>;

  selected:
    number | null;

  select: (
    value: number,
  ) => void;

  secure:
    () => void;
}) {
  return (
    <div className="lh-stage">
      <StageTitle
        number="05"
        label="CANDIDATE LOCK"
        title="마지막 연구 후보를 확보하라"
        description="이 단계에는 정답이 없습니다. 다음 연구로 보낼 후보 하나를 결정하세요."
      />

      <div className="lh-candidate-grid">
        {candidates.map(
          (
            candidate,
            index,
          ) => (
            <button
              key={
                candidate.code
              }
              type="button"
              className={[
                'lh-candidate-card',
                selected ===
                index
                  ? 'selected'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() =>
                select(index)
              }
            >
              <span>
                {String.fromCharCode(
                  65 + index,
                )}
              </span>

              <small>
                RESEARCH
                CANDIDATE
              </small>

              <strong>
                Candidate{' '}
                {String.fromCharCode(
                  65 + index,
                )}
              </strong>

              <p>
                실제 도킹 점수는
                검증 대기 상태입니다.
              </p>

              <i>
                {selected ===
                index
                  ? 'SELECTED'
                  : 'SELECT'}
              </i>
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className="lh-synthesize"
        disabled={
          selected === null
        }
        onClick={secure}
      >
        <small>
          FINAL RESEARCH
          DECISION
        </small>

        <strong>
          SECURE CANDIDATE
        </strong>

        <span>
          연구 후보 확보 및
          탈출 시작 →
        </span>
      </button>
    </div>
  );
}

function EscapeScreen({
  progress,
  remaining,
}: {
  progress: number;
  remaining: number;
}) {
  return (
    <div className="lh-stage lh-escape-stage">
      <StageTitle
        number="FINAL"
        label="EVACUATION"
        title="연구 후보를 들고 연구소를 탈출하라"
        description="출구까지 이동 중입니다."
      />

      <div className="lh-escape-count">
        <small>
          LOCKDOWN IMMINENT
        </small>

        <strong>
          {remaining}
        </strong>
      </div>

      <div className="lh-escape-map">
        <div className="lh-escape-road" />

        <div
          className="lh-runner"
          style={{
            left: `calc(${Math.min(
              progress,
              92,
            )}% - 20px)`,
          }}
        >
          🧑‍🔬
          <span>
            🧪
          </span>
        </div>

        <div className="lh-lab-building">
          LAB
        </div>

        <div className="lh-exit-gate">
          EXIT
        </div>

        {[
          16,
          34,
          52,
          70,
          86,
        ].map(
          (position) => (
            <i
              key={
                position
              }
              className={
                progress >=
                position
                  ? 'passed'
                  : ''
              }
              style={{
                left: `${position}%`,
              }}
            />
          ),
        )}
      </div>

      <div className="lh-escape-alert">
        치료 후보 확보 완료
        · 출구로 이동 중
      </div>
    </div>
  );
}

function SuccessScreen({
  remaining,
  score,
  correctCount,
  targetName,
  pdbId,
  resetGame,
}: {
  remaining:
    number;

  score:
    number;

  correctCount:
    number;

  targetName:
    string;

  pdbId:
    string;

  resetGame:
    () => void;
}) {
  return (
    <div className="lh-success">
      <div className="lh-success-badge">
        EVACUATION COMPLETE
      </div>

      <h1>
        MISSION
        <br />
        <strong>
          CLEAR
        </strong>
      </h1>

      <h2>
        인류에게 다시
        희망이 생겼습니다.
      </h2>

      <div className="lh-result-grid">
        <ResultBox
          label="TIME LEFT"
          value={formatTime(
            remaining,
          )}
        />

        <ResultBox
          label="FINAL SCORE"
          value={String(
            score,
          )}
        />

        <ResultBox
          label="QUIZ"
          value={`${correctCount}/3`}
        />

        <ResultBox
          label="PDB"
          value={pdbId}
        />
      </div>

      <div className="lh-result-target">
        <small>
          ANALYZED TARGET
        </small>

        <strong>
          {targetName}
        </strong>
      </div>

      <p>
        가상의 재난 시나리오에서
        실제 단백질 구조를
        관찰하고 연구 후보를
        결정했습니다.
      </p>

      <button
        className="lh-big-start"
        onClick={resetGame}
      >
        <span>
          NEXT RESEARCHER
        </span>

        <strong>
          다음 도전자
        </strong>

        <i>→</i>
      </button>
    </div>
  );
}

function FailScreen({
  retry,
  reset,
}: {
  retry:
    () => void;

  reset:
    () => void;
}) {
  return (
    <div className="lh-fail">
      <span>
        ⚠
      </span>

      <small>
        TIME OVER
      </small>

      <h1>
        LAB
        <br />
        OVERRUN
      </h1>

      <p>
        제한시간 안에
        치료 연구 후보를
        확보하지 못했습니다.
      </p>

      <div className="lh-fail-actions">
        <button
          onClick={retry}
          className="lh-big-start"
        >
          <strong>
            RETRY MISSION
          </strong>
        </button>

        <button
          onClick={reset}
          className="lh-secondary"
        >
          처음 화면
        </button>
      </div>
    </div>
  );
}

function CityMap({
  infection,
  stage,
}: {
  infection:
    number;

  stage:
    Stage;
}) {
  const current =
    stageIndex(stage);

  return (
    <aside className="lh-city">
      <div className="lh-city-head">
        <div>
          <small>
            GLOBAL OUTBREAK
            MONITORING
          </small>

          <strong>
            도시 감염 현황
          </strong>
        </div>

        <div className="lh-outbreak">
          <small>
            OUTBREAK LEVEL
          </small>

          <strong>
            {infection}%
          </strong>
        </div>
      </div>

      <div
        className="lh-city-map"
        style={{
          '--infection':
            infection / 100,
        } as React.CSSProperties}
      >
        <div className="lh-city-grid" />

        {[
          {
            x: 14,
            y: 25,
            label: 'CITY HALL',
          },
          {
            x: 66,
            y: 19,
            label: 'HOSPITAL',
          },
          {
            x: 31,
            y: 66,
            label: 'RESIDENTIAL',
          },
          {
            x: 72,
            y: 67,
            label: 'BIO LAB',
          },
        ].map(
          (
            node,
            index,
          ) => (
            <div
              key={
                node.label
              }
              className={[
                'lh-city-node',
                index <=
                current
                  ? 'infected'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
            >
              <i />
              <span>
                {node.label}
              </span>
            </div>
          ),
        )}

        <div
          className="lh-researcher-position"
          style={{
            left: `${
              12 +
              current * 15
            }%`,
          }}
        >
          <span>
            ●
          </span>

          YOU
        </div>

        <svg
          viewBox="0 0 100 100"
          className="lh-city-route"
          preserveAspectRatio="none"
        >
          <path
            d="
              M 13 78
              C 28 72, 30 57, 43 52
              S 61 46, 68 30
              S 80 30, 88 19
            "
          />
        </svg>

        <div className="lh-red-wash" />
      </div>

      <div className="lh-city-status">
        <span>
          ● 감염 확산
        </span>

        <span>
          ◉ 현재 위치
        </span>

        <span>
          ⇢ 탈출 경로
        </span>
      </div>
    </aside>
  );
}

function StageTitle({
  number,
  label,
  title,
  description,
}: {
  number:
    string;

  label:
    string;

  title:
    string;

  description:
    string;
}) {
  return (
    <div className="lh-stage-title">
      <small>
        MISSION {number}
        {' · '}
        {label}
      </small>

      <h1>
        {title}
      </h1>

      <p>
        {description}
      </p>
    </div>
  );
}

function Feedback({
  value,
}: {
  value:
    string;
}) {
  if (!value) {
    return null;
  }

  const wrong =
    value.includes(
      'WRONG',
    ) ||
    value.includes(
      'NOT MATCHED',
    );

  return (
    <div
      className={[
        'lh-feedback',
        wrong
          ? 'wrong'
          : 'correct',
      ].join(' ')}
    >
      {value}
    </div>
  );
}

function ResultBox({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div className="lh-result-box">
      <small>
        {label}
      </small>

      <strong>
        {value}
      </strong>
    </div>
  );
}
