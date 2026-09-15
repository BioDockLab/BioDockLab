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
  | 'recruit'
  | 'briefing'
  | 'quiz'
  | 'memory'
  | 'match'
  | 'classify'
  | 'sequence'
  | 'pocket'
  | 'candidate'
  | 'route'
  | 'escape'
  | 'success'
  | 'fail';

type BriefingPage = 'booth' | 'archive';

type QuizRound = MegaQuestion;


type CareerRoleId =
  | 'bio-ai'
  | 'bio-data'
  | 'digital-health'
  | 'rnd-pm';

type CareerRole = {
  id: CareerRoleId;
  title: string;
  english: string;
  description: string;
  skill: string;
};

type LeaderboardEntry = {
  id: string;
  nickname: string;
  roleId: CareerRoleId;
  roleTitle: string;
  score: number;
  remaining: number;
  correct: number;
  playedAt: string;
};

type EscapeRouteOption = {
  id: string;
  title: string;
  subtitle: string;
  risk: number;
  icon: string;
};

const CAREER_ROLES: CareerRole[] = [
  {
    id: 'bio-ai',
    title: 'AI · 바이오융합 연구원',
    english: 'AI BIO RESEARCHER',
    description: '단백질 구조와 AI·데이터를 연결해 연구 문제를 탐색합니다.',
    skill: 'STRUCTURE · AI · DISCOVERY',
  },
  {
    id: 'bio-data',
    title: '바이오 데이터 연구원',
    english: 'BIO DATA RESEARCHER',
    description: '감염병·PDB·실험 데이터를 읽고 의미 있는 단서를 찾습니다.',
    skill: 'DATA · PDB · ANALYSIS',
  },
  {
    id: 'digital-health',
    title: '디지털 헬스케어 연구원',
    english: 'DIGITAL HEALTH RESEARCHER',
    description: '의료와 소프트웨어를 연결해 더 나은 헬스케어 시스템을 설계합니다.',
    skill: 'HEALTH · SOFTWARE · UX',
  },
  {
    id: 'rnd-pm',
    title: '융합 R&D 프로젝트 매니저',
    english: 'R&D PROJECT MANAGER',
    description: '여러 전공의 연구원을 연결하고 기술 프로젝트의 목표와 실행을 설계합니다.',
    skill: 'PLAN · CONNECT · EXECUTE',
  },
];

const LEADERBOARD_KEY = 'biodocklab-last-hope-leaderboard-v1';

const TOTAL_SECONDS = 90;
const PASS_COUNT = 7;

const TARGET_IDS: DeepDiveProteinId[] = [
  'sars2-mpro',
  'mers-mpro',
  'h1n1-neuraminidase',
];


