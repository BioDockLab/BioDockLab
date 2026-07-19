import type { Candidate, Disease, Theme } from '../types';

export const themes: Theme[] = [
  {
    id: 'brain-organoid',
    title: '뇌 오가노이드 연구',
    description: '뇌 질환 모델을 활용해 신경 발달과 질환 연구 과정을 체험합니다.',
    tags: ['신경 발달', '질환 모델링', '3D 오가노이드'],
    icon: 'brain',
  },
  {
    id: 'cancer-cell',
    title: '암세포 연구',
    description: '암세포 모델과 단백질 구조를 기반으로 후보물질을 비교합니다.',
    tags: ['표적 탐색', '구조 비교', '후보물질'],
    icon: 'cells',
  },
  {
    id: 'neuron',
    title: '신경세포 연구',
    description: '신경세포 기능과 네트워크 기반 연구 질문을 탐색합니다.',
    tags: ['신경 네트워크', '기능 이해', '재생 연구'],
    icon: 'neuron',
  },
];

export const diseases: Disease[] = [
  {
    id: 'glioblastoma',
    title: '교모세포종',
    titleEn: 'Glioblastoma',
    description: '빠르게 성장하는 악성 뇌종양을 연구 사례로 살펴봅니다.',
    recommended: true,
    icon: 'cells',
  },
  {
    id: 'alzheimers',
    title: '알츠하이머병',
    titleEn: "Alzheimer's disease",
    description: '신경세포 퇴행과 기억·인지 기능 저하를 다루는 연구 사례입니다.',
    icon: 'neuron',
  },
  {
    id: 'parkinsons',
    title: '파킨슨병',
    titleEn: "Parkinson's disease",
    description: '도파민 신경세포 손실과 운동 기능 변화를 다루는 연구 사례입니다.',
    icon: 'spark',
  },
];

export const candidates: Candidate[] = [
  {
    id: 'candidate-a',
    name: 'Candidate A',
    code: 'BDL-A-217',
    dockingScore: -9.42,
    stability: 5,
    selectivity: 4,
    solubility: 3,
    interactions: ['HID-145, GLU-166 주변 수소결합', '소수성 포켓과의 구조적 상호작용'],
    feature: '결합 자세 안정성 지표가 상대적으로 높음',
    accent: 'blue',
  },
  {
    id: 'candidate-b',
    name: 'Candidate B',
    code: 'BDL-B-358',
    dockingScore: -8.36,
    stability: 4,
    selectivity: 4,
    solubility: 4,
    interactions: ['LYS-88 주변 수소결합', 'π–π stacking 형태의 상호작용'],
    feature: '비교 지표가 균형적으로 나타난 예시',
    accent: 'cyan',
  },
  {
    id: 'candidate-c',
    name: 'Candidate C',
    code: 'BDL-C-489',
    dockingScore: -7.81,
    stability: 3,
    selectivity: 3,
    solubility: 4,
    interactions: ['SER-46, ASN-120 주변 수소결합', '보조 결합 부위와의 상호작용'],
    feature: '용해도 관련 참고 지표가 상대적으로 높음',
    accent: 'purple',
  },
];

export const steps = [
  '세포 선택',
  '오가노이드',
  '단백질 구조',
  'AI 구조 예측',
  '후보물질 비교',
  '결과 리포트 출력',
] as const;
