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
  lastHopeQuestions,
  type LastHopeQuestion,
} from '../data/lastHopeQuestions';

import {
  infectionBriefings,
} from '../data/infectionBriefings';

type Stage =
  | 'intro'
  | 'quiz'
  | 'memory'
  | 'match'
  | 'pocket';

const TOTAL = 90;

const PROTEINS: DeepDiveProteinId[] = [
  'sars2-mpro',
  'mers-mpro',
  'h1n1-neuraminidase',
];

const MISSION_LABELS = [
  '감염 도시 진입',
  '단백질 기억',
  '구조 매칭',
  '약점 분석',
  '탈출',
];

function shuffle<T>(items: T[]) {
  return [...items].sort(
    () => Math.random() - 0.5,
  );
}

function formatTime(value: number) {
  const safe = Math.max(0, value);

  return `${String(
    Math.floor(safe / 60),
  ).padStart(2, '0')}:${String(
    safe % 60,
  ).padStart(2, '0')}`;
}

function missionIndex(stage: Stage) {
  if (stage === 'intro') return 0;
  if (stage === 'quiz') return 0;
  if (stage === 'memory') return 1;
  if (stage === 'match') return 2;
  return 3;
}

export default function LastHopeGameV2() {
  const [stage, setStage] =
    useState<Stage>('intro');

  const [targetId, setTargetId] =
    useState<DeepDiveProteinId>(
      'sars2-mpro',
    );

  const [matchOrder, setMatchOrder] =
    useState<DeepDiveProteinId[]>(
      PROTEINS,
    );

  const [startedAt, setStartedAt] =
    useState<number | null>(null);

  const [penalty, setPenalty] =
    useState(0);

  const [remaining, setRemaining] =
    useState(TOTAL);

  const [score, setScore] =
    useState(0);

  const [memoryCount, setMemoryCount] =
    useState(5);

  const [feedback, setFeedback] =
    useState<{
      text: string;
      type: 'good' | 'bad';
    } | null>(null);

  const [quizSet, setQuizSet] =
    useState<LastHopeQuestion[]>([]);

  const [quizIndex, setQuizIndex] =
    useState(0);

  const [quizCorrect, setQuizCorrect] =
    useState(0);

  const [transitionLocked, setTransitionLocked] =
    useState(false);

  const transitionTimerRef =
    useRef<number | null>(null);

  const transitioning =
    useRef(false);

  const target =
    dockingTargets[targetId];

  const running =
    stage !== 'intro';

  const activeMission =
    missionIndex(stage);

  const outbreak = useMemo(() => {
    if (stage === 'intro') {
      return 12;
    }

    const elapsed =
      TOTAL - remaining;

    return Math.min(
      99,
      Math.round(
        12 +
          (elapsed / TOTAL) *
            87,
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
            (
              Date.now() -
              startedAt
            ) / 1000,
          );

        const next =
          TOTAL -
          elapsed -
          penalty;

        setRemaining(
          Math.max(0, next),
        );
      }, 150);

    return () =>
      window.clearInterval(timer);
  }, [
    running,
    startedAt,
    penalty,
  ]);

  useEffect(() => {
    if (
      remaining !== 0 ||
      stage === 'intro'
    ) {
      return;
    }

    setFeedback({
      type: 'bad',
      text:
        'TIME OVER · 연구소 봉쇄',
    });
  }, [
    remaining,
    stage,
  ]);

  useEffect(() => {
    if (stage !== 'memory') {
      return;
    }

    transitioning.current = false;
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
                !transitioning.current
              ) {
                transitioning.current =
                  true;

                window.setTimeout(
                  () => {
                    setFeedback(null);
                    setStage('match');
                  },
                  350,
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

  const startGame = () => {
    const randomTarget =
      PROTEINS[
        Math.floor(
          Math.random() *
            PROTEINS.length,
        )
      ];

    const selectedQuestions =
      shuffle(lastHopeQuestions)
        .slice(0, 10);

    if (
      transitionTimerRef.current !== null
    ) {
      window.clearTimeout(
        transitionTimerRef.current,
      );
    }

    setTargetId(randomTarget);
    setMatchOrder(
      shuffle(PROTEINS),
    );

    setQuizSet(selectedQuestions);
    setQuizIndex(0);
    setQuizCorrect(0);

    setScore(0);
    setPenalty(0);
    setRemaining(TOTAL);
    setFeedback(null);
    setTransitionLocked(false);

    setStartedAt(Date.now());
    setStage('quiz');
  };

  const scheduleStage = (
    nextStage: Stage,
    delay = 850,
  ) => {
    setTransitionLocked(true);

    if (
      transitionTimerRef.current !== null
    ) {
      window.clearTimeout(
        transitionTimerRef.current,
      );
    }

    transitionTimerRef.current =
      window.setTimeout(() => {
        setFeedback(null);
        setTransitionLocked(false);
        setStage(nextStage);
        transitionTimerRef.current = null;
      }, delay);
  };

  const finishQuizQuestion = (
    wasCorrect: boolean,
  ) => {
    const projectedCorrect =
      quizCorrect +
      (wasCorrect ? 1 : 0);

    if (
      quizIndex <
      quizSet.length - 1
    ) {
      setTransitionLocked(true);

      transitionTimerRef.current =
        window.setTimeout(() => {
          setQuizIndex(
            (current) =>
              current + 1,
          );

          setFeedback(null);
          setTransitionLocked(false);
          transitionTimerRef.current = null;
        }, 700);

      return;
    }

    if (
      projectedCorrect >= 7
    ) {
      setFeedback({
        type: 'good',
        text:
          `SECURITY CLEARED · ${projectedCorrect}/10 · 구조 분석실 개방`,
      });

      scheduleStage(
        'memory',
        1200,
      );

      return;
    }

    setFeedback({
      type: 'bad',
      text:
        `SECURITY FAILED · ${projectedCorrect}/10 · 최소 7개 정답 필요`,
    });

    setTransitionLocked(true);

    transitionTimerRef.current =
      window.setTimeout(() => {
        setQuizIndex(0);
        setQuizCorrect(0);
        setQuizSet(
          shuffle(
            lastHopeQuestions,
          ).slice(0, 10),
        );

        setFeedback(null);
        setTransitionLocked(false);
        transitionTimerRef.current = null;
      }, 1800);
  };

  const answerOX = (
    value: string | number,
  ) => {
    if (
      feedback ||
      transitionLocked
    ) {
      return;
    }

    const question =
      quizSet[quizIndex];

    if (!question) {
      return;
    }

    let correct = false;

    if (
      question.type === 'ox'
    ) {
      correct =
        value ===
        question.answer;
    } else {
      correct =
        value ===
        question.answer;
    }

    if (correct) {
      setScore(
        (current) =>
          current + 100,
      );

      setQuizCorrect(
        (current) =>
          current + 1,
      );

      setFeedback({
        type: 'good',
        text:
          `정답 · +100 SCORE · ${question.explanation}`,
      });

      finishQuizQuestion(true);
      return;
    }

    setFeedback({
      type: 'bad',
      text:
        `오답 · -3 SEC · ${question.explanation}`,
    });

    setPenalty(
      (current) =>
        current + 3,
    );

    finishQuizQuestion(false);
  };

  const answerMatch = (
    id: DeepDiveProteinId,
  ) => {
    if (
      feedback ||
      transitionLocked
    ) {
      return;
    }

    if (id === targetId) {
      setScore(
        (current) =>
          current + 200,
      );

      setFeedback({
        type: 'good',
        text:
          'TARGET MATCHED · +200 SCORE',
      });

      scheduleStage(
        'pocket',
        1300,
      );

      return;
    }

    setPenalty(
      (current) =>
        current + 7,
    );

    setFeedback({
      type: 'bad',
      text:
        'WRONG SAMPLE · -7 SEC',
    });

    setTransitionLocked(true);

    transitionTimerRef.current =
      window.setTimeout(() => {
        setFeedback(null);
        setTransitionLocked(false);
        transitionTimerRef.current = null;
      }, 1100);
  };

  return (
    <div
      className={[
        'lh2',
        danger
          ? 'lh2-danger'
          : '',
        critical
          ? 'lh2-critical'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="lh2-brandbar">
        <div>
          <small>
            PAEJAE UNIVERSITY
          </small>

          <strong>
            Bio<span>Dock</span>Lab
          </strong>
        </div>

        <div className="lh2-brandcopy">
          AI로 여는 생명의
          무한한 가능성
          <span>
            From Cells to Cures
          </span>
        </div>

        <div className="lh2-brandmotto">
          EXPLORE · SIMULATE ·
          DISCOVER · TOGETHER
        </div>
      </header>

      {stage !== 'intro' && (
        <>
          <section className="lh2-hud">
            <div className="lh2-time">
              <span className="lh2-hud-icon">
                ◷
              </span>

              <div>
                <small>
                  남은 시간
                </small>

                <strong>
                  {formatTime(
                    remaining,
                  )}
                </strong>
              </div>
            </div>

            <div className="lh2-outbreak-hud">
              <span>
                ☣
              </span>

              <div>
                <small>
                  감염 확산도
                </small>

                <strong>
                  {outbreak}%
                </strong>
              </div>

              <i>
                <b
                  style={{
                    width:
                      `${outbreak}%`,
                  }}
                />
              </i>
            </div>

            <div className="lh2-score">
              <span>
                ♜
              </span>

              <div>
                <small>
                  현재 점수
                </small>

                <strong>
                  {String(
                    score,
                  ).padStart(
                    4,
                    '0',
                  )}
                </strong>
              </div>
            </div>

            <div className="lh2-mission-route">
              {MISSION_LABELS.map(
                (
                  label,
                  index,
                ) => (
                  <div
                    key={
                      label
                    }
                    className={[
                      index ===
                      activeMission
                        ? 'current'
                        : '',
                      index <
                      activeMission
                        ? 'done'
                        : '',
                    ]
                      .filter(
                        Boolean,
                      )
                      .join(' ')}
                  >
                    <b>
                      {index + 1}
                    </b>

                    <span>
                      {label}
                    </span>
                  </div>
                ),
              )}
            </div>
          </section>

          <div className="lh2-timebar">
            <i
              style={{
                width:
                  `${
                    (
                      remaining /
                      TOTAL
                    ) *
                    100
                  }%`,
              }}
            />
          </div>
        </>
      )}

      {stage === 'intro' ? (
        <Intro
          start={
            startGame
          }
        />
      ) : (
        <main className="lh2-grid">
          <section className="lh2-game">
            {stage ===
              'quiz' && (
              <MissionOne
                question={
                  quizSet[quizIndex]
                }
                index={
                  quizIndex
                }
                total={
                  quizSet.length
                }
                correct={
                  quizCorrect
                }
                answer={
                  answerOX
                }
                feedback={
                  feedback
                }
                locked={
                  transitionLocked
                }
              />
            )}

            {stage ===
              'memory' && (
              <MissionTwo
                target={
                  target
                }
                count={
                  memoryCount
                }
              />
            )}

            {stage ===
              'match' && (
              <MissionThree
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

            {stage ===
              'pocket' && (
              <ComingNext />
            )}
          </section>

          <CityMap
            outbreak={
              outbreak
            }
            mission={
              activeMission
            }
          />
        </main>
      )}

      <footer className="lh2-footer">
        ZVX-26은 가상의
        바이러스입니다 · 실제 공개
        PDB 구조를 활용한 교육용
        시나리오입니다.
      </footer>
    </div>
  );
}

function Intro({
  start,
}: {
  start: () => void;
}) {
  return (
    <main className="lh2-intro lh2-briefing-screen">
      <section className="lh2-briefing-main">
        <div className="lh2-alert">
          <i />
          BIODOCKLAB · LAST HOPE
        </div>

        <div className="lh2-briefing-heading">
          <small>
            MISSION 00 · 감염병 도감
          </small>

          <h1>
            ZVX-26
            <br />
            <strong>
              미션 브리핑
            </strong>
          </h1>

          <p>
            도시가 정체불명의 가상 좀비 바이러스
            <b> ZVX-26</b>로 인해 혼란에 빠졌습니다.
          </p>

          <p>
            ZVX-26은 실제로 존재하지 않는
            가상의 바이러스입니다.
            하지만 이번 미션에서는
            실제 감염병과 단백질 구조 데이터를
            단서로 활용합니다.
          </p>

          <strong className="lh2-briefing-callout">
            실제 바이러스 사례를 살펴보고,
            구조생물학 단서를 기억한 뒤
            미션을 시작하세요.
          </strong>
        </div>

        <div className="lh2-virus-atlas-title">
          <div>
            <small>
              INFECTIOUS DISEASE ARCHIVE
            </small>

            <strong>
              감염병 도감 · 미션 핵심 정보
            </strong>
          </div>

          <span>
            아래 정보가 랜덤 퀴즈에 출제됩니다
          </span>
        </div>

        <div className="lh2-virus-atlas lh2-disease-atlas">
          {infectionBriefings.map((item) => (
            <article
              key={item.id}
              className={`lh2-disease-card ${item.accent}`}
            >
              <div
                className={`lh2-virus-orb ${item.accent}`}
              >
                {item.pathogenType === 'bacteria'
                  ? '◉'
                  : '☣'}
              </div>

              <div className="lh2-disease-head">
                <small>
                  {item.pathogenType === 'virus'
                    ? 'VIRUS'
                    : 'BACTERIA'}
                </small>

                <span>
                  {item.tag}
                </span>
              </div>

              <h3>
                {item.name}
              </h3>

              <b className="lh2-pathogen-name">
                {item.pathogen}
              </b>

              <p>
                {item.summary}
              </p>

              <div className="lh2-transmission">
                <small>
                  전파
                </small>

                <span>
                  {item.transmission}
                </span>
              </div>

              <div className="lh2-disease-clue">
                <b>
                  QUIZ HINT
                </b>

                <span>
                  {item.clue}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="lh2-protein-clue">
          <div className="lh2-protein-clue-graphic">
            <span>
              ∿
            </span>

            <i />
            <i />
            <i />
          </div>

          <div>
            <small>
              핵심 단서
            </small>

            <strong>
              단백질 구조 = 기능을 이해하는 지도
            </strong>

            <p>
              단백질의 입체 구조를 살펴보면
              다른 분자가 상호작용할 수 있는 공간과
              결합 부위를 탐색할 수 있습니다.
            </p>
          </div>

          <div className="lh2-briefing-rule">
            <b>
              90 SEC
            </b>

            <span>
              미션 시작 후
              타이머 작동
            </span>
          </div>
        </div>

        <button
          type="button"
          className="lh2-start lh2-briefing-start"
          onClick={start}
        >
          <span>
            ▶
          </span>

          <div>
            <small>
              BRIEFING COMPLETE
            </small>

            <strong>
              브리핑 완료 · 미션 시작
            </strong>
          </div>

          <b>
            01:30 →
          </b>
        </button>

        <div className="lh2-before-start-note">
          브리핑 화면에서는 제한시간이 흐르지 않습니다.
          버튼을 누르는 순간 90초 카운트다운이 시작됩니다.
        </div>
      </section>

      <section className="lh2-intro-map lh2-briefing-map">
        <div className="lh2-map-alert">
          <div>
            <small>
              ZVX-26
            </small>

            <strong>
              감염 확산 초기 단계
            </strong>

            <span>
              도시 일부에서 감염이 시작되었습니다.
            </span>
          </div>

          <b>
            12%
          </b>
        </div>

        <CityVisual
          outbreak={12}
          mission={0}
        />

        <div className="lh2-map-mission">
          <small>
            YOUR OBJECTIVE
          </small>

          <strong>
            제한시간 안에
            치료 연구 후보를 확보하고
            연구소를 탈출하세요.
          </strong>
        </div>
      </section>
    </main>
  );
}


function MissionOne({
  question,
  index,
  total,
  correct,
  answer,
  feedback,
  locked,
}: {
  question:
    LastHopeQuestion | undefined;

  index:
    number;

  total:
    number;

  correct:
    number;

  answer: (
    value: string | number,
  ) => void;

  feedback:
    | {
        text: string;
        type: 'good' | 'bad';
      }
    | null;

  locked:
    boolean;
}) {
  if (!question) {
    return (
      <div className="lh2-stage">
        문제 준비 중...
      </div>
    );
  }

  return (
    <div className="lh2-stage">
      <StageHead
        mission="MISSION 01"
        label="BIO SECURITY QUIZ"
        title="연구소 보안을 해제하라"
        desc={`문제 ${index + 1} / ${total} · 7개 이상 정답 시 보안 해제`}
      />

      <div className="lh2-question-progress">
        <span>
          QUESTION {index + 1}
        </span>

        <div>
          {Array.from({
            length: total,
          }).map((_, i) => (
            <i
              key={i}
              className={
                i <= index
                  ? 'active'
                  : ''
              }
            />
          ))}
        </div>

        <div className="lh2-quiz-score">
          <span>
            정답 {correct}/10
          </span>

          <b>
            PASS 7
          </b>
        </div>
      </div>

      <div className="lh2-briefing-card">
        <small>
          MISSION BRIEFING
        </small>

        <strong>
          {question.briefing}
        </strong>
      </div>

      <div className="lh2-question lh2-question-v3">
        <div className="lh2-virus-symbol">
          ☣
        </div>

        <div>
          <small>
            SECURITY QUESTION
          </small>

          <span>
            Q{index + 1}.
          </span>

          <h2>
            {question.question}
          </h2>
        </div>
      </div>

      {question.type === 'ox' ? (
        <div className="lh2-ox">
          <button
            disabled={locked}
            className="o"
            onClick={() =>
              answer('O')
            }
          >
            <strong>
              O
            </strong>

            <span>
              맞다
            </span>
          </button>

          <button
            disabled={locked}
            className="x"
            onClick={() =>
              answer('X')
            }
          >
            <strong>
              X
            </strong>

            <span>
              아니다
            </span>
          </button>
        </div>
      ) : (
        <div className="lh2-choice-grid">
          {(question.options ?? []).map(
            (option, optionIndex) => (
              <button
                key={option}
                disabled={locked}
                onClick={() =>
                  answer(optionIndex)
                }
              >
                <b>
                  {String.fromCharCode(
                    65 + optionIndex,
                  )}
                </b>

                <span>
                  {option}
                </span>
              </button>
            ),
          )}
        </div>
      )}

      <div className="lh2-rule">
        <span>
          정답 +100
        </span>

        <span>
          오답 -5 SEC
        </span>

        <b>
          매 플레이마다 문제가 바뀝니다
        </b>
      </div>

      <GameFeedback
        value={feedback}
      />
    </div>
  );
}


function MissionTwo({
  target,
  count,
}: {
  target:
    (typeof dockingTargets)[DeepDiveProteinId];

  count:
    number;
}) {
  return (
    <div className="lh2-stage">
      <StageHead
        mission="MISSION 02"
        label="단백질 기억"
        title="이 구조를 기억하라"
        desc="5초 뒤, 같은 구조를 감염 샘플에서 찾아야 합니다."
      />

      <div className="lh2-memory">
        <div className="lh2-memory-view">
          <Protein3DViewer
            target={
              target
            }
          />

          <div className="lh2-target-id">
            <small>
              TARGET PROTEIN
            </small>

            <strong>
              {
                target
                  .proteinName
              }
            </strong>

            <span>
              PDB{' '}
              {
                target
                  .pdbId
              }
            </span>
          </div>

          <div className="lh2-scan-ring" />
        </div>

        <div className="lh2-memory-timer">
          <small>
            MEMORIZE
          </small>

          <strong>
            {count}
          </strong>

          <span>
            전체적인 모양을
            기억하세요
          </span>

          <i>
            잠시 후 구조가
            사라집니다
          </i>
        </div>
      </div>
    </div>
  );
}

function MissionThree({
  order,
  answer,
  feedback,
}: {
  order:
    DeepDiveProteinId[];

  answer: (
    id:
      DeepDiveProteinId,
  ) => void;

  feedback:
    | {
        text:
          string;

        type:
          'good'
          | 'bad';
      }
    | null;
}) {
  return (
    <div className="lh2-stage">
      <StageHead
        mission="MISSION 03"
        label="STRUCTURE MATCH"
        title="방금 본 단백질을 찾아라"
        desc="기억한 구조와 같은 단백질 하나를 선택하세요."
      />

      <div className="lh2-match">
        {order.map(
          (
            id,
            index,
          ) => {
            const target =
              dockingTargets[
                id
              ];

            return (
              <button
                key={id}
                onClick={() =>
                  answer(id)
                }
              >
                <b>
                  {String.fromCharCode(
                    65 +
                      index,
                  )}
                </b>

                <div>
                  <Protein3DViewer
                    target={
                      target
                    }
                    compact
                  />
                </div>

                <span>
                  PROTEIN SAMPLE{' '}
                  {String.fromCharCode(
                    65 +
                      index,
                  )}
                </span>
              </button>
            );
          },
        )}
      </div>

      <div className="lh2-match-rule">
        <span>
          정답 +200 SCORE
        </span>

        <span>
          오답 -7 SEC
        </span>
      </div>

      <GameFeedback
        value={
          feedback
        }
      />
    </div>
  );
}

function ComingNext() {
  return (
    <div className="lh2-stage lh2-coming">
      <small>
        MISSION 04
      </small>

      <h1>
        TARGET MATCHED
      </h1>

      <p>
        다음 개발 단계:
        실제 결합 부위 찾기
      </p>
    </div>
  );
}

function StageHead({
  mission,
  label,
  title,
  desc,
}: {
  mission:
    string;

  label:
    string;

  title:
    string;

  desc:
    string;
}) {
  return (
    <header className="lh2-stagehead">
      <div>
        <small>
          {mission}
          {' · '}
          {label}
        </small>

        <h1>
          {title}
        </h1>

        <p>
          {desc}
        </p>
      </div>

      <span>
        BIO EMERGENCY
        MISSION
      </span>
    </header>
  );
}

function GameFeedback({
  value,
}: {
  value:
    | {
        text:
          string;

        type:
          'good'
          | 'bad';
      }
    | null;
}) {
  if (!value) {
    return null;
  }

  return (
    <div
      className={
        `lh2-feedback ${
          value.type
        }`
      }
    >
      {value.text}
    </div>
  );
}

function CityMap({
  outbreak,
  mission,
}: {
  outbreak:
    number;

  mission:
    number;
}) {
  return (
    <aside className="lh2-city">
      <header>
        <div>
          <small>
            GLOBAL OUTBREAK
            MONITORING
          </small>

          <strong>
            도시 감염 현황
          </strong>
        </div>

        <div className="lh2-city-outbreak">
          <small>
            OUTBREAK LEVEL
          </small>

          <strong>
            {outbreak}%
          </strong>
        </div>
      </header>

      <CityVisual
        outbreak={
          outbreak
        }
        mission={
          mission
        }
      />

      <footer>
        <span>
          ● 감염 지역
        </span>

        <span>
          ··· 이동 경로
        </span>

        <span>
          ◉ 현재 위치
        </span>
      </footer>
    </aside>
  );
}

function CityVisual({
  outbreak,
  mission,
}: {
  outbreak:
    number;

  mission:
    number;
}) {
  const locations = [
    {
      x: 16,
      y: 73,
      text: '연구실',
    },
    {
      x: 38,
      y: 60,
      text: '분석실',
    },
    {
      x: 61,
      y: 47,
      text: '약물 보관실',
    },
    {
      x: 80,
      y: 29,
      text: '출구',
    },
  ];

  return (
    <div
      className="lh2-cityvisual"
      style={
        {
          '--infection':
            outbreak /
            100,
        } as React.CSSProperties
      }
    >
      <div className="lh2-cityblocks" />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="lh2-path"
      >
        <path
          d="
            M 17 76
            C 29 70 29 62 39 60
            S 52 54 61 47
            S 71 36 80 29
          "
        />
      </svg>

      {locations.map(
        (
          item,
          index,
        ) => (
          <div
            key={
              item.text
            }
            className={[
              'lh2-location',
              index <=
              Math.min(
                mission,
                3,
              )
                ? 'active'
                : '',
              index ===
              Math.min(
                mission,
                3,
              )
                ? 'current'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{
              left:
                `${item.x}%`,
              top:
                `${item.y}%`,
            }}
          >
            <i>
              {index === 0
                ? '⌂'
                : index === 1
                ? '⚗'
                : index === 2
                ? '◒'
                : '↗'}
            </i>

            <span>
              {
                item.text
              }
            </span>
          </div>
        ),
      )}

      <div
        className="lh2-you"
        style={{
          left:
            `${
              locations[
                Math.min(
                  mission,
                  3,
                )
              ].x
            }%`,
          top:
            `${
              locations[
                Math.min(
                  mission,
                  3,
                )
              ].y -
              11
            }%`,
        }}
      >
        🧑‍🔬
        <span>
          YOU
        </span>
      </div>

      <div className="lh2-infection-layer" />
    </div>
  );
}
