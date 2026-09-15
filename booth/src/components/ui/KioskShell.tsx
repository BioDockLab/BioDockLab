import { ReactNode } from 'react';

type KioskShellProps = {
  activeStep?: number;
  showSteps?: boolean;
  children: ReactNode;
};

const stepLabels = [
  ['1', '단백질 선택', '대상을 고릅니다'],
  ['2', '구조 확인', '3D 구조를 봅니다'],
  ['3', '결합 탐색', '포켓을 확인합니다'],
  ['4', '후보 비교', '결과를 비교합니다'],
  ['5', '결과 전달', '리포트를 받습니다'],
] as const;

export function KioskShell({
  activeStep = 0,
  showSteps = false,
  children,
}: KioskShellProps) {
  return (
    <div className="bd-app">
      <div className="bd-shell">
        <div className="bd-top">
          <div className="bd-brand">
            <div className="bd-brand-univ">Paejae University</div>
            <h1 className="bd-brand-logo">
              Bio<span className="dock">Dock</span>Lab
              <span className="leaf">🌿</span>
            </h1>
            <p className="bd-brand-tagline">
              AI로 여는 생명의 <strong>무한한 가능성</strong>
            </p>
            <p className="bd-brand-sub">
              From Cells to Cures, AI Bridges Biology and Tomorrow
            </p>
          </div>

          <div className="bd-deco">
            <div className="bd-deco-note">
              작은 세포가
              <br />
              더 큰 내일을 만든다.
              <small>Small Cells, Big Tomorrow.</small>
            </div>

            <div className="bd-deco-molecules">
              <div className="bd-bubble one" />
              <div className="bd-bubble two" />
              <div className="bd-bubble three" />
              <div className="bd-bubble four" />

              <div className="bd-node n1" />
              <div className="bd-node n2" />
              <div className="bd-node n3" />
              <div className="bd-node n4" />

              <div className="bd-node-line l1" />
              <div className="bd-node-line l2" />
              <div className="bd-node-line l3" />
            </div>
          </div>
        </div>

        {showSteps && (
          <div className="bd-steps">
            {stepLabels.map(([index, title, sub], i) => {
              const step = i + 1;
              const done = step < activeStep;
              const active = step === activeStep;

              return (
                <div
                  key={index}
                  className={[
                    'bd-step',
                    done ? 'done' : '',
                    active ? 'active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className="bd-step-index">{done ? '✓' : index}</div>
                  <div className="bd-step-copy">
                    <strong>{title}</strong>
                    <span>{sub}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {children}

        <div className="bd-footer">
          <div className="bd-footer-title">
            <strong>BioDockLab</strong>
            <span>Paejae University</span>
          </div>

          <div className="bd-footer-meta">
            <span>📅 2026. 9. 16. (수) 13:00 - 17:00</span>
            <span>📍 배재대학교 스포렉스홀 · 21세기관 지하 1층</span>
          </div>

          <div className="bd-footer-phrase">
            생명을 이해하는 기술, 더 나은 내일을 위한 연구
            <br />
            Understanding Life, Innovating for a Better Tomorrow
          </div>
        </div>
      </div>
    </div>
  );
}
