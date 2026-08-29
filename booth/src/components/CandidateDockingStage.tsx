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

const STEP_DURATION = 1700;

const speakDockingText = (
  text: string,
) => {
  if (
    typeof window === 'undefined' ||
    !('speechSynthesis' in window)
  ) {
    return;
  }

  const utterance =
    new SpeechSynthesisUtterance(
      text,
    );

  utterance.lang = 'ko-KR';
  utterance.rate = 0.94;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voices =
    window.speechSynthesis.getVoices();

  const koreanVoice =
    voices.find(
      (voice) =>
        voice.lang
          .toLowerCase()
          .startsWith('ko') &&
        voice.localService,
    ) ??
    voices.find((voice) =>
      voice.lang
        .toLowerCase()
        .startsWith('ko'),
    );

  if (koreanVoice) {
    utterance.voice =
      koreanVoice;
  }

  window.speechSynthesis.speak(
    utterance,
  );
};

export function CandidateDockingStage({
  selectedId: _selectedId,
  onSelect,
}: CandidateDockingStageProps) {
  const [phase, setPhase] =
    useState<number>(-1);

  const [runId, setRunId] =
    useState(0);

  const [chosenId, setChosenId] =
    useState<CandidateId | null>(
      null,
    );

  const rankedCandidates = useMemo(
    () =>
      [...candidates].sort(
        (a, b) =>
          a.dockingScore -
          b.dockingScore,
      ),
    [],
  );

  const completed =
    phase >= candidates.length;

  const bestCandidate =
    rankedCandidates[0] ?? null;

  useEffect(() => {
    if (completed) {
      return;
    }

    const timer =
      window.setTimeout(
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
        phase < 0
          ? 850
          : STEP_DURATION,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    phase,
    runId,
    completed,
  ]);

  useEffect(() => {
    if (phase === 0) {
      speakDockingText(
        '첫 번째 후보, Candidate A의 구조적 상호작용을 확인합니다.',
      );
    }

    if (phase === 1) {
      speakDockingText(
        '두 번째 후보, Candidate B를 비교합니다.',
      );
    }

    if (phase === 2) {
      speakDockingText(
        '마지막 후보, Candidate C를 비교합니다.',
      );
    }

    if (phase === candidates.length) {
      speakDockingText(
        '세 후보의 비교가 완료되었습니다. 계산 참고값을 확인하고, 다음 연구 방향을 직접 선택해 주세요.',
      );
    }
  }, [phase]);

  const restart = () => {
    if (
      typeof window !==
        'undefined' &&
      'speechSynthesis' in window
    ) {
      window.speechSynthesis.cancel();
    }

    setPhase(-1);

    setRunId(
      (value) => value + 1,
    );
  };

  const chooseCandidate = (
    id: CandidateId,
  ) => {
    if (!completed) {
      return;
    }

    const item =
      candidates.find(
        (candidate) =>
          candidate.id === id,
      );

    if (!item) {
      return;
    }

    setChosenId(id);
    onSelect(id);

    speakDockingText(
      `${item.name}를 다음 연구 방향으로 선택했습니다.`,
    );
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
            세 후보의 구조적
            상호작용을 순서대로
            비교하고, 마지막에는
            연구자가 직접 다음
            탐색 방향을 선택합니다.
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
              ? chosenId
                ? '연구 방향 선택 완료'
                : '비교 완료 · 선택 대기'
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

              const isRecommended =
                bestCandidate?.id ===
                item.id;

              const isChosen =
                chosenId ===
                item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={
                    !completed
                  }
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
                    isChosen
                      ? 'is-selected'
                      : ''
                  }`}
                  onClick={() =>
                    chooseCandidate(
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

                  {completed &&
                    isRecommended && (
                      <span className="molecule-live">
                        <Sparkles />
                        AI 참고 · 우선 탐색
                        후보
                      </span>
                    )}

                  {isChosen && (
                    <span className="molecule-result">
                      <CheckCircle2 />
                      내 연구 방향
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
                  단백질 구조에서
                  후보가 접근할 수
                  있는 영역을
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

          {completed &&
            !chosenId && (
              <>
                <CheckCircle2 />

                <div>
                  <strong>
                    세 후보의 비교가
                    완료되었습니다.
                  </strong>

                  <span>
                    참고 순위를 확인한
                    뒤, 다음 연구
                    방향을 직접
                    선택해 주세요.
                  </span>
                </div>
              </>
            )}

          {completed &&
            chosenId && (
              <>
                <Sparkles />

                <div>
                  <strong>
                    연구 방향을
                    선택했습니다.
                  </strong>

                  <span>
                    선택한 후보는
                    Research Trail의
                    다음 연구 방향으로
                    기록됩니다.
                  </span>
                </div>
              </>
            )}
        </div>
      </div>

      <footer className="docking-stage__footer">
        <div className="docking-ranking">
          {rankedCandidates.map(
            (item, index) => {
              const isRecommended =
                index === 0;

              const isChosen =
                chosenId ===
                item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={
                    !completed
                  }
                  className={
                    isChosen
                      ? 'is-selected'
                      : ''
                  }
                  onClick={() =>
                    chooseCandidate(
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

                    {isRecommended && (
                      <small>
                        AI 참고 · 우선 탐색
                      </small>
                    )}

                    {isChosen && (
                      <small>
                        ✓ 내 연구 방향
                      </small>
                    )}
                  </div>
                </button>
              );
            },
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
        계산 참고값은 후보 간
        구조적 비교를 설명하기 위한
        교육용 데이터입니다.
        AI의 참고 순위는 연구자의
        선택을 대신하지 않으며,
        실제 약효·치료 효과를
        의미하지 않습니다.
      </div>
    </section>
  );
}