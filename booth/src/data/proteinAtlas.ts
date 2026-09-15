export type ProteinReadiness = 'deep-dive' | 'structure' | 'catalog';

export type ProteinAtlasEntry = {
  id: string;
  virus: 'SARS-CoV-2' | 'MERS-CoV' | 'Influenza A(H1N1)' | 'HIV-1';
  name: string;
  nameKo: string;
  pdbId: string;
  sourceUrl: string;
  function: string;
  researchQuestion: string;
  readiness: ProteinReadiness;
};

/**
 * Booth-safe seed catalog.
 *
 * Every record points to an RCSB PDB entry so an operator can verify the
 * provenance without relying on a live API during the event. `deep-dive`
 * only means the guided BioDockLab story is curated; it does not claim that
 * a new AlphaFold or docking job ran on the kiosk.
 */
export const proteinAtlas: ProteinAtlasEntry[] = [
  {
    id: 'sars2-mpro',
    virus: 'SARS-CoV-2',
    name: 'Main protease (Mpro)',
    nameKo: '주 단백질분해효소',
    pdbId: '6LU7',
    sourceUrl: 'https://www.rcsb.org/structure/6LU7',
    function: '바이러스 다단백질을 절단해 복제 단백질이 작동하도록 돕습니다.',
    researchQuestion: '활성 부위에 결합하는 후보물질은 어떤 상호작용을 만들까?',
    readiness: 'deep-dive',
  },
  {
    id: 'sars2-spike-rbd',
    virus: 'SARS-CoV-2',
    name: 'Spike receptor-binding domain',
    nameKo: '스파이크 수용체 결합 영역',
    pdbId: '6M0J',
    sourceUrl: 'https://www.rcsb.org/structure/6M0J',
    function: '사람 세포의 ACE2 수용체를 인식하는 스파이크 단백질 영역입니다.',
    researchQuestion: '결합 경계면의 어떤 잔기가 인식에 중요할까?',
    readiness: 'structure',
  },
  {
    id: 'sars2-rdrp',
    virus: 'SARS-CoV-2',
    name: 'RNA-dependent RNA polymerase',
    nameKo: 'RNA 의존성 RNA 중합효소',
    pdbId: '7BV2',
    sourceUrl: 'https://www.rcsb.org/structure/7BV2',
    function: '바이러스 RNA 유전체의 복제를 담당하는 효소 복합체입니다.',
    researchQuestion: 'RNA 합성 통로에서 후보물질은 어디에 자리 잡을까?',
    readiness: 'structure',
  },
  {
    id: 'sars2-plpro',
    virus: 'SARS-CoV-2',
    name: 'Papain-like protease',
    nameKo: '파파인 유사 단백질분해효소',
    pdbId: '6WX4',
    sourceUrl: 'https://www.rcsb.org/structure/6WX4',
    function: '바이러스 단백질 가공과 숙주 면역 반응 조절에 관여합니다.',
    researchQuestion: '기질 결합 홈의 형태는 Mpro와 어떻게 다를까?',
    readiness: 'catalog',
  },
  {
    id: 'mers-spike-rbd',
    virus: 'MERS-CoV',
    name: 'Spike receptor-binding domain',
    nameKo: '스파이크 수용체 결합 영역',
    pdbId: '4L72',
    sourceUrl: 'https://www.rcsb.org/structure/4L72',
    function: '사람 세포의 DPP4 수용체를 인식하는 단백질 영역입니다.',
    researchQuestion: 'SARS-CoV-2의 ACE2 결합 방식과 무엇이 다를까?',
    readiness: 'structure',
  },
  {
    id: 'mers-mpro',
    virus: 'MERS-CoV',
    name: 'Main protease (Mpro)',
    nameKo: '주 단백질분해효소',
    pdbId: '4YLU',
    sourceUrl: 'https://www.rcsb.org/structure/4YLU',
    function: 'MERS-CoV 복제에 필요한 단백질 가공 효소입니다.',
    researchQuestion: '코로나바이러스 사이에 보존된 결합 포켓이 있을까?',
    readiness: 'deep-dive',
  },
  {
    id: 'h1n1-neuraminidase',
    virus: 'Influenza A(H1N1)',
    name: 'Neuraminidase',
    nameKo: '뉴라미니다아제',
    pdbId: '3TI6',
    sourceUrl: 'https://www.rcsb.org/structure/3TI6',
    function: '새로 만들어진 독감 바이러스가 감염 세포에서 빠져나오도록 돕습니다.',
    researchQuestion: '활성 부위 구조는 억제제 결합을 어떻게 결정할까?',
    readiness: 'deep-dive',
  },
  {
    id: 'h1n1-hemagglutinin',
    virus: 'Influenza A(H1N1)',
    name: 'Hemagglutinin',
    nameKo: '헤마글루티닌',
    pdbId: '3LZG',
    sourceUrl: 'https://www.rcsb.org/structure/3LZG',
    function: '독감 바이러스가 숙주 세포 표면을 인식하고 막 융합을 시작하게 합니다.',
    researchQuestion: '수용체 결합 부위와 항체 인식 부위는 어디에 있을까?',
    readiness: 'structure',
  },
  {
    id: 'hiv1-protease',
    virus: 'HIV-1',
    name: 'HIV-1 protease',
    nameKo: 'HIV-1 단백질분해효소',
    pdbId: '1HVR',
    sourceUrl: 'https://www.rcsb.org/structure/1HVR',
    function: '바이러스 다단백질을 잘라 성숙한 바이러스 입자가 만들어지게 합니다.',
    researchQuestion: '대칭적인 활성 부위는 억제제 설계에 어떤 단서를 줄까?',
    readiness: 'catalog',
  },
];

export const proteinById = (id: string) =>
  proteinAtlas.find((protein) => protein.id === id);
