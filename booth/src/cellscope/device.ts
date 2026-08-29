export type CellScopeMode = 'demo' | 'device';

export type CellScopeStatus =
  | 'idle'
  | 'waiting-for-sample'
  | 'sample-detected'
  | 'capturing'
  | 'analyzing'
  | 'complete'
  | 'error';

export type CellScopeSample = {
  id: string;
  markerId: string;
  label: string;
  model: 'brain-organoid';
  disease: 'glioblastoma';
  imageLabel: string;
};

export type CellScopeAnalysis = {
  sampleId: string;
  capturedAt: string;
  morphologyScore: number;
  structureScore: number;
  distributionScore: number;
  observation: string;
  nextStep: string;
};

export const BOOTH_SAMPLE: CellScopeSample = {
  id: 'ORG-BRAIN-001',
  markerId: 'BDL-GBM-001',
  label: '뇌 오가노이드 연구 샘플',
  model: 'brain-organoid',
  disease: 'glioblastoma',
  imageLabel: '교육용 공개 이미지 기반 샘플',
};

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

export class CellScopeClient {
  constructor(
    private readonly mode: CellScopeMode = 'demo',
    private readonly baseUrl = 'http://127.0.0.1:8765',
  ) {}

  getMode() {
    return this.mode;
  }

  async detectSample(): Promise<CellScopeSample> {
    if (this.mode === 'demo') {
      await wait(650);
      return BOOTH_SAMPLE;
    }

    const response = await fetch(`${this.baseUrl}/api/cellscope/sample`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      throw new Error(`CellScope sample API failed: ${response.status}`);
    }

    return response.json() as Promise<CellScopeSample>;
  }

  async analyze(sample: CellScopeSample): Promise<CellScopeAnalysis> {
    if (this.mode === 'demo') {
      await wait(1200);
      return {
        sampleId: sample.id,
        capturedAt: new Date().toISOString(),
        morphologyScore: 84,
        structureScore: 89,
        distributionScore: 81,
        observation:
          '3차원 세포 집합의 형태와 분포 특징을 교육용 지표로 시각화했습니다.',
        nextStep:
          '관련 표적 단백질의 구조를 확인해 연구 질문을 이어갑니다.',
      };
    }

    const response = await fetch(`${this.baseUrl}/api/cellscope/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ sample }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`CellScope analysis API failed: ${response.status}`);
    }

    return response.json() as Promise<CellScopeAnalysis>;
  }
}

export const createCellScopeClient = () => {
  const params = new URLSearchParams(window.location.search);
  const mode: CellScopeMode =
    params.get('cellscope') === 'device' ? 'device' : 'demo';
  return new CellScopeClient(mode);
};