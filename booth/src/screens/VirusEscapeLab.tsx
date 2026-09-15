import {
  useEffect,
  useMemo,
  useState,
  type DragEvent,
} from 'react';

import { Protein3DViewer } from '../components/Protein3DViewer';

import {
  dockingTargetByProteinId,
  type DeepDiveProteinId,
} from '../data/dockingTargets';

import {
  dockingResultByProteinId,
} from '../data/dockingResults';

type Stage =
  | 'start'
  | 'target'
  | 'protein'
  | 'pocket'
  | 'dock'
  | 'decision'
  | 'success'
  | 'fail';

const TOTAL_TIME = 90;

const targets = [
  {
    id: 'sars2-mpro' as DeepDiveProteinId,
    label: 'COVID-19',
    clue: '코로나바이러스 계열',
  },
  {
    id: 'mers-mpro' as DeepDiveProteinId,
    label: 'MERS',
    clue: '중동호흡기증후군',
  },
  {
    id: 'h1n1-neuraminidase' as DeepDiveProteinId,
    label: 'H1N1',
    clue: '인플루엔자 A',
  },
];

function formatTime(value: number) {
  const safe = Math.max(0, value);
  const mm = String(Math.floor(safe / 60)).padStart(2, '0');
  const ss = String(safe % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function getStageLabel(stage: Stage) {
  switch (stage) {
    case 'target':
      return 'IDENTIFY';
    case 'protein':
      return 'ANALYZE';
    case 'pocket':
      return 'FIND';
    case 'dock':
      return 'DOCK';
    case 'decision':
      return 'DECIDE';
    case 'success':
      return 'UNLOCKED';
    case 'fail':
      return 'LOCKED';
    default:
      return 'READY';
  }
}

export default function VirusEscapeLab() {
  const [stage, setStage] =
    useState<Stage>('start');

  const [selectedProteinId, setSelectedProteinId] =
    useState<DeepDiveProteinId>('sars2-mpro');

  const [remaining, setRemaining] =
    useState(TOTAL_TIME);

  const [startedAt, setStartedAt] =
    useState<number | null>(null);

  const [wrongPenalty, setWrongPenalty] =
    useState(0);

  const [pocketChoice, setPocketChoice] =
    useState<number | null>(null);

  const [pocketFound, setPocketFound] =
    useState(false);

  const [loadedCandidate, setLoadedCandidate] =
    useState<number | null>(null);

  const [triedCandidates, setTriedCandidates] =
    useState<number[]>([]);

  const [selectedCandidate, setSelectedCandidate] =
    useState<number | null>(null);

  const [score, setScore] =
    useState(0);

  const target =
    dockingTargetByProteinId(selectedProteinId);

  const dockingResult =
    dockingResultByProteinId(selectedProteinId);

  const candidates =
    dockingResult?.candidates ?? [];

  const missionRunning =
    stage !== 'start' &&
    stage !== 'success' &&
    stage !== 'fail';

  useEffect(() => {
    if (!missionRunning || !startedAt) {
      return;
    }

    const timer = window.setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - startedAt) / 1000
      );

      const next =
        TOTAL_TIME -
        elapsed -
        wrongPenalty;

      if (next <= 0) {
        setRemaining(0);
        setStage('fail');
        return;
      }

      setRemaining(next);
    }, 200);

    return () =>
      window.clearInterval(timer);
  }, [
    missionRunning,
    startedAt,
    wrongPenalty,
  ]);

  const danger =
    remaining <= 30;

  const critical =
    remaining <= 15;

  const progress =
    Math.max(
      0,
      Math.min(
        100,
        (remaining / TOTAL_TIME) * 100,
      ),
    );

  const stageProgress = useMemo(() => {
    const map: Record<Stage, number> = {
      start: 0,
      target: 15,
      protein: 35,
      pocket: 55,
      dock: 75,
      decision: 90,
      success: 100,
      fail: 0,
    };

    return map[stage];
  }, [stage]);

  const startMission = () => {
    setStage('target');
    setStartedAt(Date.now());
    setRemaining(TOTAL_TIME);
    setWrongPenalty(0);
    setPocketChoice(null);
    setPocketFound(false);
    setLoadedCandidate(null);
    setTriedCandidates([]);
    setSelectedCandidate(null);
    setScore(0);
  };

  const resetMission = () => {
    setStage('start');
    setStartedAt(null);
    setRemaining(TOTAL_TIME);
    setWrongPenalty(0);
    setPocketChoice(null);
    setPocketFound(false);
    setLoadedCandidate(null);
    setTriedCandidates([]);
    setSelectedCandidate(null);
    setScore(0);
  };

  const chooseTarget = (
    proteinId: DeepDiveProteinId,
  ) => {
    setSelectedProteinId(proteinId);
    setScore((current) => current + 100);
    setStage('protein');
  };

  const choosePocket = (
    index: number,
  ) => {
    setPocketChoice(index);

    if (index === 1) {
      setPocketFound(true);
      setScore((current) => current + 250);

      window.setTimeout(() => {
        setStage('dock');
      }, 850);
    } else {
      setWrongPenalty(
        (current) => current + 5,
      );
    }
  };

  const loadCandidate = (
    index: number,
  ) => {
    setLoadedCandidate(index);

    setTriedCandidates((current) =>
      current.includes(index)
        ? current
        : [...current, index]
    );

    setScore((current) =>
      current + 80
    );
  };

  const handleDragStart = (
    event: DragEvent,
    index: number,
  ) => {
    event.dataTransfer.setData(
      'text/plain',
      String(index),
    );
  };

  const handleDrop = (
    event: DragEvent,
  ) => {
    event.preventDefault();

    const value = Number(
      event.dataTransfer.getData(
        'text/plain',
      ),
    );

    if (
      Number.isInteger(value) &&
      value >= 0 &&
      value < candidates.length
    ) {
      loadCandidate(value);
    }
  };

  const lockDecision = () => {
    if (selectedCandidate === null) {
      return;
    }

    setScore((current) =>
      current +
      300 +
      remaining * 5 +
      triedCandidates.length * 50
    );

    setStage('success');
  };

  return (
    <div
      className={[
        'vr-lab',
        danger ? 'danger' : '',
        critical ? 'critical' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="vr-header">
        <div>
          <small>
            PAEJAE UNIVERSITY
          </small>

          <h1>
            BioDockLab
          </h1>

          <span>
            VIRUS RESPONSE LAB
          </span>
        </div>

        <div className="vr-header-status">
          <span>
            LAB STATUS
          </span>

          <strong>
            {stage === 'success'
              ? 'UNLOCKED'
              : stage === 'start'
              ? 'STANDBY'
              : 'LOCKDOWN'}
          </strong>
        </div>
      </header>

      {missionRunning && (
        <div className="vr-hud">
          <div className="vr-hud-stage">
            <small>
              CURRENT STAGE
            </small>

            <strong>
              {getStageLabel(stage)}
            </strong>
          </div>

          <div className="vr-hud-timer">
            <small>
              TIME REMAINING
            </small>

            <strong>
              {formatTime(remaining)}
            </strong>
          </div>

          <div className="vr-hud-score">
            <small>
              SCORE
            </small>

            <strong>
              {score}
            </strong>
          </div>
        </div>
      )}

      {missionRunning && (
        <div className="vr-progress">
          <div
            className="vr-progress-time"
            style={{
              width: `${progress}%`,
            }}
          />

          <div
            className="vr-progress-stage"
            style={{
              width: `${stageProgress}%`,
            }}
          />
        </div>
      )}

      <main className="vr-main">
        {stage === 'start' && (
          <section className="vr-start">
            <div className="vr-warning">
              <span />
              EMERGENCY LOCKDOWN
            </div>

            <div className="vr-start-grid">
              <div>
                <p className="vr-kicker">
                  BIO LAB ESCAPE MISSION
                </p>

                <h2>
                  연구소 자동 잠금까지
                  <strong> 90초</strong>
                </h2>

                <h3>
                  감염원을 분석하고
                  <br />
                  연구소를 탈출하라.
                </h3>

                <p>
                  실제 공개 단백질 구조를
                  직접 조작하고,
                  결합 부위를 찾고,
                  후보물질을 비교해
                  최종 연구 결정을 내려보세요.
                </p>
              </div>

              <div className="vr-start-timer">
                <small>
                  LOCKDOWN TIMER
                </small>

                <strong>
                  01:30
                </strong>

                <span>
                  실패하면 연구소가 잠깁니다.
                </span>
              </div>
            </div>

            <div className="vr-start-steps">
              <div>
                <span>01</span>
                TARGET
              </div>

              <div>
                <span>02</span>
                ANALYZE
              </div>

              <div>
                <span>03</span>
                FIND
              </div>

              <div>
                <span>04</span>
                DOCK
              </div>

              <div>
                <span>05</span>
                ESCAPE
              </div>
            </div>

            <button
              className="vr-primary vr-start-btn"
              onClick={startMission}
            >
              EMERGENCY START
              <span>
                90초 미션 시작 →
              </span>
            </button>
          </section>
        )}

        {stage === 'target' && (
          <section className="vr-stage">
            <div className="vr-stage-title">
              <small>
                STAGE 01 · IDENTIFY
              </small>

              <h2>
                감염원을 선택하라
              </h2>

              <p>
                분석할 바이러스 샘플을
                하나 선택하세요.
              </p>
            </div>

            <div className="vr-target-grid">
              {targets.map((item) => (
                <button
                  key={item.id}
                  className="vr-target-card"
                  onClick={() =>
                    chooseTarget(item.id)
                  }
                >
                  <div className="vr-virus-orb">
                    ◉
                  </div>

                  <small>
                    VIRUS SAMPLE
                  </small>

                  <strong>
                    {item.label}
                  </strong>

                  <span>
                    {item.clue}
                  </span>

                  <i>
                    ANALYZE →
                  </i>
                </button>
              ))}
            </div>
          </section>
        )}

        {stage === 'protein' &&
          target && (
            <section className="vr-stage">
              <div className="vr-stage-title">
                <small>
                  STAGE 02 · ANALYZE
                </small>

                <h2>
                  실제 단백질 구조를
                  분석하라
                </h2>

                <p>
                  직접 회전하고 확대해서
                  구조를 확인하세요.
                </p>
              </div>

              <div className="vr-protein-layout">
                <div className="vr-protein-view">
                  <div className="vr-protein-meta">
                    <div>
                      <small>
                        TARGET
                      </small>

                      <strong>
                        {target.proteinName}
                      </strong>
                    </div>

                    <div>
                      <small>
                        STRUCTURE
                      </small>

                      <strong>
                        PDB {target.pdbId}
                      </strong>
                    </div>
                  </div>

                  <Protein3DViewer
                    target={target}
                  />
                </div>

                <div className="vr-side-panel">
                  <small>
                    TASK
                  </small>

                  <h3>
                    단백질을 직접
                    움직여보세요.
                  </h3>

                  <div className="vr-task-item">
                    ✓ 회전하기
                  </div>

                  <div className="vr-task-item">
                    ✓ 확대하기
                  </div>

                  <div className="vr-task-item">
                    ✓ 구조 살펴보기
                  </div>

                  <button
                    className="vr-primary"
                    onClick={() =>
                      setStage('pocket')
                    }
                  >
                    결합 부위 찾기 →
                  </button>
                </div>
              </div>
            </section>
          )}

        {stage === 'pocket' &&
          target && (
            <section className="vr-stage">
              <div className="vr-stage-title">
                <small>
                  STAGE 03 · FIND
                </small>

                <h2>
                  결합 부위를 찾아라
                </h2>

                <p>
                  세 위치 중 후보 분자가
                  들어갈 수 있는 공간을 선택하세요.
                </p>
              </div>

              <div className="vr-pocket-layout">
                <div className="vr-protein-view vr-pocket-view">
                  <Protein3DViewer
                    target={target}
                  />

                  {[0, 1, 2].map(
                    (index) => (
                      <button
                        key={index}
                        className={[
                          'vr-pocket-point',
                          `point-${index}`,
                          pocketChoice ===
                          index
                            ? 'chosen'
                            : '',
                          pocketFound &&
                          index === 1
                            ? 'correct'
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() =>
                          choosePocket(index)
                        }
                      >
                        {String.fromCharCode(
                          65 + index,
                        )}
                      </button>
                    ),
                  )}
                </div>

                <div className="vr-side-panel">
                  <small>
                    FIND THE POCKET
                  </small>

                  <h3>
                    A / B / C 중
                    하나를 선택하세요.
                  </h3>

                  {pocketChoice === null && (
                    <div className="vr-message">
                      위치를 선택하세요.
                    </div>
                  )}

                  {pocketChoice !== null &&
                    !pocketFound && (
                      <div className="vr-message wrong">
                        ACCESS DENIED
                        <strong>
                          -5 SEC
                        </strong>
                      </div>
                    )}

                  {pocketFound && (
                    <div className="vr-message success">
                      BINDING POCKET FOUND
                      <strong>
                        +250
                      </strong>
                    </div>
                  )}

                  <div className="vr-reference">
                    실제 공개 구조의
                    기준 리간드 위치를
                    참고한 교육용 퍼즐입니다.
                  </div>
                </div>
              </div>
            </section>
          )}

        {stage === 'dock' &&
          target && (
            <section className="vr-stage">
              <div className="vr-stage-title">
                <small>
                  STAGE 04 · DOCK
                </small>

                <h2>
                  후보물질을 투입하라
                </h2>

                <p>
                  A / B / C를 직접
                  포켓에 넣어 비교하세요.
                </p>
              </div>

              <div className="vr-dock-layout">
                <div
                  className="vr-protein-view vr-drop-zone"
                  onDragOver={(event) =>
                    event.preventDefault()
                  }
                  onDrop={handleDrop}
                >
                  <Protein3DViewer
                    target={target}
                  />

                  <div className="vr-drop-target">
                    <span>
                      DROP HERE
                    </span>

                    <strong>
                      BINDING POCKET
                    </strong>
                  </div>

                  {loadedCandidate !== null && (
                    <div className="vr-loaded">
                      <small>
                        CANDIDATE LOADED
                      </small>

                      <strong>
                        {
                          candidates[
                            loadedCandidate
                          ]?.name
                        }
                      </strong>

                      <span>
                        비교 완료
                      </span>
                    </div>
                  )}
                </div>

                <div className="vr-candidate-bank">
                  <div className="vr-bank-head">
                    <small>
                      CANDIDATE BANK
                    </small>

                    <strong>
                      {
                        triedCandidates.length
                      }
                      /3
                    </strong>
                  </div>

                  {candidates.map(
                    (candidate, index) => (
                      <div
                        key={candidate.code}
                        className={[
                          'vr-candidate',
                          triedCandidates.includes(
                            index,
                          )
                            ? 'tried'
                            : '',
                          loadedCandidate ===
                          index
                            ? 'loaded'
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        draggable
                        onDragStart={(
                          event,
                        ) =>
                          handleDragStart(
                            event,
                            index,
                          )
                        }
                        onClick={() =>
                          loadCandidate(index)
                        }
                      >
                        <span>
                          {String.fromCharCode(
                            65 + index,
                          )}
                        </span>

                        <div>
                          <small>
                            CANDIDATE
                          </small>

                          <strong>
                            {candidate.name}
                          </strong>
                        </div>

                        <i>
                          {triedCandidates.includes(
                            index,
                          )
                            ? '✓'
                            : '⋮⋮'}
                        </i>
                      </div>
                    ),
                  )}

                  <button
                    className="vr-primary"
                    onClick={() =>
                      setStage(
                        'decision',
                      )
                    }
                    disabled={
                      triedCandidates.length ===
                      0
                    }
                  >
                    최종 결정으로 →
                  </button>
                </div>
              </div>
            </section>
          )}

        {stage === 'decision' && (
          <section className="vr-stage vr-decision-stage">
            <div className="vr-stage-title">
              <small>
                FINAL STAGE
              </small>

              <h2>
                FINAL DECISION REQUIRED
              </h2>

              <p>
                다음 연구로 보낼 후보를
                선택하고 연구소 잠금을 해제하세요.
              </p>
            </div>

            <div className="vr-decision-grid">
              {candidates.map(
                (candidate, index) => (
                  <button
                    key={candidate.code}
                    className={[
                      'vr-decision-card',
                      selectedCandidate ===
                      index
                        ? 'selected'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() =>
                      setSelectedCandidate(
                        index,
                      )
                    }
                  >
                    <small>
                      CANDIDATE
                    </small>

                    <strong>
                      {String.fromCharCode(
                        65 + index,
                      )}
                    </strong>

                    <span>
                      {candidate.name}
                    </span>
                  </button>
                ),
              )}
            </div>

            <button
              className="vr-unlock"
              disabled={
                selectedCandidate ===
                null
              }
              onClick={lockDecision}
            >
              <small>
                FINAL CONTROL
              </small>

              <strong>
                UNLOCK LAB
              </strong>

              <span>
                연구 결정 확정
              </span>
            </button>
          </section>
        )}

        {stage === 'success' && (
          <section className="vr-result success">
            <div className="vr-result-icon">
              🔓
            </div>

            <small>
              LAB STATUS
            </small>

            <h2>
              LAB UNLOCKED
            </h2>

            <h3>
              MISSION COMPLETE
            </h3>

            <div className="vr-result-grid">
              <div>
                <small>
                  TIME LEFT
                </small>

                <strong>
                  {formatTime(
                    remaining,
                  )}
                </strong>
              </div>

              <div>
                <small>
                  SCORE
                </small>

                <strong>
                  {score}
                </strong>
              </div>

              <div>
                <small>
                  TARGET
                </small>

                <strong>
                  {target?.disease}
                </strong>
              </div>

              <div>
                <small>
                  CHOICE
                </small>

                <strong>
                  {selectedCandidate !==
                  null
                    ? `Candidate ${String.fromCharCode(
                        65 +
                          selectedCandidate,
                      )}`
                    : '-'}
                </strong>
              </div>
            </div>

            <p>
              오늘 당신은
              <strong>
                {' '}
                감염병 대응 바이오 연구원
              </strong>
              이었습니다.
            </p>

            <button
              className="vr-primary"
              onClick={resetMission}
            >
              NEXT RESEARCHER →
            </button>
          </section>
        )}

        {stage === 'fail' && (
          <section className="vr-result fail">
            <div className="vr-result-icon">
              🔒
            </div>

            <small>
              TIME OVER
            </small>

            <h2>
              LAB LOCKED
            </h2>

            <h3>
              미션 실패
            </h3>

            <p>
              제한시간 안에
              연구 결정을 완료하지
              못했습니다.
            </p>

            <button
              className="vr-primary"
              onClick={startMission}
            >
              RETRY →
            </button>
          </section>
        )}
      </main>

      <footer className="vr-footer">
        실제 공개 PDB 구조 데이터를
        활용한 교육용 체험입니다.
        치료효과·진단·실제 약효를
        판정하지 않습니다.
      </footer>
    </div>
  );
}
