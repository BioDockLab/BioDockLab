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

import {
  lastHopeQuestions,
  type LastHopeQuestion,
} from '../data/lastHopeQuestions';

import {
  infectionBriefings,
} from '../data/infectionBriefings';

type Stage =
  | 'briefing'
  | 'quiz'
  | 'memory'
  | 'match'
  | 'pocket'
  | 'candidate'
  | 'escape'
  | 'success'
  | 'fail';

const TOTAL_SECONDS = 90;
const PASS_COUNT = 7;

const TARGET_IDS: DeepDiveProteinId[] = [
  'sars2-mpro',
  'mers-mpro',
  'h1n1-neuraminidase',
];

const STAGE_IMAGE: Record<Stage, string> = {
  briefing: '/last-hope/briefing.png',
  quiz: '/last-hope/quiz.png',
  memory: '/last-hope/memory.png',
  match: '/last-hope/match.png',
  pocket: '/last-hope/pocket.png',
  candidate: '/last-hope/candidate.png',
  escape: '/last-hope/candidate.png',
  success: '/last-hope/success.png',
  fail: '/last-hope/fail.png',
};

function shuffled<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function formatTime(seconds: number) {
  const safe = Math.max(0, seconds);
  const min = String(Math.floor(safe / 60)).padStart(2, '0');
  const sec = String(safe % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

export default function LastHopeGameV3() {
  const [stage, setStage] = useState<Stage>('briefing');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [penalty, setPenalty] = useState(0);
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [score, setScore] = useState(0);
  const [targetId, setTargetId] = useState<DeepDiveProteinId>('sars2-mpro');
  const [questions, setQuestions] = useState<LastHopeQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [locked, setLocked] = useState(false);
  const [memoryCount, setMemoryCount] = useState(5);
  const [matchOrder, setMatchOrder] = useState<DeepDiveProteinId[]>(TARGET_IDS);
  const [pocketChoice, setPocketChoice] = useState<'A' | 'B' | 'C' | null>(null);
  const [candidateIndex, setCandidateIndex] = useState<number | null>(null);
  const [atlasOpen, setAtlasOpen] = useState(false);
  const [failReason, setFailReason] = useState('TIME OVER');
  const transitionRef = useRef<number | null>(null);

  const target = dockingTargets[targetId];
  const candidates = dockingResultByProteinId(targetId)?.candidates ?? [];
  const question = questions[questionIndex];

  const outbreak = useMemo(() => {
    if (stage === 'briefing') return 12;
    if (stage === 'fail') return 100;
    return Math.min(99, Math.round(12 + ((TOTAL_SECONDS - remaining) / TOTAL_SECONDS) * 88));
  }, [remaining, stage]);

  const running = !['briefing', 'success', 'fail'].includes(stage);

  useEffect(() => {
    if (!running || startedAt === null) return;

    const timer = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const next = TOTAL_SECONDS - elapsed - penalty;

      if (next <= 0) {
        setRemaining(0);
        setFailReason('TIME OVER');
        setStage('fail');
        return;
      }

      setRemaining(next);
    }, 150);

    return () => window.clearInterval(timer);
  }, [running, startedAt, penalty]);

  useEffect(() => {
    if (stage !== 'memory') return;

    setMemoryCount(5);
    const timer = window.setInterval(() => {
      setMemoryCount((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          window.setTimeout(() => setStage('match'), 250);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'escape') return;
    const timer = window.setTimeout(() => setStage('success'), 2600);
    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    return () => {
      if (transitionRef.current !== null) {
        window.clearTimeout(transitionRef.current);
      }
    };
  }, []);

  const resetMission = () => {
    if (transitionRef.current !== null) {
      window.clearTimeout(transitionRef.current);
      transitionRef.current = null;
    }
    setStage('briefing');
    setStartedAt(null);
    setPenalty(0);
    setRemaining(TOTAL_SECONDS);
    setScore(0);
    setQuestionIndex(0);
    setCorrectCount(0);
    setFeedback('');
    setLocked(false);
    setPocketChoice(null);
    setCandidateIndex(null);
  };

  const startMission = () => {
    const nextTarget = TARGET_IDS[Math.floor(Math.random() * TARGET_IDS.length)];
    setTargetId(nextTarget);
    setMatchOrder(shuffled(TARGET_IDS));
    setQuestions(shuffled(lastHopeQuestions).slice(0, 10));
    setQuestionIndex(0);
    setCorrectCount(0);
    setPenalty(0);
    setRemaining(TOTAL_SECONDS);
    setScore(0);
    setFeedback('');
    setLocked(false);
    setPocketChoice(null);
    setCandidateIndex(null);
    setStartedAt(Date.now());
    setStage('quiz');
  };

  const nextQuizQuestion = (wasCorrect: boolean) => {
    const projected = correctCount + (wasCorrect ? 1 : 0);

    if (questionIndex >= 9) {
      setLocked(true);
      transitionRef.current = window.setTimeout(() => {
        setFeedback('');
        setLocked(false);
        if (projected >= PASS_COUNT) {
          setStage('memory');
        } else {
          setFailReason(`SECURITY FAILED · ${projected}/10`);
          setStage('fail');
        }
      }, 850);
      return;
    }

    setLocked(true);
    transitionRef.current = window.setTimeout(() => {
      setQuestionIndex((v) => v + 1);
      setFeedback('');
      setLocked(false);
    }, 650);
  };

  const answerQuestion = (value: 'O' | 'X' | number) => {
    if (!question || locked || feedback) return;

    const isCorrect = question.answer === value;
    if (isCorrect) {
      setCorrectCount((v) => v + 1);
      setScore((v) => v + 100);
      setFeedback(`정답 · +100 · ${question.explanation}`);
      nextQuizQuestion(true);
    } else {
      setPenalty((v) => v + 3);
      setFeedback(`오답 · -3 SEC · ${question.explanation}`);
      nextQuizQuestion(false);
    }
  };

  const chooseMatch = (id: DeepDiveProteinId) => {
    if (locked) return;
    if (id === targetId) {
      setScore((v) => v + 200);
      setFeedback('TARGET MATCHED · +200');
      setLocked(true);
      transitionRef.current = window.setTimeout(() => {
        setFeedback('');
        setLocked(false);
        setStage('pocket');
      }, 700);
    } else {
      setPenalty((v) => v + 7);
      setFeedback('WRONG SAMPLE · -7 SEC');
      setLocked(true);
      transitionRef.current = window.setTimeout(() => {
        setFeedback('');
        setLocked(false);
      }, 700);
    }
  };

  const choosePocket = (choice: 'A' | 'B' | 'C') => {
    if (locked) return;
    setPocketChoice(choice);

    if (choice === 'B') {
      setScore((v) => v + 250);
      setFeedback('BINDING SITE FOUND · +250');
      setLocked(true);
      transitionRef.current = window.setTimeout(() => {
        setFeedback('');
        setLocked(false);
        setStage('candidate');
      }, 800);
    } else {
      setPenalty((v) => v + 5);
      setFeedback('SITE NOT MATCHED · -5 SEC');
      setLocked(true);
      transitionRef.current = window.setTimeout(() => {
        setFeedback('');
        setLocked(false);
      }, 700);
    }
  };

  const secureCandidate = () => {
    if (candidateIndex === null) return;
    setScore((v) => v + 300 + remaining * 4);
    setStage('escape');
  };

  return (
    <div className={`lh3-root stage-${stage}`}>
      <div className="lh3-canvas">
        <img className="lh3-reference" src={STAGE_IMAGE[stage]} alt="" />

        {stage !== 'briefing' && stage !== 'success' && stage !== 'fail' && (
          <div className="lh3-live-hud">
            <div><small>TIME LEFT</small><strong>{formatTime(remaining)}</strong></div>
            <div><small>OUTBREAK</small><strong>{outbreak}%</strong></div>
            <div><small>SCORE</small><strong>{String(score).padStart(4, '0')}</strong></div>
          </div>
        )}

        {stage === 'briefing' && (
          <>
            <button className="lh3-atlas-button" onClick={() => setAtlasOpen(true)}>
              감염병 도감 9종 보기
            </button>
            <button className="lh3-start-hotspot" onClick={startMission} aria-label="미션 시작" />
          </>
        )}

        {stage === 'quiz' && question && (
          <section className="lh3-quiz-panel">
            <div className="lh3-quiz-meta">
              <span>QUESTION {questionIndex + 1} / 10</span>
              <b>정답 {correctCount} · PASS {PASS_COUNT}</b>
            </div>
            <div className="lh3-quiz-briefing">{question.briefing}</div>
            <h2>{question.question}</h2>

            {question.type === 'ox' ? (
              <div className="lh3-ox-grid">
                <button disabled={locked} onClick={() => answerQuestion('O')}>O<span>그렇다</span></button>
                <button disabled={locked} onClick={() => answerQuestion('X')}>X<span>아니다</span></button>
              </div>
            ) : (
              <div className="lh3-choice-grid">
                {(question.options ?? []).map((option, index) => (
                  <button key={option} disabled={locked} onClick={() => answerQuestion(index)}>
                    <b>{String.fromCharCode(65 + index)}</b><span>{option}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {stage === 'memory' && (
          <>
            <div className="lh3-memory-view"><Protein3DViewer target={target} /></div>
            <div className="lh3-memory-count">{memoryCount}</div>
          </>
        )}

        {stage === 'match' && (
          <div className="lh3-match-grid">
            {matchOrder.map((id, index) => (
              <button key={id} disabled={locked} onClick={() => chooseMatch(id)}>
                <b>{String.fromCharCode(65 + index)}</b>
                <div><Protein3DViewer target={dockingTargets[id]} compact /></div>
                <span>SAMPLE {String.fromCharCode(65 + index)}</span>
              </button>
            ))}
          </div>
        )}

        {stage === 'pocket' && (
          <div className="lh3-pocket-zone">
            <div className="lh3-pocket-view"><Protein3DViewer target={target} /></div>
            {(['A','B','C'] as const).map((label) => (
              <button
                key={label}
                className={`lh3-pocket-marker marker-${label.toLowerCase()} ${pocketChoice === label ? 'chosen' : ''}`}
                disabled={locked}
                onClick={() => choosePocket(label)}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {stage === 'candidate' && (
          <section className="lh3-candidate-panel">
            <div className="lh3-candidate-grid">
              {candidates.map((candidate, index) => (
                <button
                  key={candidate.code}
                  className={candidateIndex === index ? 'selected' : ''}
                  onClick={() => setCandidateIndex(index)}
                >
                  <b>{String.fromCharCode(65 + index)}</b>
                  <strong>{candidate.name}</strong>
                  <span>다음 연구 단계 후보</span>
                  <small>실제 효능·결합 점수는 검증 대기</small>
                </button>
              ))}
            </div>
            <button className="lh3-secure-button" disabled={candidateIndex === null} onClick={secureCandidate}>
              SECURE CANDIDATE →
            </button>
          </section>
        )}

        {stage === 'escape' && (
          <div className="lh3-escape-overlay">
            <div className="lh3-escape-runner">🧑‍🔬🧪</div>
            <strong>EVACUATING...</strong>
          </div>
        )}

        {stage === 'success' && (
          <button className="lh3-next-button" onClick={resetMission}>NEXT RESEARCHER →</button>
        )}

        {stage === 'fail' && (
          <>
            <div className="lh3-fail-reason">{failReason}</div>
            <button className="lh3-retry-hotspot" onClick={startMission} aria-label="다시 도전" />
          </>
        )}

        {feedback && !['success','fail'].includes(stage) && (
          <div className={`lh3-feedback ${feedback.includes('오답') || feedback.includes('WRONG') || feedback.includes('NOT MATCHED') ? 'bad' : 'good'}`}>
            {feedback}
          </div>
        )}

        {atlasOpen && (
          <div className="lh3-modal" onClick={() => setAtlasOpen(false)}>
            <div className="lh3-modal-card" onClick={(e) => e.stopPropagation()}>
              <header><div><small>INFECTIOUS DISEASE ARCHIVE</small><h2>감염병 도감</h2></div><button onClick={() => setAtlasOpen(false)}>×</button></header>
              <div className="lh3-atlas-grid">
                {infectionBriefings.map((item) => (
                  <article key={item.id}>
                    <small>{item.pathogenType === 'virus' ? 'VIRUS' : 'BACTERIA'} · {item.tag}</small>
                    <h3>{item.name}</h3>
                    <b>{item.pathogen}</b>
                    <p>{item.summary}</p>
                    <span>{item.clue}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
