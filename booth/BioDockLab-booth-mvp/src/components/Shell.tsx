import {
  Activity,
  BookOpen,
  Database,
  FileText,
  FlaskConical,
  Home,
  Languages,
  RefreshCw,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Brand } from './Brand';
import { steps } from '../data/content';

type ShellProps = {
  step: number;
  onStep: (step: number) => void;
  onReset: () => void;
  children: ReactNode;
  sessionId: string;
};

export function Shell({ step, onStep, onReset, children, sessionId }: ShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar no-print">
        <Brand />
        <nav className="sidebar__nav" aria-label="주 메뉴">
          {[
            [Home, '홈', 'Home', 1],
            [FlaskConical, '연구 체험', 'Research', Math.max(2, step)],
            [Activity, 'AI 분석 결과', 'AI Analysis', 4],
            [FileText, '결과 리포트', 'Report', 6],
            [BookOpen, '연구 가이드', 'Guide', step],
            [Database, '데이터 보관함', 'My Data', step],
          ].map(([Icon, ko, en, target], index) => {
            const IconComponent = Icon as typeof Home;
            const active = (index === 0 && step === 1) || (index === 1 && step >= 2 && step <= 3) || (index === 2 && step >= 4 && step <= 5) || (index === 3 && step === 6);
            return (
              <button key={String(ko)} type="button" className={active ? 'is-active' : ''} onClick={() => onStep(Number(target))}>
                <IconComponent size={23} />
                <span><strong>{String(ko)}</strong><small>{String(en)}</small></span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar__mission">
          <Brand compact />
          <p>바이오와 AI의 융합을<br />하나의 연구 스토리로 체험합니다.</p>
        </div>
        <button className="sidebar__language" type="button"><Languages size={20} /> 언어 / Language <span>›</span></button>
      </aside>

      <main className="workspace">
        <header className="topbar no-print">
          <div className="topbar__heading">
            <strong>연구 진행 단계</strong>
            <span>{new Date().toLocaleDateString('ko-KR')} {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
            <button type="button" onClick={onReset}><RefreshCw size={17} /> 처음으로</button>
          </div>
          <ol className="stepper">
            {steps.map((label, index) => {
              const value = index + 1;
              return (
                <li key={label} className={value < step ? 'is-complete' : value === step ? 'is-active' : ''}>
                  <button type="button" onClick={() => value <= step && onStep(value)} aria-label={`${value}단계 ${label}`}>
                    <span>{value < step ? '✓' : value}</span><em>{label}</em>
                  </button>
                </li>
              );
            })}
          </ol>
        </header>
        <section className="workspace__content">{children}</section>
        <footer className="statusbar no-print">
          <span><i /> 시스템 상태 <strong>정상</strong></span>
          <span>연구 세션 ID&nbsp;&nbsp; {sessionId}</span>
          <span>© 2026 BioDockLab. Educational Experience.</span>
        </footer>
      </main>
    </div>
  );
}