const STAGE_IMAGE: Record<Stage, string> = {
  recruit: '/last-hope/briefing.png',
  briefing: '/last-hope/briefing.png',
  quiz: '/last-hope/quiz.png',
  memory: '/last-hope/memory.png',
  match: '/last-hope/match.png',
  classify: '/last-hope/quiz.png',
  sequence: '/last-hope/quiz.png',
  pocket: '/last-hope/pocket.png',
  candidate: '/last-hope/candidate.png',
  route: '/last-hope/candidate.png',
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


function readLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = window.localStorage.getItem(LEADERBOARD_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function rankLeaderboard(entries: LeaderboardEntry[]) {
  return [...entries]
    .sort((a, b) => b.score - a.score || b.remaining - a.remaining || b.correct - a.correct)
    .slice(0, 30);
}

function safeNickname(value: string) {
  return value.replace(/[<>]/g, '').trim().slice(0, 12);
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
    const categoryPool = megaQuestionPool.filter(
      (question) =>
        question.category === category &&
        !usedFamilies.has(question.family),
    );

    // V7: slightly easier than V6. EASY first, then NORMAL. HARD is only emergency fallback.
    const ranked = [
      ...shuffled(categoryPool.filter((q) => q.difficulty === 'easy' && !recent.has(q.id) && !recentFamilies.has(q.family))),
      ...shuffled(categoryPool.filter((q) => q.difficulty === 'normal' && !recent.has(q.id) && !recentFamilies.has(q.family))),
      ...shuffled(categoryPool.filter((q) => q.difficulty === 'easy')),
      ...shuffled(categoryPool.filter((q) => q.difficulty === 'normal')),
      ...shuffled(categoryPool.filter((q) => q.difficulty === 'hard')),
    ];

    for (const question of ranked) {
      if (selected.filter((item) => item.category === category).length >= count) break;
      if (usedFamilies.has(question.family)) continue;

      // Keep direct typing as a special challenge, not the dominant question type.
      if (
        question.type === 'short' &&
        selected.filter((item) => item.type === 'short').length >= 1
      ) continue;

      // O/X gives visitors a quick recovery question under time pressure.
      if (
        question.type === 'ox' &&
        selected.filter((item) => item.type === 'ox').length >= 3
      ) continue;

      selected.push(question);
      usedFamilies.add(question.family);
    }
  };

  choose('booth', 2);
  choose('infection', 4);
  choose('structure', 2);
  choose('research', 2);

  if (selected.length < 10) {
    for (const question of shuffled(megaQuestionPool)) {
      if (selected.length >= 10) break;
      if (usedFamilies.has(question.family)) continue;
      if (question.type === 'short' && selected.some((item) => item.type === 'short')) continue;
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

function mapStageProgress(stage: Stage) {
  switch (stage) {
    case 'recruit':
      return 0;
    case 'quiz':
      return 0.08;
    case 'memory':
      return 0.24;
    case 'match':
      return 0.36;
    case 'classify':
      return 0.46;
    case 'sequence':
      return 0.56;
    case 'pocket':
      return 0.67;
    case 'candidate':
      return 0.80;
    case 'route':
      return 0.86;
    case 'escape':
      return 0.88;
    case 'success':
      return 1;
    case 'fail':
      return 0.82;
    default:
      return 0;
  }
}

function pointOnRoute(progress: number) {
  const route = [
    { x: 18, y: 71 },
    { x: 32, y: 63 },
    { x: 48, y: 57 },
    { x: 63, y: 47 },
    { x: 77, y: 37 },
    { x: 88, y: 25 },
  ];

  const safe = Math.max(0, Math.min(1, progress));
  const scaled = safe * (route.length - 1);
  const index = Math.min(route.length - 2, Math.floor(scaled));
  const t = scaled - index;
  const a = route[index];
  const b = route[index + 1];

  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

function LiveCitySimulation({
  outbreak,
  remaining,
  stage,
  escapeProgress,
}: {
  outbreak: number;
  remaining: number;
  stage: Stage;
  escapeProgress: number;
}) {
  const maxZombies = 26;
  const count =
    stage === 'fail'
      ? maxZombies
      : Math.min(maxZombies, 3 + Math.floor(outbreak / 4.2));

  const wave = Math.min(
    9,
    1 + Math.floor((TOTAL_SECONDS - remaining) / 10),
  );

  const infectionProgress = Math.min(1, outbreak / 100);
  const baseMissionProgress = mapStageProgress(stage);
  const missionProgress =
    stage === 'escape'
      ? 0.88 + escapeProgress * 0.12
      : baseMissionProgress;

  const researcher = pointOnRoute(missionProgress);
  const safeRadius = Math.max(8, 24 - outbreak * 0.14);
  const threatDistance = Math.max(1, Math.round(10 - infectionProgress * 8));

  const status =
    outbreak < 25
      ? '외곽 감염 감지'
      : outbreak < 45
      ? '좀비 무리 도심 진입'
      : outbreak < 65
      ? '주요 도로 봉쇄 시작'
      : outbreak < 80
      ? '분석 구역 방어선 붕괴'
      : outbreak < 92
      ? '연구원 추적 개체 급증'
      : 'LAB OVERRUN 임박';

  const districts = [
    { label: '연구소', x: 18, y: 71, stage: 0 },
    { label: '분석실', x: 42, y: 58, stage: 1 },
    { label: '약물 보관실', x: 68, y: 43, stage: 2 },
    { label: '탈출구', x: 88, y: 25, stage: 3 },
  ];

  return (
    <div
      className={`lh6-map-sim outbreak-${Math.min(4, Math.floor(outbreak / 25))}`}
      aria-hidden="true"
    >
      <div className="lh6-map-red-zone" style={{ opacity: 0.10 + infectionProgress * 0.76 }} />
      <div
        className="lh6-map-safe-aura"
        style={{
          left: `${researcher.x}%`,
          top: `${researcher.y}%`,
          width: `${safeRadius}%`,
          height: `${safeRadius}%`,
          opacity: Math.max(0.16, 0.86 - infectionProgress * 0.55),
        }}
      />

      <svg className="lh6-route-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="lh6-route-shadow" d="M18 71 C27 67 32 64 42 58 S58 50 68 43 S80 31 88 25" />
        <path className="lh6-route-line" d="M18 71 C27 67 32 64 42 58 S58 50 68 43 S80 31 88 25" />
      </svg>

      {districts.map((district, index) => {
        const passed = missionProgress >= [0.08, 0.36, 0.67, 0.96][index];
        return (
          <div
            key={district.label}
            className={`lh6-district ${passed ? 'passed' : ''}`}
            style={{ left: `${district.x}%`, top: `${district.y}%` }}
          >
            <i>{index === 0 ? '⌂' : index === 1 ? '⌕' : index === 2 ? '◆' : '↗'}</i>
            <span>{district.label}</span>
          </div>
        );
      })}

      <div className="lh6-map-status">
        <small>ZVX-26 LIVE CITY SIMULATION</small>
        <strong>WAVE {wave} · {status}</strong>
        <span>접근 개체 {count} · 최근접 위협 약 {threatDistance}블록</span>
      </div>

      <div
        key={`pulse-${remaining}`}
        className="lh6-second-pulse"
        style={{ left: `${researcher.x}%`, top: `${researcher.y}%` }}
      />

      <div
        className={`lh6-researcher ${stage === 'escape' ? 'escaping' : ''}`}
        style={{ left: `${researcher.x}%`, top: `${researcher.y}%` }}
      >
        <div className="lh6-researcher-avatar">🧑‍🔬</div>
        <b>YOU</b>
        <span>{stage === 'escape' ? 'RUN!' : '연구원 이동 중'}</span>
      </div>

      {Array.from({ length: count }).map((_, index) => {
        const lane = index % 8;
        const ring = Math.floor(index / 8);
        const startX = 96 - lane * 3.2;
        const startY = 14 + ((index * 17) % 72);
        const threshold = 0.03 + index * 0.018;
        const local = Math.max(0, Math.min(1, (infectionProgress - threshold) / (1 - threshold)));
        const pressure = 0.34 + local * 0.66;
        const targetX = researcher.x + 5 + ((lane % 3) - 1) * (5 + ring * 1.5);
        const targetY = researcher.y + ((lane % 5) - 2) * 4.4;
        const left = startX + (targetX - startX) * pressure;
        const top = startY + (targetY - startY) * pressure;

        return (
          <span
            key={index}
            className={`lh6-zombie ${local > 0.78 ? 'close' : ''}`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              fontSize: `${17 + (index % 5) * 2.2}px`,
              opacity: 0.32 + local * 0.67,
              animationDelay: `${(index % 9) * -0.09}s`,
            }}
          >
            🧟
          </span>
        );
      })}

      {outbreak >= 48 && <div className="lh6-barricade barricade-a">ROAD BLOCK</div>}
      {outbreak >= 66 && <div className="lh6-barricade barricade-b">BREACHED</div>}
      {outbreak >= 82 && <div className="lh6-barricade barricade-c">⚠</div>}

      {outbreak >= 58 && <div className="lh6-siren siren-a">!</div>}
      {outbreak >= 73 && <div className="lh6-siren siren-b">!</div>}
      {outbreak >= 88 && <div className="lh6-siren siren-c">!</div>}

      {remaining <= 10 && stage !== 'fail' && (
        <div key={`countdown-${remaining}`} className="lh6-map-countdown">
          {remaining}
        </div>
      )}

      {stage === 'fail' && (
        <div className="lh6-map-overrun">
          <strong>CITY LOST</strong>
          <span>감염 구역 100% · 탈출 경로 차단</span>
        </div>
      )}
    </div>
  );
}

export default function LastHopeGameV7() {
  const [stage, setStage] = useState<Stage>('recruit');
  const [briefingPage, setBriefingPage] = useState<BriefingPage>('booth');
  const [nickname, setNickname] = useState('');
  const [roleId, setRoleId] = useState<CareerRoleId | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => readLeaderboard());
  const [personalRank, setPersonalRank] = useState<number | null>(null);
  const [routeOptions, setRouteOptions] = useState<EscapeRouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
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
  const [escapeProgress, setEscapeProgress] = useState(0);

  const transitionRef = useRef<number | null>(null);
  const successSavedRef = useRef(false);

  const target = dockingTargets[targetId];
  const candidates = dockingResultByProteinId(targetId)?.candidates ?? [];
  const selectedRole = CAREER_ROLES.find((role) => role.id === roleId) ?? null;
  const round = rounds[questionIndex];

  const outbreak = useMemo(() => {
    if (stage === 'recruit' || stage === 'briefing') return 12;
    if (stage === 'fail') return 100;
    return Math.min(
      99,
      Math.round(
        12 +
          ((TOTAL_SECONDS - remaining) / TOTAL_SECONDS) * 88,
      ),
    );
  }, [remaining, stage]);

  const running = !['recruit', 'briefing', 'success', 'fail'].includes(stage);

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

    setEscapeProgress(0);
    const started = Date.now();

    const timer = window.setInterval(() => {
      const progress = Math.min(1, (Date.now() - started) / 2800);
      setEscapeProgress(progress);

      if (progress >= 1) {
        window.clearInterval(timer);
        setStage('success');
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'success' || successSavedRef.current) return;
    const cleanName = safeNickname(nickname) || 'RESEARCHER';
    const role = selectedRole ?? CAREER_ROLES[0];
    const entry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nickname: cleanName,
      roleId: role.id,
      roleTitle: role.title,
      score,
      remaining,
      correct: correctCount,
      playedAt: new Date().toISOString(),
    };
    const ranked = rankLeaderboard([entry, ...readLeaderboard()]);
    try {
      window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(ranked));
    } catch {
      // kiosk ranking still renders in memory when storage is unavailable
    }
    setLeaderboard(ranked);
    setPersonalRank(ranked.findIndex((item) => item.id === entry.id) + 1);
    successSavedRef.current = true;
  }, [stage, nickname, selectedRole, score, remaining, correctCount]);

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
    setStage('recruit');
    setBriefingPage('booth');
    setNickname('');
    setRoleId(null);
    setPersonalRank(null);
    successSavedRef.current = false;
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
    setSelectedRoute(null);
    setRouteOptions([]);
    setEscapeProgress(0);
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
    setSelectedRoute(null);
    const baseRoutes: EscapeRouteOption[] = [
      { id: 'river', title: '강변 의료도로', subtitle: '넓지만 감염 구역과 가깝습니다.', risk: 1, icon: '≋' },
      { id: 'sky', title: '스카이브리지', subtitle: '거리는 짧지만 병목 구간이 있습니다.', risk: 2, icon: '⌁' },
      { id: 'service', title: '연구소 서비스 터널', subtitle: '우회하지만 차폐 구간이 많습니다.', risk: 3, icon: '▰' },
    ];
    const riskOrder = shuffled([1, 2, 3]);
    setRouteOptions(shuffled(baseRoutes.map((route, index) => ({ ...route, risk: riskOrder[index] }))));
    successSavedRef.current = false;
    setEscapeProgress(0);
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
      setPenalty((value) => value + 2);
      setFeedback(`오답 · -2 SEC · ${round.explanation}`);
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
      setPenalty((value) => value + 3);
      setFeedback(`주관식 오답 · -3 SEC · ${round.explanation}`);
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
    setEscapeProgress(0);
    setStage('route');
  };

  const chooseEscapeRoute = (route: EscapeRouteOption) => {
    if (locked) return;
    setSelectedRoute(route.id);
    const safestRisk = Math.min(...routeOptions.map((item) => item.risk));

    if (route.risk === safestRisk) {
      setScore((value) => value + 180);
      setFeedback('SAFE ROUTE FOUND · +180');
      setLocked(true);
      transitionRef.current = window.setTimeout(() => {
        setFeedback('');
        setLocked(false);
        setStage('escape');
      }, 650);
      return;
    }

    setPenalty((value) => value + 3);
    setFeedback('ZOMBIE BLOCKADE · -3 SEC · 다른 경로를 선택하세요');
    setLocked(true);
    transitionRef.current = window.setTimeout(() => {
      setFeedback('');
      setLocked(false);
    }, 650);
  };

  return (
    <div className={`lh4-root stage-${stage}`}>
      <div className="lh4-canvas">
        <img className="lh4-reference" src={STAGE_IMAGE[stage]} alt="" />
        <div className="lh4-bloodwash" />
        <div className="lh4-biohazard-glow" />

        {stage !== 'recruit' && stage !== 'briefing' && stage !== 'success' && (
          <LiveCitySimulation outbreak={outbreak} remaining={remaining} stage={stage} escapeProgress={escapeProgress} />
        )}

        {stage !== 'recruit' && stage !== 'briefing' && stage !== 'success' && stage !== 'fail' && (
          <div className="lh4-live-hud">
            <div className="lh7-researcher-chip">
              <small>RESEARCHER</small>
              <strong>{safeNickname(nickname) || 'RESEARCHER'}</strong>
              <span>{selectedRole?.title ?? 'NEXUS 연구원'}</span>
            </div>
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

        {stage === 'recruit' && (
          <section className="lh7-recruit-overlay">
            <div className="lh7-recruit-main">
              <div className="lh7-kicker">NEXUS × BioDockLab · FUTURE RESEARCHER REGISTRATION</div>
              <h1>NEXUS의 미래 연구원이 되어<br /><strong>LAST HOPE</strong>에 참여하세요</h1>
              <p>
                닉네임과 미래 직업을 선택하면, 오늘의 역할로 90초 연구 미션에 투입됩니다.
                직업 선택은 결과 화면과 랭킹에 함께 기록됩니다.
              </p>

              <label className="lh7-name-field">
                <span>RESEARCHER NICKNAME</span>
                <input
                  value={nickname}
                  onChange={(event) => setNickname(safeNickname(event.target.value))}
                  placeholder="닉네임 입력 · 최대 12자"
                  maxLength={12}
                  autoFocus
                />
              </label>

              <div className="lh7-career-title">
                <span>FUTURE CAREER</span>
                <b>어떤 NEXUS 연구원이 될까요?</b>
              </div>

              <div className="lh7-career-grid">
                {CAREER_ROLES.map((role, index) => (
                  <button
                    key={role.id}
                    type="button"
                    className={roleId === role.id ? 'selected' : ''}
                    onClick={() => setRoleId(role.id)}
                  >
                    <i>{String(index + 1).padStart(2, '0')}</i>
                    <small>{role.english}</small>
                    <strong>{role.title}</strong>
                    <span>{role.description}</span>
                    <b>{role.skill}</b>
                  </button>
                ))}
              </div>

              <button
                className="lh7-register-button"
                disabled={!safeNickname(nickname) || roleId === null}
                onClick={() => setStage('briefing')}
              >
                NEXUS 연구원 등록 · 브리핑 입장 →
              </button>
            </div>

            <aside className="lh7-ranking-preview">
              <small>LIVE RESEARCHER RANKING</small>
              <h2>오늘의 TOP 연구원</h2>
              <p>미션 성공 점수와 남은 시간을 기준으로 저장됩니다.</p>
              <div className="lh7-ranking-list">
                {leaderboard.slice(0, 7).map((entry, index) => (
                  <div key={entry.id}>
                    <b>{index + 1}</b>
                    <span><strong>{entry.nickname}</strong><small>{entry.roleTitle}</small></span>
                    <i>{entry.score}</i>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <div className="empty">첫 번째 TOP 연구원이 되어보세요.</div>
                )}
              </div>
              <div className="lh7-ranking-note">LOCAL KIOSK · TOP 30 SAVED</div>
            </aside>
          </section>
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

        {stage === 'route' && (
          <section className="lh7-route-panel">
            <small>FINAL MINI GAME · LIVE ESCAPE ROUTE</small>
            <h2>좀비 봉쇄를 피해 가장 안전한 탈출 경로를 선택하세요</h2>
            <p>LIVE CITY의 감염 파동을 확인하세요. 위험도가 가장 낮은 경로를 찾으면 바로 탈출이 시작됩니다.</p>
            <div className="lh7-route-grid">
              {routeOptions.map((route) => (
                <button
                  key={route.id}
                  className={selectedRoute === route.id ? 'selected' : ''}
                  disabled={locked}
                  onClick={() => chooseEscapeRoute(route)}
                >
                  <i>{route.icon}</i>
                  <small>ROUTE</small>
                  <strong>{route.title}</strong>
                  <span>{route.subtitle}</span>
                  <div className={`risk risk-${route.risk}`}>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <b key={index}>{index < route.risk ? '🧟' : '·'}</b>
                    ))}
                  </div>
                </button>
              ))}
            </div>
            <div className="lh7-route-hint">좀비 아이콘이 적을수록 현재 감염 파동에서 안전한 경로입니다.</div>
          </section>
        )}

        {stage === 'escape' && (
          <div className="lh4-escape-overlay lh6-escape-overlay">
            <div className="lh4-escape-runner" style={{ left: `calc(8% + ${escapeProgress * 76}%)` }}>🧑‍🔬🧪</div>
            <strong>EVACUATING...</strong>
            <span>치료 연구 후보 확보 · 출구까지 {Math.max(0, Math.ceil((1 - escapeProgress) * 100))}m</span>
            <i><b style={{ width: `${escapeProgress * 100}%` }} /></i>
          </div>
        )}

        {stage === 'success' && (
          <>
            <section className="lh7-success-card">
              <small>NEXUS FUTURE RESEARCHER</small>
              <h2>{safeNickname(nickname) || 'RESEARCHER'}</h2>
              <strong>{selectedRole?.title ?? 'NEXUS 연구원'}</strong>
              <div className="lh7-success-stats">
                <span><small>RANK</small><b>#{personalRank ?? '-'}</b></span>
                <span><small>SCORE</small><b>{score}</b></span>
                <span><small>TIME LEFT</small><b>{formatTime(remaining)}</b></span>
                <span><small>QUIZ</small><b>{correctCount}/10</b></span>
              </div>
              <div className="lh7-success-leaderboard">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <div key={entry.id} className={entry.nickname === safeNickname(nickname) && entry.score === score ? 'me' : ''}>
                    <b>{index + 1}</b><span>{entry.nickname}</span><small>{entry.score}</small>
                  </div>
                ))}
              </div>
            </section>
            <button className="lh4-next-button" onClick={resetMission}>
              NEXT RESEARCHER →
            </button>
          </>
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
