import {
  Atom,
  Brain,
  CheckCircle2,
  FlaskConical,
  Microscope,
  Sparkles,
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Brand } from './Brand';
import { QrPlaceholder } from './ScienceArt';
import type {
  Candidate,
  Disease,
  ResearchSession,
} from '../types';
import './PrintOutputs.css';

type PrintProps = {
  session: ResearchSession;
  disease: Disease;
  candidate: Candidate;
};

const EDITION_COUNTER_KEY =
  'biodocklab-limited-edition-counter';

const editionSessionKey = (
  sessionId: string,
) =>
  `biodocklab-limited-edition:${sessionId}`;

const resolveEditionNumber = (
  sessionId: string,
) => {
  if (
    typeof window === 'undefined'
  ) {
    return 1;
  }

  const sessionKey =
    editionSessionKey(sessionId);

  const existing =
    window.localStorage.getItem(
      sessionKey,
    );

  if (existing) {
    const parsed =
      Number.parseInt(existing, 10);

    if (
      Number.isFinite(parsed) &&
      parsed >= 1 &&
      parsed <= 100
    ) {
      return parsed;
    }
  }

  const currentRaw =
    window.localStorage.getItem(
      EDITION_COUNTER_KEY,
    );

  const current =
    Number.parseInt(
      currentRaw ?? '0',
      10,
    );

  const next = Math.min(
    Number.isFinite(current)
      ? current + 1
      : 1,
    100,
  );

  window.localStorage.setItem(
    EDITION_COUNTER_KEY,
    String(next),
  );

  window.localStorage.setItem(
    sessionKey,
    String(next),
  );

  return next;
};

const formatEditionNumber = (
  value: number,
) =>
  String(value).padStart(3, '0');

