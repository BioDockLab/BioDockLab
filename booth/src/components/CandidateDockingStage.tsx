import {
  Atom,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Target,
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { candidates } from '../data/content';
import type { ResearchSession } from '../types';
import './CandidateDockingStage.css';

type CandidateId =
  ResearchSession['selectedCandidateId'];

type CandidateDockingStageProps = {
  selectedId: CandidateId;
  onSelect: (id: CandidateId) => void;
};

const STEP_DURATION = 1500;

export function CandidateDockingStage({
  selectedId,
  onSelect,
}: CandidateDockingStageProps) {
  const [phase, setPhase] =
    useState<number>(-1);

  const [runId, setRunId] =
    useState(0);

  const rankedCandidates = useMemo(
    () =>
      [...candidates].sort(
        (a, b) =>
          a.dockingScore -
          b.dockingScore,
      ),
    [],
  );

  const completed = phase >= candidates.length;

  useEffect(() => {
    const timer = window.setTimeout(
      () => {
        setPhase((current) => {
          if (
            current >=
            candidates.length
          ) {
            return current;
          }

          return current + 1;
        });
      },
      phase < 0 ? 650 : STEP_DURATION,
    );

    if (completed) {
      window.clearTimeout(timer);
    }

    return () => {
      window.clearTimeout(timer);
    };
  }, [phase, runId, completed]);

  useEffect(() => {
    if (!completed) {
      return;
    }

    const best =
      rankedCandidates[0];

    if (best) {
      onSelect(
        best.id as CandidateId,
      );
    }
  }, [
    completed,
    rankedCandidates,
    onSelect,
  ]);

  const restart = () => {
    setPhase(-1);
    setRunId((value) => value + 1);
  };

  const currentCandidate =
    phase >= 0 &&
    phase < candidates.length
      ? candidates[phase]
      : null;

  return (
    <section className="docking-stage">
      <header className="docking-stage__header">
        <div>
          <span className="docking-stage__eyebrow">
            <Atom />
            STRUCTURAL INTERACTION
            VISUALIZATION
          </span>

          <h2>
            후보물질이 단백질의 어느
            위치와 상호작용할까요?
          </h2>

          <p>
            세 후보의 구조적 상호작용을
            순서대로 비교하는 교육용
            시각화입니다.
          </p>
        </div>

        <div className="docking-stage__status">
          <span
            className={
              completed
                ? 'is-complete'
                : 'is-running'
            }
          />

          <strong>
            {completed
              ? '비교 완료'
              : phase < 0
                ? '결합 부위 탐색'
                : `${currentCandidate?.name} 비교 중`}
          </strong>

          <small>
            실시간 도킹 계산이 아닌
            교육용 참고 연출
          </small>
        </div>
      </header>

      <div className="docking-stage__workspace">
        <div className="docking-stage__protein">
          <div className="protein-cloud protein-cloud--one" />
          <div className="protein-cloud protein-cloud--two" />
          <div className="protein-cloud protein-cloud--three" />
          <div className="protein-cloud protein-cloud--four" />

          <div
            className={`binding-pocket ${
              phase >= 0
                ? 'is-active'
                : ''
            }`}
          >
            <Target />

            <span>
              탐색 결합 부위
            </span>
          </div>

          <div className="protein-label">
            <Atom />

            <div>
              <strong>
                EGFR
              </strong>

              <small>
                Protein Structure
              </small>
            </div>
          </div>

          <div className="docking-scan-line" />
        </div>

        <div className="docking-candidates">
          {candidates.map(
            (item, index) => {
              const isActive =
                phase === index;

              const wasAnalyzed =
                phase > index ||
                completed;

              const rank =
                rankedCandidates.findIndex(
                  (ranked) =>
                    ranked.id ===
                    item.id,
                ) + 1;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`docking-molecule docking-molecule--${
                    index + 1
                  } ${
                    isActive
                      ? 'is-docking'
                      : ''
                  } ${
                    wasAnalyzed
                      ? 'is-analyzed'
                      : ''
                  } ${
                    selectedId ===
                    item.id
                      ? 'is-selected'
                      : ''
                  }`}
                  onClick={() =>
                    onSelect(
                      item.id as CandidateId,
                    )
                  }
                >
                  <span className="molecule-shape">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>

                  <span className="molecule-copy">
                    <strong>
                      {item.name}
                    </strong>

                    <small>
                      {item.code}
                    </small>
                  </span>

                  {isActive && (
                    <span className="molecule-live">
                      <Sparkles />
                      상호작용 비교
                    </span>
                  )}

                  {wasAnalyzed && (
                    <span className="molecule-result">
                      <CheckCircle2 />

                      {rank}위 ·{' '}
                      {item.dockingScore}{' '}
                      kcal/mol
                    </span>
                  )}
                </button>
              );
            },
          )}
        </div>

        <div
          className="docking-stage__message"
          aria-live="polite"
        >
          {phase < 0 && (
            <>
              <Target />

              <div>
                <strong>
                  결합 가능 영역을
                  탐색하고 있습니다.
                </strong>

                <span>
                  단백질 구조에서 후보가
                  접근할 수 있는 영역을
                  확인합니다.
                </span>
              </div>
            </>
          )}

          {currentCandidate && (
            <>
              <Sparkles />

              <div>
                <strong>
                  {currentCandidate.name}{' '}
                  구조 비교 중
                </strong>

                <span>
                  핵심 부위와의
                  상호작용 위치 및
                  계산 참고값을
                  비교합니다.
                </span>
              </div>
            </>
          )}

          {completed && (
            <>
              <CheckCircle2 />

              <div>
                <strong>
                  세 후보의 비교가
                  완료되었습니다.
                </strong>

                <span>
                  계산 참고값과 구조적
                  특징을 함께 확인한 뒤
                  탐색할 방향을
                  선택하세요.
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="docking-stage__footer">
        <div className="docking-ranking">
          {rankedCandidates.map(
            (item, index) => (
              <button
                key={item.id}
                type="button"
                className={
                  selectedId === item.id
                    ? 'is-selected'
                    : ''
                }
                onClick={() =>
                  onSelect(
                    item.id as CandidateId,
                  )
                }
              >
                <span>
                  {index + 1}
                </span>

                <div>
                  <strong>
                    {item.name}
                  </strong>

                  <small>
                    {item.dockingScore}{' '}
                    kcal/mol
                  </small>
                </div>
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          className="docking-replay"
          onClick={restart}
        >
          {completed
            ? <RotateCcw />
            : <Play />}

          다시 비교 보기
        </button>
      </footer>

      <div className="docking-stage__disclaimer">
        계산 참고값은 후보 간 구조적
        비교를 설명하기 위한 교육용
        데이터이며 실제 약효·치료 효과를
        의미하지 않습니다.
      </div>
    </section>
  );
}