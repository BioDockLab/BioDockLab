import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
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
  infectionBriefings,
} from '../data/infectionBriefings';

import {
  megaQuestionPool,
  type MegaQuestion,
} from '../data/lastHopeMegaQuestions';

type Stage =
  | 'briefing'
  | 'quiz'
  | 'memory'
  | 'match'
  | 'classify'
  | 'sequence'
  | 'pocket'
  | 'candidate'
  | 'escape'
  | 'success'
  | 'fail';

type BriefingPage = 'booth' | 'archive';

type QuizRound = MegaQuestion;

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
  classify: '/last-hope/quiz.png',
  sequence: '/last-hope/quiz.png',
  pocket: '/last-hope/pocket.png',
  candidate: '/last-hope/candidate.png',
  escape: '/last-hope/candidate.png',
  success: '/last-hope/success.png',
  fail: '/last-hope/fail.png',
};

const RESEARCH_SEQUENCE = [
  '표적 단백질 구조 확인',
  '결합 가능 공간 탐색',
  '다음 연구 후보 지정',
];

function shuffled<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function formatTime(seconds: number) {
  const safe = Math.max(0, seconds);
  const min = String(Math.floor(safe / 60)).padStart(2, '0');
  const sec = String(safe % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s._()\-]/g, '')
    .replace(/년$/g, '');
}


const RECENT_QUESTION_KEY = 'biodocklab-last-hope-recent-question-ids';
const RECENT_FAMILY_KEY = 'biodocklab-last-hope-recent-question-families';

