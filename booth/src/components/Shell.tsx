import {
  Atom,
  Brain,
  CheckCircle2,
  FileText,
  Microscope,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Brand } from './Brand';

type ShellProps = {
  step: number;
  onStep: (step: number) => void;
  onReset: () => void;
  children: ReactNode;
  sessionId: string;
};

type KioskStep = {
  label: string;
  description: string;
  targetStep: number;
  icon: typeof Microscope;
};

const kioskSteps: KioskStep[] = [
  {
    label: '샘플 관찰',
    description: 'CellScope',
    targetStep: 1,
    icon: Microscope,
  },
  {
    label: '연구 질문',
    description: '질환 · 모델',
    targetStep: 2,
    icon: Brain,
  },
  {
    label: '단백질 탐색',
    description: 'EGFR',
    targetStep: 3,
    icon: Atom,
  },
  {
    label: 'AI 연구',
    description: '구조 · 후보',
    targetStep: 4,
    icon: Sparkles,
  },
  {
    label: '연구 기록',
    description: 'Research Trail',
    targetStep: 6,
    icon: FileText,
  },
];

const getExperienceStep = (appStep: number) => {
  if (appStep <= 1) {
    return 1;
  }

  if (appStep === 2) {
    return 2;
  }

  if (appStep === 3) {
    return 3;
  }

  if (appStep === 4 || appStep === 5) {
    return 4;
  }

  return 5;
};

export function Shell({
  step,
  onStep,
  onReset,
  children,
  sessionId,
}: ShellProps) {
  const experienceStep = getExperienceStep(step);

  const now = new Date();

  const dateText = now.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });

  const timeText = now.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="app-shell app-shell--kiosk">
      <aside className="sidebar sidebar--kiosk no-print">
        <div className="kiosk-sidebar__brand">
          <Brand />
        </div>

        <div className="kiosk-sidebar__current">
          <small>
            CURRENT EXPERIENCE
          </small>

          <strong>
            {experienceStep}
            <span>/5</span>
          </strong>

          <h2>
            {kioskSteps[experienceStep - 1].label}
          </h2>

          <p>
            {kioskSteps[experienceStep - 1].description}
          </p>
        </div>

        <div className="kiosk-sidebar__progress">
          {kioskSteps.map((item, index) => {
            const value = index + 1;
            const complete = value < experienceStep;
            const active = value === experienceStep;

            return (
              <div
                key={item.label}
                className={[
                  'kiosk-sidebar__step',
                  complete ? 'is-complete' : '',
                  active ? 'is-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span>
                  {complete
                    ? '✓'
                    : value}
                </span>

                <div>
                  <strong>
                    {item.label}
                  </strong>

                  <small>
                    {item.description}
                  </small>
                </div>
              </div>
            );
          })}
        </div>

        <div className="kiosk-sidebar__operator">
          <small>
            OPERATOR
          </small>

          <p>
            <kbd>Enter</kbd>
            체험 시작
          </p>

          <p>
            <kbd>Esc</kbd>
            CellScope 초기화
          </p>

          <button
            type="button"
            onClick={onReset}
          >
            <RefreshCw size={17} />
            다음 참가자 준비
          </button>
        </div>
      </aside>

      <main className="workspace workspace--kiosk">
        <header className="topbar topbar--kiosk no-print">
          <div className="kiosk-topbar__meta">
            <div>
              <Brand compact />

              <span>
                BIO AI RESEARCH EXPERIENCE
              </span>
            </div>

            <div>
              <span>
                {dateText}
              </span>

              <strong>
                {timeText}
              </strong>

              <button
                type="button"
                onClick={onReset}
                title="다음 참가자용으로 체험을 초기화합니다."
              >
                <RefreshCw size={17} />
                처음부터
              </button>
            </div>
          </div>

          <ol
            className="stepper stepper--kiosk"
            aria-label="BioDockLab 체험 진행 단계"
          >
            {kioskSteps.map((item, index) => {
              const value = index + 1;

              const complete =
                value < experienceStep;

              const active =
                value === experienceStep;

              const Icon = item.icon;

              const canReturn =
                value <= experienceStep;

              return (
                <li
                  key={item.label}
                  className={[
                    complete ? 'is-complete' : '',
                    active ? 'is-active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <button
                    type="button"
                    disabled={!canReturn}
                    onClick={() => {
                      if (canReturn) {
                        onStep(item.targetStep);
                      }
                    }}
                    aria-label={`${value}단계 ${item.label}`}
                  >
                    <span>
                      {complete ? (
                        <CheckCircle2 />
                      ) : (
                        <Icon />
                      )}
                    </span>

                    <em>
                      <strong>
                        {value}. {item.label}
                      </strong>

                      <small>
                        {item.description}
                      </small>
                    </em>
                  </button>
                </li>
              );
            })}
          </ol>
        </header>

        <section className="workspace__content">
          {children}
        </section>

        <footer className="statusbar statusbar--kiosk no-print">
          <span>
            <i />
            SYSTEM
            <strong>
              READY
            </strong>
          </span>

          <span>
            SESSION
            <strong>
              {sessionId}
            </strong>
          </span>

          <span>
            교육용 Bio AI 연구 체험
          </span>

          <span>
            BioDockLab · 2026
          </span>
        </footer>
      </main>
    </div>
  );
}