export function PrintOutputs({
  session,
  disease,
  candidate,
}: PrintProps) {
  const name =
    session.researcherName.trim() ||
    '미래 연구원';

  const role =
    session.dreamRole.trim() ||
    '바이오 AI 연구원';

  const modelName =
    session.cellModelId ===
    '3d-organoid'
      ? '3D Brain Organoid'
      : '2D Cell Model';

  const issuedDate =
    new Date().toLocaleDateString(
      'ko-KR',
    );

  const [editionNumber, setEditionNumber] =
    useState(() =>
      resolveEditionNumber(
        session.sessionId,
      ),
    );

  useEffect(() => {
    setEditionNumber(
      resolveEditionNumber(
        session.sessionId,
      ),
    );
  }, [session.sessionId]);

  const editionText =
    formatEditionNumber(
      editionNumber,
    );

  const variant =
    useMemo(
      () =>
        ((editionNumber - 1) % 4) + 1,
      [editionNumber],
    );

  const frontImage =
    `/collector/front-${variant}.png`;

  const backImage =
    `/collector/back-${variant}.png`;

  return (
    <div
      id="print-output"
      className="print-output"
      aria-hidden="true"
    >
      <article className="a4-report print-sheet">
        <div className="report-header">
          <Brand />

          <span>
            Research ID
            <strong>
              {session.sessionId}
            </strong>
          </span>
        </div>

        <h1>
          BIODOCKLAB RESEARCH TRAIL
        </h1>

        <p className="report-subtitle">
          Bio AI Educational Research
          Experience Record
        </p>

        <div className="report-grid">
          <section className="report-profile">
            <dl>
              <div>
                <dt>연구원 이름</dt>
                <dd>{name}</dd>
              </div>

              <div>
                <dt>관심 분야</dt>
                <dd>{role}</dd>
              </div>

              <div>
                <dt>연구 질문</dt>
                <dd>{disease.title}</dd>
              </div>

              <div>
                <dt>연구 모델</dt>
                <dd>{modelName}</dd>
              </div>

              <div>
                <dt>단백질 탐색</dt>
                <dd>EGFR (P00533)</dd>
              </div>

              <div>
                <dt>체험 완료일</dt>
                <dd>{issuedDate}</dd>
              </div>
            </dl>
          </section>

          <section className="report-score">
            <span>
              RESEARCH TRAIL
            </span>

            <div className="score-ring">
              <CheckCircle2 />

              <strong>
                COMPLETE
              </strong>
            </div>

            <p>
              Educational Experience
            </p>
          </section>

          <section className="report-flow">
            <Microscope />
            <span>SAMPLE</span>
            <b>↓</b>

            <Brain />
            <span>QUESTION</span>
            <b>↓</b>

            <FlaskConical />
            <span>MODEL</span>
            <b>↓</b>

            <Atom />
            <span>PROTEIN</span>
            <b>↓</b>

            <Sparkles />
            <span>NEXT DIRECTION</span>
          </section>

          <section className="report-summary">
            <h2>
              오늘의 연구 경로
            </h2>

            <p>
              {disease.title} 연구 질문을
              선택하고 {modelName}을 연구
              모델로 비교한 뒤, EGFR
              단백질 구조와 세 후보의 구조적
              상호작용을 교육용 시각화로
              탐색했습니다.
            </p>

            <h2>
              선택한 다음 연구 방향
            </h2>

            <ul>
              <li>
                {candidate.name}{' '}
                ({candidate.code})
              </li>

              <li>
                {candidate.feature}
              </li>

              <li>
                구조 비교 참고값:{' '}
                {candidate.dockingScore}{' '}
                kcal/mol
              </li>
            </ul>

            <h2>
              Next Research Question
            </h2>

            <p>
              이 후보의 구조적 상호작용을
              실제 실험에서는 어떤 방법으로
              검증할 수 있을까요?
            </p>
          </section>

          <section className="report-metrics">
            <div>
              <strong>
                {disease.title}
              </strong>
              <span>
                Research Question
              </span>
            </div>

            <div>
              <strong>
                {modelName}
              </strong>
              <span>
                Research Model
              </span>
            </div>

            <div>
              <strong>EGFR</strong>
              <span>
                Protein Target
              </span>
            </div>

            <div>
              <strong>
                {candidate.name}
              </strong>
              <span>
                Next Direction
              </span>
            </div>
          </section>
        </div>

        <div className="report-footer">
          <span className="verified">
            <CheckCircle2 />
            RESEARCH TRAIL COMPLETE
          </span>

          <span>
            <Sparkles />
            Bio AI Educational
            Experience
          </span>

          <QrPlaceholder />
        </div>

        <small className="report-disclaimer">
          본 결과물은 바이오 연구의 사고
          과정과 AI 활용 개념을 이해하기
          위한 교육용 체험 기록입니다.
          실제 의료 진단·치료·처방,
          약효 판정 또는 검증된 분자
          도킹 결과를 의미하지 않습니다.
        </small>
      </article>

      <article className="collector-card-print print-sheet">
        <header className="collector-print-heading">
          <strong>
            BioDockLab 4시간 부스 한정
          </strong>

          <span>
            Limited Booth Collectible ·
            No. {editionText} / 100
          </span>
        </header>

        <div className="collector-card-pair">
          <section
            className="collector-card collector-card--front"
            style={{
              backgroundImage:
                `url("${frontImage}")`,
            }}
          >
            <span className="collector-card__serial">
              No. {editionText} / 100
            </span>
          </section>

          <section
            className="collector-card collector-card--back"
            style={{
              backgroundImage:
                `url("${backImage}")`,
            }}
          >
            <div className="collector-card__result">
              <span className="result-field result-field--name">
                {name}
              </span>

              <span className="result-field result-field--interest">
                {role}
              </span>

              <span className="result-field result-field--question">
                {disease.title}
              </span>

              <span className="result-field result-field--model">
                {modelName}
              </span>

              <span className="result-field result-field--protein">
                EGFR
              </span>

              <span className="result-field result-field--candidate">
                {candidate.name}
              </span>

              <span className="result-field result-field--time">
                {issuedDate}
              </span>

              <span className="collector-card__serial collector-card__serial--back">
                No. {editionText} / 100
              </span>

              <div className="collector-card__qr">
                <QrPlaceholder />
              </div>
            </div>
          </section>
        </div>

        <footer className="collector-print-footer">
          <span>
            배재학당융합혁신연구소
          </span>

          <span>
            BioDockLab Research Trail
          </span>

          <span>
            교육·체험용 한정 기념 카드
          </span>
        </footer>
      </article>
    </div>
  );
}