function readRecentQuestionIds() {
  try {
    const raw = window.localStorage.getItem(RECENT_QUESTION_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function rememberQuestionIds(ids: string[]) {
  try {
    const previous = readRecentQuestionIds();
    const merged = [...ids, ...previous.filter((id) => !ids.includes(id))].slice(0, 220);
    window.localStorage.setItem(RECENT_QUESTION_KEY, JSON.stringify(merged));
  } catch {
    // kiosk can still run when storage is unavailable
  }
}

function readRecentFamilies() {
  try {
    const raw = window.localStorage.getItem(RECENT_FAMILY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function rememberFamilies(families: string[]) {
  try {
    const previous = readRecentFamilies();
    const merged = [...families, ...previous.filter((family) => !families.includes(family))].slice(0, 16);
    window.localStorage.setItem(RECENT_FAMILY_KEY, JSON.stringify(merged));
  } catch {
    // no-op
  }
}

function rebalanceChoiceAnswer(
  question: MegaQuestion,
  desiredIndex: number,
): MegaQuestion {
  if (
    question.type !== 'choice' ||
    !question.options ||
    typeof question.answer !== 'number'
  ) {
    return question;
  }

  const correct = question.options[question.answer];
  const distractors = question.options.filter((_, index) => index !== question.answer);
  const nextOptions = [...distractors];
  nextOptions.splice(Math.min(desiredIndex, nextOptions.length), 0, correct);

  return {
    ...question,
    options: nextOptions,
    answer: Math.min(desiredIndex, nextOptions.length - 1),
  };
}

function makeQuizRounds(): QuizRound[] {
  const recent = new Set(readRecentQuestionIds());
  const recentFamilies = new Set(readRecentFamilies());
  const usedFamilies = new Set<string>();
  const selected: MegaQuestion[] = [];

  const choose = (
    category: MegaQuestion['category'],
    count: number,
  ) => {
    const fresh = shuffled(
      megaQuestionPool.filter(
        (question) =>
          question.category === category &&
          !recent.has(question.id) &&
          !recentFamilies.has(question.family) &&
          !usedFamilies.has(question.family) &&
          question.difficulty !== 'hard',
      ),
    );

    const fallback = shuffled(
      megaQuestionPool.filter(
        (question) =>
          question.category === category &&
          !usedFamilies.has(question.family),
      ),
    );

    const pool = [...fresh, ...fallback.filter((item) => !fresh.some((f) => f.id === item.id))];

    for (const question of pool) {
      if (selected.filter((item) => item.category === category).length >= count) break;
      if (usedFamilies.has(question.family)) continue;

      // Slightly easier mix: no more than two typed questions and two O/X questions.
      if (
        question.type === 'short' &&
        selected.filter((item) => item.type === 'short').length >= 2
      ) {
        continue;
      }

      if (
        question.type === 'ox' &&
        selected.filter((item) => item.type === 'ox').length >= 2
      ) {
        continue;
      }

      selected.push(question);
      usedFamilies.add(question.family);
    }
  };

  // Booth explanation is intentionally examinable: users are rewarded for reading it.
  choose('booth', 2);
  choose('infection', 4);
  choose('structure', 2);
  choose('research', 2);

  // If a category ran short because of recent-history filtering, fill from the full pool.
  if (selected.length < 10) {
    for (const question of shuffled(megaQuestionPool)) {
      if (selected.length >= 10) break;
      if (usedFamilies.has(question.family)) continue;
      if (question.type === 'short' && selected.filter((item) => item.type === 'short').length >= 2) continue;
      if (question.type === 'ox' && selected.filter((item) => item.type === 'ox').length >= 2) continue;
      selected.push(question);
      usedFamilies.add(question.family);
    }
  }

  const positionCycle = shuffled([0, 1, 2, 3]);
  let choiceIndex = 0;

  const finalSet = shuffled(selected.slice(0, 10)).map((question) => {
    if (question.type !== 'choice') return question;
    const position = positionCycle[choiceIndex % positionCycle.length];
    choiceIndex += 1;
    return rebalanceChoiceAnswer(question, position);
  });

  rememberQuestionIds(finalSet.map((question) => question.id));
  rememberFamilies(finalSet.map((question) => question.family));
  return finalSet;
}

function ZombieMapFX({
  outbreak,
  remaining,
  stage,
}: {
  outbreak: number;
  remaining: number;
  stage: Stage;
}) {
  const maxZombies = 18;
  const count =
    stage === 'fail'
      ? maxZombies
      : Math.min(maxZombies, 2 + Math.floor(outbreak / 6));

  const wave = Math.min(
    9,
    1 + Math.floor((TOTAL_SECONDS - remaining) / 10),
  );

  const progress = Math.min(1, outbreak / 100);

  const status =
    outbreak < 30
      ? '외곽 감염 감지'
      : outbreak < 50
      ? '좀비 무리 도심 진입'
      : outbreak < 70
      ? '분석실 방어선 압박'
      : outbreak < 90
      ? '연구소 접근 개체 급증'
      : 'LAB OVERRUN 임박';

  return (
    <div
      className={`lh5-map-fx outbreak-${Math.min(4, Math.floor(outbreak / 25))}`}
      aria-hidden="true"
    >
      <div className="lh5-map-red-zone" style={{ opacity: 0.12 + progress * 0.66 }} />
      <div className="lh5-map-safe-zone" style={{ opacity: Math.max(0.08, 0.75 - progress * 0.65) }} />

      <div className="lh5-map-status">
        <small>ZVX-26 LIVE SIMULATION</small>
        <strong>WAVE {wave} · {status}</strong>
        <span>접근 개체 {count} · 감염 확산 {outbreak}%</span>
      </div>

      {Array.from({ length: count }).map((_, index) => {
        const lane = index % 6;
        const row = Math.floor(index / 6);
        const startX = 92 - lane * 3.8;
        const startY = 18 + ((index * 19) % 68);
        const threshold = 0.06 + index * 0.026;
        const local = Math.max(0, Math.min(1, (progress - threshold) / (1 - threshold)));
        const targetX = 19 + (lane % 3) * 4.2;
        const targetY = 47 + (row - 1) * 8 + (lane % 2) * 5;
        const left = startX + (targetX - startX) * local;
        const top = startY + (targetY - startY) * local;

        return (
          <span
            key={index}
            className="lh5-zombie"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              fontSize: `${18 + (index % 4) * 3}px`,
              opacity: 0.48 + local * 0.5,
              animationDelay: `${(index % 7) * -0.12}s`,
            }}
          >
            🧟
          </span>
        );
      })}

      {outbreak >= 60 && <div className="lh5-siren siren-a">!</div>}
      {outbreak >= 76 && <div className="lh5-siren siren-b">!</div>}
      {outbreak >= 88 && <div className="lh5-siren siren-c">!</div>}
    </div>
  );
}

export default function LastHopeGameV5() {
  const [stage, setStage] = useState<Stage>('briefing');
  const [briefingPage, setBriefingPage] = useState<BriefingPage>('booth');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [penalty, setPenalty] = useState(0);
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [score, setScore] = useState(0);
  const [targetId, setTargetId] = useState<DeepDiveProteinId>('sars2-mpro');
  const [rounds, setRounds] = useState<QuizRound[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [locked, setLocked] = useState(false);
  const [memoryVisible, setMemoryVisible] = useState(true);
  const [matchOrder, setMatchOrder] = useState<DeepDiveProteinId[]>(TARGET_IDS);
  const [classifyIndex, setClassifyIndex] = useState(0);
  const [classifyDeck, setClassifyDeck] = useState<string[]>([]);
  const [sequenceDeck, setSequenceDeck] = useState<string[]>([]);
  const [sequenceProgress, setSequenceProgress] = useState<string[]>([]);
  const [pocketChoice, setPocketChoice] = useState<'A' | 'B' | 'C' | null>(null);
  const [candidateIndex, setCandidateIndex] = useState<number | null>(null);
  const [failReason, setFailReason] = useState('TIME OVER');

  const transitionRef = useRef<number | null>(null);

  const target = dockingTargets[targetId];
  const candidates = dockingResultByProteinId(targetId)?.candidates ?? [];
  const round = rounds[questionIndex];

  const outbreak = useMemo(() => {
    if (stage === 'briefing') return 12;
    if (stage === 'fail') return 100;
    return Math.min(
      99,
      Math.round(
        12 +
          ((TOTAL_SECONDS - remaining) / TOTAL_SECONDS) * 88,
      ),
    );
  }, [remaining, stage]);

  const running = !['briefing', 'success', 'fail'].includes(stage);

  const currentClassify = infectionBriefings.find(
    (item) => item.id === classifyDeck[classifyIndex],
  );

  useEffect(() => {
    if (!running || startedAt === null) return;

    const timer = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const next = TOTAL_SECONDS - elapsed - penalty;

      if (next <= 0) {
        setRemaining(0);
        setFailReason('TIME OVER · LAB OVERRUN');
        setStage('fail');
        return;
      }

      setRemaining(next);
    }, 150);

    return () => window.clearInterval(timer);
  }, [running, startedAt, penalty]);

  useEffect(() => {
    if (stage !== 'memory') return;

    setMemoryVisible(true);

    const timer = window.setTimeout(() => {
      setMemoryVisible(false);
      setStage('match');
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'escape') return;
    const timer = window.setTimeout(() => setStage('success'), 2400);
    return () => window.clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    return () => {
      if (transitionRef.current !== null) {
        window.clearTimeout(transitionRef.current);
      }
    };
  }, []);

  const clearTransition = () => {
    if (transitionRef.current !== null) {
      window.clearTimeout(transitionRef.current);
      transitionRef.current = null;
    }
  };

  const resetMission = () => {
    clearTransition();
    setStage('briefing');
    setBriefingPage('booth');
    setStartedAt(null);
    setPenalty(0);
    setRemaining(TOTAL_SECONDS);
    setScore(0);
    setQuestionIndex(0);
    setCorrectCount(0);
    setTypedAnswer('');
    setFeedback('');
    setLocked(false);
    setClassifyIndex(0);
    setClassifyDeck([]);
    setSequenceProgress([]);
    setPocketChoice(null);
    setCandidateIndex(null);
  };

  const startMission = () => {
    clearTransition();

    const nextTarget =
      TARGET_IDS[Math.floor(Math.random() * TARGET_IDS.length)];

    setTargetId(nextTarget);
    setMatchOrder(shuffled(TARGET_IDS));
    setRounds(makeQuizRounds());
    setQuestionIndex(0);
    setCorrectCount(0);
    setTypedAnswer('');
    setPenalty(0);
    setRemaining(TOTAL_SECONDS);
    setScore(0);
    setFeedback('');
    setLocked(false);
    setClassifyIndex(0);
    setClassifyDeck(
      shuffled(['tuberculosis', 'covid19', 'norovirus']),
    );
    setSequenceDeck(shuffled(RESEARCH_SEQUENCE));
    setSequenceProgress([]);
    setPocketChoice(null);
    setCandidateIndex(null);
    setStartedAt(Date.now());
    setStage('quiz');
  };

  const goToNextRound = (wasCorrect: boolean) => {
    const projected = correctCount + (wasCorrect ? 1 : 0);

    if (questionIndex >= 9) {
      setLocked(true);
      transitionRef.current = window.setTimeout(() => {
        setFeedback('');
        setLocked(false);
        setTypedAnswer('');

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
      setQuestionIndex((value) => value + 1);
      setFeedback('');
      setTypedAnswer('');
      setLocked(false);
    }, 650);
  };

  const answerBankQuestion = (value: 'O' | 'X' | number) => {
    if (!round || round.type === 'short' || locked || feedback) return;

    const isCorrect = round.answer === value;

    if (isCorrect) {
      setCorrectCount((value) => value + 1);
      setScore((value) => value + 100);
      setFeedback(`정답 · +100 · ${round.explanation}`);
      goToNextRound(true);
    } else {
      setPenalty((value) => value + 3);
      setFeedback(`오답 · -3 SEC · ${round.explanation}`);
      goToNextRound(false);
    }
  };

  const submitShortAnswer = (event: FormEvent) => {
    event.preventDefault();

    if (!round || round.type !== 'short' || locked || feedback) return;

    const normalized = normalizeAnswer(typedAnswer);
    const isCorrect = (round.answers ?? []).some(
      (answer) => normalizeAnswer(answer) === normalized,
    );

    if (isCorrect) {
      setCorrectCount((value) => value + 1);
      setScore((value) => value + 150);
      setFeedback(`주관식 정답 · +150 · ${round.explanation}`);
      goToNextRound(true);
    } else {
      setPenalty((value) => value + 4);
      setFeedback(`주관식 오답 · -4 SEC · ${round.explanation}`);
      goToNextRound(false);
    }
  };

  const chooseMatch = (id: DeepDiveProteinId) => {
    if (locked) return;

    if (id === targetId) {
      setScore((value) => value + 200);
      setFeedback('FLASH MATCH · +200');
      setLocked(true);
      transitionRef.current = window.setTimeout(() => {
        setFeedback('');
        setLocked(false);
        setStage('classify');
      }, 650);
    } else {
      setPenalty((value) => value + 7);
      setFeedback('WRONG SAMPLE · -7 SEC');
      setLocked(true);
      transitionRef.current = window.setTimeout(() => {
        setFeedback('');
        setLocked(false);
      }, 650);
    }
  };

  const classifyPathogen = (type: 'virus' | 'bacteria') => {
    if (!currentClassify || locked) return;

    const isCorrect = currentClassify.pathogenType === type;

    if (!isCorrect) {
      setPenalty((value) => value + 4);
      setFeedback('분류 실패 · -4 SEC');
      setLocked(true);
      transitionRef.current = window.setTimeout(() => {
        setFeedback('');
        setLocked(false);
      }, 600);
      return;
    }

    setScore((value) => value + 120);
    setFeedback('PATHOGEN CLASSIFIED · +120');
    setLocked(true);

    transitionRef.current = window.setTimeout(() => {
      setFeedback('');
      setLocked(false);

      if (classifyIndex >= classifyDeck.length - 1) {
        setStage('sequence');
      } else {
        setClassifyIndex((value) => value + 1);
      }
    }, 550);
  };

  const chooseSequenceStep = (step: string) => {
    if (locked || sequenceProgress.includes(step)) return;

    const expected = RESEARCH_SEQUENCE[sequenceProgress.length];

    if (step !== expected) {
      setPenalty((value) => value + 3);
      setFeedback('순서 오류 · -3 SEC · 연구 흐름을 다시 판단하세요');
      setSequenceProgress([]);
      setLocked(true);
      transitionRef.current = window.setTimeout(() => {
        setFeedback('');
        setLocked(false);
      }, 650);
      return;
    }

    const nextProgress = [...sequenceProgress, step];
    setSequenceProgress(nextProgress);
    setScore((value) => value + 70);

    if (nextProgress.length === RESEARCH_SEQUENCE.length) {
      setFeedback('RESEARCH FLOW COMPLETE · +210');
      setLocked(true);
      transitionRef.current = window.setTimeout(() => {
        setFeedback('');
        setLocked(false);
        setStage('pocket');
      }, 700);
    }
  };

  const choosePocket = (choice: 'A' | 'B' | 'C') => {
    if (locked) return;
    setPocketChoice(choice);

    if (choice === 'B') {
      setScore((value) => value + 250);
      setFeedback('BINDING SITE FOUND · +250');
      setLocked(true);
      transitionRef.current = window.setTimeout(() => {
        setFeedback('');
        setLocked(false);
        setStage('candidate');
      }, 700);
    } else {
      setPenalty((value) => value + 5);
      setFeedback('SITE NOT MATCHED · -5 SEC');
      setLocked(true);
      transitionRef.current = window.setTimeout(() => {
        setFeedback('');
        setLocked(false);
      }, 650);
    }
  };

  const secureCandidate = () => {
    if (candidateIndex === null) return;
    setScore((value) => value + 300 + remaining * 4);
    setStage('escape');
  };

  return (
    <div className={`lh4-root stage-${stage}`}>
      <div className="lh4-canvas">
        <img className="lh4-reference" src={STAGE_IMAGE[stage]} alt="" />
        <div className="lh4-bloodwash" />
        <div className="lh4-biohazard-glow" />

        {stage !== 'briefing' && stage !== 'success' && (
          <ZombieMapFX outbreak={outbreak} remaining={remaining} stage={stage} />
        )}

        {stage !== 'briefing' && stage !== 'success' && stage !== 'fail' && (
          <div className="lh4-live-hud">
            <div>
              <small>TIME LEFT</small>
              <strong>{formatTime(remaining)}</strong>
            </div>
            <div>
              <small>OUTBREAK</small>
              <strong>{outbreak}%</strong>
            </div>
            <div>
              <small>SCORE</small>
              <strong>{String(score).padStart(4, '0')}</strong>
            </div>
          </div>
        )}

        {stage === 'briefing' && (
          <section className="lh4-briefing-overlay">
            {briefingPage === 'booth' ? (
              <>
                <div className="lh4-briefing-kicker">MISSION 00 · BEFORE THE TIMER</div>
                <h1>BioDockLab은 무엇을 체험하나요?</h1>
                <p className="lh4-briefing-lead">
                  BioDockLab은 실제 공개 단백질 구조(PDB)를 관찰하고, 감염병 지식을 단서로 퀴즈·기억·분류·순서·결합 부위 탐색을 거쳐
                  다음 연구 후보를 결정하는 90초 바이오 방탈출입니다. 이 부스 설명 자체도 랜덤 문제에 출제될 수 있습니다.
                </p>
                <div className="lh4-booth-grid">
                  <article><b>01</b><strong>부스 + 감염병 지식</strong><span>부스 목적, ZVX-26 설정, 감염병 도감 내용이 랜덤 문제로 출제됩니다.</span></article>
                  <article><b>02</b><strong>실제 PDB 구조</strong><span>실제 공개 3D 단백질을 눈으로 관찰합니다.</span></article>
                  <article><b>03</b><strong>미니게임</strong><span>1000문제 풀에서 OX·객관식·주관식이 랜덤 출제되고, 1초 기억·분류·순서·포켓 탐색으로 이어집니다.</span></article>
                  <article><b>04</b><strong>연구 의사결정</strong><span>가짜 약효 점수 없이 다음 연구 후보를 선택합니다.</span></article>
                </div>
                <div className="lh4-briefing-warning">
                  ZVX-26은 가상의 좀비 바이러스입니다. 실제 감염병과 실제 공개 구조 데이터는 교육용 단서로만 사용합니다.
                </div>
                <button className="lh4-briefing-next" onClick={() => setBriefingPage('archive')}>
                  감염병 도감 확인 →
                </button>
              </>
            ) : (
              <>
                <div className="lh4-briefing-kicker">INFECTIOUS DISEASE ARCHIVE · READ BEFORE PLAY</div>
                <h1>도감 + 부스 설명에서 10문제가 랜덤 출제됩니다</h1>
                <div className="lh4-archive-grid">
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
                <div className="lh4-archive-footer">
                  <button className="lh4-briefing-back" onClick={() => setBriefingPage('booth')}>← 부스 설명</button>
                  <button className="lh4-start-mission" onClick={startMission}>
                    브리핑 완료 · 01:30 START →
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {stage === 'quiz' && round && (
          <section className="lh4-quiz-panel">
            <div className="lh4-quiz-meta">
              <span>QUESTION {questionIndex + 1} / 10</span>
              <b>정답 {correctCount} · PASS {PASS_COUNT}</b>
              <i>
                {round.type === 'short'
                  ? '주관식'
                  : round.type === 'ox'
                  ? 'O / X'
                  : '4지선다'}
              </i>
            </div>

            <div className="lh4-quiz-briefing">
              {round.briefing}
            </div>

            <h2>{round.question}</h2>

            {round.type === 'short' ? (
              <form className="lh4-short-form" onSubmit={submitShortAnswer}>
                <input
                  autoFocus
                  value={typedAnswer}
                  onChange={(event) => setTypedAnswer(event.target.value)}
                  placeholder="정답을 직접 입력하세요"
                  disabled={locked}
                />
                <button type="submit" disabled={locked || !typedAnswer.trim()}>
                  ANSWER ↵
                </button>
              </form>
            ) : round.type === 'ox' ? (
              <div className="lh4-ox-grid">
                <button disabled={locked} onClick={() => answerBankQuestion('O')}>O<span>그렇다</span></button>
                <button disabled={locked} onClick={() => answerBankQuestion('X')}>X<span>아니다</span></button>
              </div>
            ) : (
              <div className="lh4-choice-grid">
                {(round.options ?? []).map((option, index) => (
                  <button
                    key={`${option}-${index}`}
                    disabled={locked}
                    onClick={() => answerBankQuestion(index)}
                  >
                    <b>{String.fromCharCode(65 + index)}</b>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {stage === 'memory' && memoryVisible && (
          <>
            <div className="lh4-memory-view">
              <Protein3DViewer target={target} />
            </div>
            <div className="lh4-memory-flash">1 SECOND</div>
          </>
        )}

        {stage === 'match' && (
          <div className="lh4-match-grid">
            {matchOrder.map((id, index) => (
              <button key={id} disabled={locked} onClick={() => chooseMatch(id)}>
                <b>{String.fromCharCode(65 + index)}</b>
                <div><Protein3DViewer target={dockingTargets[id]} compact /></div>
                <span>FLASH SAMPLE {String.fromCharCode(65 + index)}</span>
              </button>
            ))}
          </div>
        )}

        {stage === 'classify' && currentClassify && (
          <section className="lh4-mini-panel lh4-classify-panel">
            <small>MINI GAME · PATHOGEN CLASSIFIER</small>
            <h2>이 감염병의 병원체는 바이러스일까, 세균일까?</h2>
            <div className="lh4-classify-card">
              <strong>{currentClassify.name}</strong>
              <span>{currentClassify.summary}</span>
              <i>{classifyIndex + 1} / {classifyDeck.length}</i>
            </div>
            <div className="lh4-classify-buttons">
              <button onClick={() => classifyPathogen('virus')} disabled={locked}>VIRUS<span>바이러스</span></button>
              <button onClick={() => classifyPathogen('bacteria')} disabled={locked}>BACTERIA<span>세균</span></button>
            </div>
          </section>
        )}

        {stage === 'sequence' && (
          <section className="lh4-mini-panel lh4-sequence-panel">
            <small>MINI GAME · RESEARCH ORDER</small>
            <h2>연구 흐름을 올바른 순서로 클릭하세요</h2>
            <p>구조 확인 → 결합 공간 탐색 → 다음 연구 후보 지정</p>
            <div className="lh4-sequence-grid">
              {sequenceDeck.map((step, index) => {
                const selectedIndex = sequenceProgress.indexOf(step);
                return (
                  <button
                    key={step}
                    className={selectedIndex >= 0 ? 'selected' : ''}
                    disabled={locked || selectedIndex >= 0}
                    onClick={() => chooseSequenceStep(step)}
                  >
                    <b>{selectedIndex >= 0 ? selectedIndex + 1 : '?'}</b>
                    <span>{step}</span>
                    <small>CARD {index + 1}</small>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {stage === 'pocket' && (
          <div className="lh4-pocket-zone">
            <div className="lh4-pocket-view"><Protein3DViewer target={target} /></div>
            {(['A', 'B', 'C'] as const).map((label) => (
              <button
                key={label}
                className={`lh4-pocket-marker marker-${label.toLowerCase()} ${pocketChoice === label ? 'chosen' : ''}`}
                disabled={locked}
                onClick={() => choosePocket(label)}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {stage === 'candidate' && (
          <section className="lh4-candidate-panel">
            <div className="lh4-candidate-grid">
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
            <button
              className="lh4-secure-button"
              disabled={candidateIndex === null}
              onClick={secureCandidate}
            >
              SECURE CANDIDATE →
            </button>
          </section>
        )}

        {stage === 'escape' && (
          <div className="lh4-escape-overlay">
            <div className="lh4-escape-runner">🧑‍🔬🧪</div>
            <strong>EVACUATING...</strong>
          </div>
        )}

        {stage === 'success' && (
          <button className="lh4-next-button" onClick={resetMission}>
            NEXT RESEARCHER →
          </button>
        )}

        {stage === 'fail' && (
          <>
            <div className="lh4-fail-reason">{failReason}</div>
            <button className="lh4-retry-button" onClick={startMission}>
              RETRY MISSION →
            </button>
          </>
        )}

        {feedback && !['success', 'fail'].includes(stage) && (
          <div
            className={`lh4-feedback ${
              feedback.includes('오답') ||
              feedback.includes('실패') ||
              feedback.includes('WRONG') ||
              feedback.includes('오류') ||
              feedback.includes('NOT MATCHED')
                ? 'bad'
                : 'good'
            }`}
          >
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}
