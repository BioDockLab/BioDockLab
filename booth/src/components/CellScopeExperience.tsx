import { Camera, CheckCircle2, Cpu, ScanLine, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  createCellScopeClient,
  type CellScopeAnalysis,
  type CellScopeHealth,
  type CellScopeSample,
  type CellScopeStatus,
} from '../cellscope/device';

const statusText: Record<CellScopeStatus, string> = {
  idle: '체험 준비 완료',
  'checking-device': 'CellScope 장비 상태를 확인하고 있습니다',
  'waiting-for-sample': '샘플 카트리지를 확인하고 있습니다',
  'sample-detected': '샘플을 인식했습니다',
  capturing: '카메라 이미지를 준비하고 있습니다',
  analyzing: '형태와 분포 특징을 분석하고 있습니다',
  complete: '분석이 완료되었습니다',
  error: '장비 연결을 확인해 주세요',
};

export function CellScopeExperience() {
  const client = useMemo(() => createCellScopeClient(), []);

  const [status, setStatus] = useState<CellScopeStatus>('idle');
  const [sample, setSample] = useState<CellScopeSample | null>(null);
  const [analysis, setAnalysis] = useState<CellScopeAnalysis | null>(null);
  const [health, setHealth] = useState<CellScopeHealth | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const start = async () => {
    try {
      setErrorMessage(null);
      setAnalysis(null);
      setSample(null);

      setStatus('checking-device');

      const deviceHealth = await client.health();
      setHealth(deviceHealth);

      if (!deviceHealth.ok) {
        throw new Error(
          client.getMode() === 'device'
            ? 'Raspberry Pi CellScope 서비스에 연결할 수 없습니다.'
            : 'CellScope 데모 어댑터를 시작할 수 없습니다.',
        );
      }

      setStatus('waiting-for-sample');

      const detected = await client.detectSample();
      setSample(detected);
      setStatus('sample-detected');

      await new Promise((resolve) => window.setTimeout(resolve, 350));
      setStatus('capturing');

      await new Promise((resolve) => window.setTimeout(resolve, 450));
      setStatus('analyzing');

      const result = await client.analyze(detected);

      setAnalysis(result);
      setStatus('complete');
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'CellScope 처리 중 알 수 없는 오류가 발생했습니다.',
      );

      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setSample(null);
    setAnalysis(null);
    setHealth(null);
    setErrorMessage(null);
  };

  const busy = !['idle', 'complete', 'error'].includes(status);

  useEffect(() => {
    void client.setLedState(status).catch((error) => {
      console.warn('[CellScope LED]', error);
    });
  }, [client, status]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !busy) {
        event.preventDefault();
        void start();
      }

      if (event.key === 'Escape' && !busy) {
        event.preventDefault();
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [busy]);

  const connectionText =
    client.getMode() === 'demo'
      ? '오프라인 데모 모드'
      : health?.ok
        ? 'Raspberry Pi 연결 정상'
        : 'Raspberry Pi 연결 모드';

  const showHardwareHealth =
    client.getMode() === 'device' && health !== null;

  return (
    <section className="panel cellscope-panel">
      <div className="cellscope-panel__intro">
        <span className="eyebrow">
          <Camera />
          BIO AI CELLSCOPE
        </span>

        <h2>샘플을 넣고 AI 연구를 시작해 보세요.</h2>

        <p>
          교육용 카트리지를 인식하면 뇌 오가노이드 이미지를 불러와 형태와
          분포 특징을 시각화합니다.
        </p>

        <div className="cellscope-device">
          <div className={`cellscope-device__ring is-${status}`}>
            <ScanLine />
          </div>

          <div>
            <strong>{statusText[status]}</strong>
            <span>{connectionText}</span>

            {showHardwareHealth && (
              <div className="cellscope-health">
                <DeviceHealthItem
                  label="Camera"
                  ready={health?.camera}
                />

                <DeviceHealthItem
                  label="Button"
                  ready={health?.button}
                />

                <DeviceHealthItem
                  label="LED"
                  ready={health?.led}
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="button button--primary cellscope-start"
          onClick={start}
          disabled={busy}
        >
          <Cpu />

          {busy
            ? '분석 중…'
            : status === 'error'
              ? '장비 다시 연결'
              : analysis
                ? '다시 스캔'
                : 'CellScope 스캔 시작'}
        </button>

        <small className="cellscope-control-hint">
          Enter: 스캔 시작 · Esc: 초기화
        </small>
      </div>

      <div className="cellscope-panel__result">
        {status === 'error' && (
          <div className="cellscope-empty">
            <ScanLine />

            <strong>CellScope 연결 오류</strong>

            <p>{errorMessage}</p>

            <small>
              {client.getMode() === 'device'
                ? `API: ${client.getBaseUrl()}`
                : '데모 모드를 다시 시작해 주세요.'}
            </small>
          </div>
        )}

        {!sample && status !== 'error' && (
          <div className="cellscope-empty">
            <Sparkles />

            <strong>오늘의 연구 미션</strong>

            <p>
              뇌 오가노이드를 관찰하고 교모세포종 연구 흐름을 따라갑니다.
            </p>
          </div>
        )}

        {sample && (
          <>
            <div className="cellscope-sample">
              <span>인식 샘플</span>

              <strong>{sample.label}</strong>

              <small>
                {sample.id} · Marker {sample.markerId}
              </small>
            </div>

            {analysis && (
              <div className="cellscope-analysis">
                <header>
                  <CheckCircle2 />

                  <div>
                    <strong>교육용 이미지 분석 완료</strong>
                    <small>진단·약효 판정 기능이 아닙니다.</small>
                  </div>
                </header>

                <div className="cellscope-metrics">
                  <Metric
                    label="형태 특징"
                    value={analysis.morphologyScore}
                  />

                  <Metric
                    label="3D 구조"
                    value={analysis.structureScore}
                  />

                  <Metric
                    label="세포 분포"
                    value={analysis.distributionScore}
                  />
                </div>

                <p>{analysis.observation}</p>

                <em>{analysis.nextStep}</em>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <span>{label}</span>

      <strong>{value}</strong>

      <i>
        <b style={{ width: `${value}%` }} />
      </i>
    </div>
  );
}

function DeviceHealthItem({
  label,
  ready,
}: {
  label: string;
  ready?: boolean;
}) {
  return (
    <span
      className={`cellscope-health__item ${
        ready ? 'is-ready' : 'is-error'
      }`}
    >
      {ready ? '●' : '×'} {label}
    </span>
  );
}