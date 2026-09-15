export type QuestionCategory =
  | 'history'
  | 'virus'
  | 'protein'
  | 'structure'
  | 'research';

export type Difficulty =
  | 'easy'
  | 'normal'
  | 'hard';

export type LastHopeQuestion = {
  id: string;

  type:
    | 'ox'
    | 'choice';

  category:
    QuestionCategory;

  difficulty:
    Difficulty;

  briefing: string;

  question: string;

  options?: string[];

  answer:
    | 'O'
    | 'X'
    | number;

  explanation: string;
};

export const lastHopeQuestions:
LastHopeQuestion[] = [
  {
    id: 'covid-wuhan',
    type: 'choice',
    category: 'history',
    difficulty: 'easy',

    briefing:
      '2019년 말 중국에서 원인 불명의 폐렴 집단 사례가 보고되기 시작했습니다.',

    question:
      '2019년 12월 원인 불명 폐렴 집단 사례가 보고된 도시는?',

    options: [
      '우한',
      '베이징',
      '상하이',
      '광저우',
    ],

    answer: 0,

    explanation:
      '초기 집단 사례는 중국 후베이성 우한에서 보고되었습니다.',
  },

  {
    id: 'covid-pandemic-year',
    type: 'choice',
    category: 'history',
    difficulty: 'easy',

    briefing:
      'COVID-19는 빠르게 세계 여러 국가로 확산됐습니다.',

    question:
      'WHO가 COVID-19를 팬데믹으로 규정한 해는?',

    options: [
      '2018년',
      '2019년',
      '2020년',
      '2021년',
    ],

    answer: 2,

    explanation:
      'WHO는 2020년 3월 11일 COVID-19를 팬데믹으로 규정했습니다.',
  },

  {
    id: 'mers-year',
    type: 'choice',
    category: 'history',
    difficulty: 'normal',

    briefing:
      'MERS-CoV는 중동 지역에서 처음 확인된 코로나바이러스입니다.',

    question:
      'MERS-CoV가 처음 확인된 해는?',

    options: [
      '2003년',
      '2009년',
      '2012년',
      '2020년',
    ],

    answer: 2,

    explanation:
      'MERS-CoV는 2012년에 처음 확인되었습니다.',
  },

  {
    id: 'mers-region',
    type: 'choice',
    category: 'history',
    difficulty: 'easy',

    briefing:
      'MERS는 Middle East Respiratory Syndrome의 약자입니다.',

    question:
      'MERS가 처음 확인된 지역과 가장 관련 깊은 곳은?',

    options: [
      '중동',
      '남극',
      '남미',
      '북유럽',
    ],

    answer: 0,

    explanation:
      'MERS는 이름 그대로 중동 지역과 관련된 호흡기 감염병입니다.',
  },

  {
    id: 'h1n1-year',
    type: 'choice',
    category: 'history',
    difficulty: 'easy',

    briefing:
      'H1N1 인플루엔자는 2009년에 전 세계적으로 크게 확산됐습니다.',

    question:
      '2009 H1N1 인플루엔자 유행이 발생한 해는?',

    options: [
      '2001년',
      '2005년',
      '2009년',
      '2014년',
    ],

    answer: 2,

    explanation:
      '이 유행은 2009년에 발생했습니다.',
  },

  {
    id: 'virus-cell',
    type: 'ox',
    category: 'virus',
    difficulty: 'easy',

    briefing:
      '바이러스는 숙주 세포의 시스템을 이용해 증식합니다.',

    question:
      '바이러스는 숙주 세포와 전혀 관계없이 스스로 증식할 수 있다.',

    answer: 'X',

    explanation:
      '바이러스는 일반적으로 숙주 세포의 시스템을 이용해 증식합니다.',
  },

  {
    id: 'virus-genome',
    type: 'ox',
    category: 'virus',
    difficulty: 'normal',

    briefing:
      '바이러스는 유전정보를 가지고 있습니다.',

    question:
      '바이러스는 유전물질을 가질 수 있다.',

    answer: 'O',

    explanation:
      '바이러스는 DNA 또는 RNA 형태의 유전물질을 가질 수 있습니다.',
  },

  {
    id: 'protein-3d',
    type: 'ox',
    category: 'protein',
    difficulty: 'easy',

    briefing:
      '단백질은 복잡한 입체 구조를 형성합니다.',

    question:
      '단백질의 기능은 3차원 구조와 관련이 있다.',

    answer: 'O',

    explanation:
      '단백질의 입체 구조는 기능과 상호작용에 중요한 영향을 줍니다.',
  },

  {
    id: 'protein-flat',
    type: 'ox',
    category: 'protein',
    difficulty: 'easy',

    briefing:
      '단백질은 단순한 평면 그림이 아니라 입체 구조를 가집니다.',

    question:
      '단백질은 항상 평면 구조로만 존재한다.',

    answer: 'X',

    explanation:
      '단백질은 다양한 3차원 구조를 형성합니다.',
  },

  {
    id: 'protein-fold',
    type: 'choice',
    category: 'protein',
    difficulty: 'normal',

    briefing:
      '단백질의 아미노산 사슬은 특정한 형태로 접힙니다.',

    question:
      '단백질의 입체적인 형태를 만드는 과정과 가장 가까운 표현은?',

    options: [
      '접힘',
      '증발',
      '연소',
      '응고',
    ],

    answer: 0,

    explanation:
      '단백질은 아미노산 사슬이 접히면서 입체 구조를 형성합니다.',
  },

  {
    id: 'pdb',
    type: 'choice',
    category: 'structure',
    difficulty: 'normal',

    briefing:
      'Protein Data Bank는 생체분자의 구조 정보를 제공하는 대표적인 공개 데이터베이스입니다.',

    question:
      'PDB에서 주로 확인할 수 있는 것은?',

    options: [
      '단백질 등의 3차원 구조',
      '병원 진료 예약',
      '약국 재고',
      '기상 예보',
    ],

    answer: 0,

    explanation:
      'PDB에서는 단백질 등 생체분자의 3차원 구조 데이터를 확인할 수 있습니다.',
  },

  {
    id: 'pdb-id',
    type: 'choice',
    category: 'structure',
    difficulty: 'normal',

    briefing:
      '각 PDB 구조에는 고유한 식별자가 있습니다.',

    question:
      '6LU7과 가장 가까운 설명은?',

    options: [
      'PDB 구조 식별자',
      '환자 번호',
      '약품 가격',
      '바이러스 확산률',
    ],

    answer: 0,

    explanation:
      '6LU7은 Protein Data Bank에서 구조를 식별하는 PDB ID입니다.',
  },

  {
    id: 'binding-site',
    type: 'choice',
    category: 'structure',
    difficulty: 'normal',

    briefing:
      '단백질 표면에는 다른 분자가 상호작용할 수 있는 특정 공간이 있습니다.',

    question:
      '다른 분자가 단백질과 상호작용하는 특정 위치를 무엇이라고 부를 수 있을까?',

    options: [
      '결합 부위',
      '배경 영역',
      '파일 폴더',
      '화면 좌표',
    ],

    answer: 0,

    explanation:
      '분자가 상호작용하는 특정 위치를 결합 부위 또는 결합 포켓이라고 할 수 있습니다.',
  },

  {
    id: 'ligand',
    type: 'choice',
    category: 'structure',
    difficulty: 'normal',

    briefing:
      '단백질과 결합하는 분자를 구조 연구에서는 ligand라고 부르기도 합니다.',

    question:
      '단백질과 결합하는 분자를 가리키는 용어는?',

    options: [
      '리간드',
      '픽셀',
      '프레임',
      '노드',
    ],

    answer: 0,

    explanation:
      '리간드는 단백질 등의 생체분자와 결합하는 분자를 의미합니다.',
  },

  {
    id: 'reference-ligand',
    type: 'choice',
    category: 'structure',
    difficulty: 'hard',

    briefing:
      '실제 구조에서 함께 관찰된 기준 리간드는 결합 부위를 이해하는 단서가 될 수 있습니다.',

    question:
      'reference ligand를 관찰하는 가장 적절한 이유는?',

    options: [
      '결합 위치를 탐색하는 단서로 활용',
      '단백질 색을 결정',
      '화면 밝기를 조절',
      'PDB 번호를 변경',
    ],

    answer: 0,

    explanation:
      '기준 리간드의 위치는 결합 공간을 연구하는 단서로 활용할 수 있습니다.',
  },

  {
    id: 'structure-reason',
    type: 'choice',
    category: 'research',
    difficulty: 'normal',

    briefing:
      '신약 연구에서는 표적 단백질의 구조를 분석하기도 합니다.',

    question:
      '단백질의 3D 구조를 연구하는 이유와 가장 가까운 것은?',

    options: [
      '분자가 상호작용할 공간을 이해하기 위해',
      '단백질의 소리를 듣기 위해',
      '화면의 크기를 확인하기 위해',
      '파일 용량을 줄이기 위해',
    ],

    answer: 0,

    explanation:
      '단백질 구조 분석은 다른 분자가 상호작용할 수 있는 위치를 이해하는 데 도움을 줍니다.',
  },

  {
    id: 'candidate-validation',
    type: 'ox',
    category: 'research',
    difficulty: 'hard',

    briefing:
      '컴퓨터 분석은 신약개발 과정 중 하나일 뿐입니다.',

    question:
      '컴퓨터에서 좋은 결과가 나오면 실제 치료 효과까지 이미 증명된 것이다.',

    answer: 'X',

    explanation:
      '실제 치료 효과를 확인하려면 추가적인 실험과 검증이 필요합니다.',
  },

  {
    id: 'candidate-next-step',
    type: 'ox',
    category: 'research',
    difficulty: 'normal',

    briefing:
      '후보물질을 선택해도 연구는 끝나지 않습니다.',

    question:
      '후보물질 선택 이후에도 추가 연구와 검증이 필요하다.',

    answer: 'O',

    explanation:
      '후보 선택 이후에도 다양한 검증 단계가 이어질 수 있습니다.',
  },

  {
    id: 'structure-match',
    type: 'choice',
    category: 'structure',
    difficulty: 'hard',

    briefing:
      '구조를 비교할 때는 전체적인 입체 형태를 관찰하는 것이 중요합니다.',

    question:
      '같은 단백질 구조를 찾을 때 가장 먼저 비교할 것은?',

    options: [
      '전체적인 입체 형태',
      '카드 배경색',
      '버튼 위치',
      '글자 크기',
    ],

    answer: 0,

    explanation:
      '구조 매칭에서는 단백질 자체의 전체적인 입체 형태를 관찰해야 합니다.',
  },

  {
    id: 'mpro',
    type: 'choice',
    category: 'protein',
    difficulty: 'hard',

    briefing:
      'SARS-CoV-2의 Main protease는 바이러스 단백질 처리 과정에 관여하는 효소입니다.',

    question:
      'Mpro에서 pro가 의미하는 것과 가장 가까운 것은?',

    options: [
      'protease',
      'program',
      'profile',
      'project',
    ],

    answer: 0,

    explanation:
      'Mpro는 Main protease를 의미합니다.',
  },
];
