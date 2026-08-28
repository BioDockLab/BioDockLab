import type { DiseaseId } from '../types';

export type AIAnalysis = {
  riskLabel: string;
  riskScore: number;
  priorityLabel: string;
  priorityScore: number;
  researchLabel: string;
  researchScore: number;
};

export const aiAnalysisByDisease: Record<DiseaseId, AIAnalysis> = {
  glioblastoma: {
    riskLabel: '중간',
    riskScore: 62,
    priorityLabel: '높음',
    priorityScore: 86,
    researchLabel: '표적 단백질 분석',
    researchScore: 92,
  },

  alzheimers: {
    riskLabel: '높음',
    riskScore: 78,
    priorityLabel: '높음',
    priorityScore: 91,
    researchLabel: '신경퇴행성 단백질 분석',
    researchScore: 88,
  },

  parkinsons: {
    riskLabel: '중간',
    riskScore: 69,
    priorityLabel: '높음',
    priorityScore: 84,
    researchLabel: '신경세포 단백질 분석',
    researchScore: 90,
  },
};