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
  | 'classify'
  | 'sequence'
  | 'pocket'
  | 'candidate'
  | 'escape'
  | 'success'
  | 'fail';

type BriefingPage = 'booth' | 'archive';

type ShortAnswerQuestion = {
  id: string;
  difficulty: 'normal' | 'hard';
  briefing: string;
  question: string;
  answers: string[];
  explanation: string;
};

type QuizRound =
  | {
      kind: 'bank';
      question: LastHopeQuestion;
    }
  | {
      kind: 'short';
      question: ShortAnswerQuestion;
    };

const TOTAL_SECONDS = 90;
const PASS_COUNT = 7;

const TARGET_IDS: DeepDiveProteinId[] = [
  'sars2-mpro',
  'mers-mpro',
  'h1n1-neuraminidase',
];

const SHORT_ANSWER_POOL: ShortAnswerQuestion[] = [
  {
    id: 'short-covid-pathogen',
    difficulty: 'normal',
    briefing:
      'COVID-19은 SARS-CoV-2라는 코로나바이러스에 의해 발생합니다.',
    question:
      'COVID-19의 원인 바이러스 이름을 입력하세요.',
    answers: [
      'sars-cov-2',
      'sars cov 2',
      'sarscov2',
      '사스코로나바이러스2',
    ],
    explanation:
      'COVID-19의 원인 바이러스는 SARS-CoV-2입니다.',
  },
  {
    id: 'short-mers-year',
    difficulty: 'normal',
    briefing:
      'MERS-CoV는 2012년에 처음 확인되었습니다.',
    question:
      'MERS-CoV가 처음 확인된 연도를 숫자로 입력하세요.',
    answers: ['2012', '2012년'],
    explanation:
      'MERS-CoV는 2012년에 처음 확인되었습니다.',
  },
  {
    id: 'short-h1n1',
    difficulty: 'normal',
    briefing:
      '2009년 세계적으로 유행한 인플루엔자 A 아형은 H1N1이었습니다.',
    question:
      '2009년 신종플루와 관련된 인플루엔자 아형을 입력하세요.',
    answers: ['h1n1', 'h1n1pdm09', 'influenzaah1n1'],
    explanation:
      '2009년 신종 인플루엔자는 A(H1N1)pdm09 계열과 관련됩니다.',
  },
  {
    id: 'short-tb-type',
    difficulty: 'hard',
    briefing:
      '결핵은 바이러스가 아니라 결핵균이라는 세균에 의해 발생합니다.',
    question:
      '결핵을 일으키는 병원체의 종류를 입력하세요.',
    answers: ['세균', '박테리아', 'bacteria', 'bacterium'],
    explanation:
      '결핵은 바이러스성 질환이 아니라 세균성 감염병입니다.',
  },
  {
    id: 'short-ligand',
    difficulty: 'hard',
    briefing:
      '단백질과 결합하는 분자를 구조 연구에서는 ligand라고 부르기도 합니다.',
    question:
      '단백질과 결합하는 분자를 부르는 용어를 입력하세요.',
    answers: ['리간드', 'ligand'],
    explanation:
      '단백질 등과 결합하는 분자를 리간드라고 부릅니다.',
  },
  {
    id: 'short-pdb',
    difficulty: 'hard',
    briefing:
      'Protein Data Bank는 단백질 등 생체분자의 3차원 구조를 제공하는 대표적인 공개 데이터베이스입니다.',
    question:
      'Protein Data Bank의 약자를 입력하세요.',
    answers: ['pdb'],
    explanation:
      'Protein Data Bank의 약자는 PDB입니다.',
  },
  {
    id: 'short-vzv',
    difficulty: 'hard',
    briefing:
      '수두는 Varicella-zoster virus에 의해 발생합니다.',
    question:
      '수두-대상포진 바이러스의 대표 약자를 입력하세요.',
    answers: ['vzv'],
    explanation:
      'Varicella-zoster virus는 흔히 VZV라고 표기합니다.',
  },
  {
    id: 'short-noro',
    difficulty: 'normal',
    briefing:
      '노로바이러스는 급성 위장관염의 흔한 원인 중 하나입니다.',
    question:
      '급성 위장관염의 흔한 원인 중 하나인 바이러스 이름을 입력하세요.',
    answers: ['노로바이러스', 'norovirus', 'noro'],
    explanation:
      '노로바이러스는 급성 위장관염의 흔한 원인 중 하나입니다.',
  },
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

function placeCorrectOption(
  question: LastHopeQuestion,
  desiredIndex: number,
): LastHopeQuestion {
  if (
    question.type !== 'choice' ||
    !question.options ||
    typeof question.answer !== 'number'
  ) {
    return question;
  }

  const correct = question.options[question.answer];
  const distractors = shuffled(
    question.options.filter((_, index) => index !== question.answer),
  );

  const options = [...distractors];
  const safeIndex = Math.min(desiredIndex, options.length);
  options.splice(safeIndex, 0, correct);

  return {
    ...question,
    options,
    answer: safeIndex,
  };
}

function makeQuizRounds(): QuizRound[] {
  const oxPool = shuffled(
    lastHopeQuestions.filter(
      (question) =>
        question.type === 'ox' &&
        question.difficulty !== 'easy',
    ),
  );

  const choicePool = shuffled(
    lastHopeQuestions.filter(
      (question) =>
        question.type === 'choice' &&
        question.difficulty !== 'easy',
    ),
  );

  const fallbackOx = shuffled(
    lastHopeQuestions.filter((question) => question.type === 'ox'),
  );

  const fallbackChoice = shuffled(
    lastHopeQuestions.filter((question) => question.type === 'choice'),
  );

  const ox = [...oxPool, ...fallbackOx].slice(0, 3);
  const choices = [...choicePool, ...fallbackChoice].slice(0, 4);

  const correctPositions = shuffled([0, 1, 2, 3]);

  const preparedChoices = choices.map((question, index) =>
    placeCorrectOption(
      question,
      correctPositions[index % correctPositions.length],
    ),
  );

  const short = shuffled(SHORT_ANSWER_POOL).slice(0, 3);

  return shuffled([
    ...ox.map((question) => ({
      kind: 'bank' as const,
      question,
    })),
    ...preparedChoices.map((question) => ({
      kind: 'bank' as const,
      question,
    })),
    ...short.map((question) => ({
      kind: 'short' as const,
      question,
    })),
  ]);
}

export default function LastHopeGameV4() {
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
    if (!round || round.kind !== 'bank' || locked || feedback) return;

    const isCorrect = round.question.answer === value;

    if (isCorrect) {
      setCorrectCount((value) => value + 1);
      setScore((value) => value + 100);
      setFeedback(`정답 · +100 · ${round.question.explanation}`);
      goToNextRound(true);
    } else {
      setPenalty((value) => value + 3);
      setFeedback(`오답 · -3 SEC · ${round.question.explanation}`);
      goToNextRound(false);
    }
  };

  const submitShortAnswer = (event: FormEvent) => {
    event.preventDefault();

    if (!round || round.kind !== 'short' || locked || feedback) return;

    const normalized = normalizeAnswer(typedAnswer);
    const isCorrect = round.question.answers.some(
      (answer) => normalizeAnswer(answer) === normalized,
    );

    if (isCorrect) {
      setCorrectCount((value) => value + 1);
      setScore((value) => value + 150);
      setFeedback(`주관식 정답 · +150 · ${round.question.explanation}`);
      goToNextRound(true);
    } else {
      setPenalty((value) => value + 4);
      setFeedback(`주관식 오답 · -4 SEC · ${round.question.explanation}`);
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
                  실제 공개 단백질 구조를 관찰하고, 감염병 지식을 단서로 퀴즈·기억·분류·순서·결합 부위 탐색을 거쳐
                  다음 연구 후보를 결정하는 90초 바이오 방탈출입니다.
                </p>
                <div className="lh4-booth-grid">
                  <article><b>01</b><strong>감염병 지식</strong><span>브리핑에서 읽은 정보가 랜덤 문제로 출제됩니다.</span></article>
                  <article><b>02</b><strong>실제 PDB 구조</strong><span>실제 공개 3D 단백질을 눈으로 관찰합니다.</span></article>
                  <article><b>03</b><strong>미니게임</strong><span>OX·객관식·주관식·1초 기억·분류·순서·포켓 탐색이 섞입니다.</span></article>
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
                <h1>이 정보가 10문제에 나옵니다</h1>
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
                {round.kind === 'short'
                  ? '주관식'
                  : round.question.type === 'ox'
                  ? 'O / X'
                  : '4지선다'}
              </i>
            </div>

            <div className="lh4-quiz-briefing">
              {round.question.briefing}
            </div>

            <h2>{round.question.question}</h2>

            {round.kind === 'short' ? (
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
            ) : round.question.type === 'ox' ? (
              <div className="lh4-ox-grid">
                <button disabled={locked} onClick={() => answerBankQuestion('O')}>O<span>그렇다</span></button>
                <button disabled={locked} onClick={() => answerBankQuestion('X')}>X<span>아니다</span></button>
              </div>
            ) : (
              <div className="lh4-choice-grid">
                {(round.question.options ?? []).map((option, index) => (
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
