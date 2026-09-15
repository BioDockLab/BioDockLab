export type MegaQuestionCategory =
  | 'booth'
  | 'infection'
  | 'structure'
  | 'research';

export type MegaQuestionDifficulty = 'easy' | 'normal' | 'hard';

export type MegaQuestion = {
  id: string;
  family: string;
  category: MegaQuestionCategory;
  type: 'ox' | 'choice' | 'short';
  difficulty: MegaQuestionDifficulty;
  briefing: string;
  question: string;
  options?: string[];
  answer?: 'O' | 'X' | number;
  answers?: string[];
  explanation: string;
};

type FactSeed = {
  id: string;
  category: MegaQuestionCategory;
  difficulty: MegaQuestionDifficulty;
  briefing: string;
  prompts: string[];
  correct: string;
  distractors: [string, string, string];
  trueStatement: string;
  falseStatement: string;
  shortPrompts?: string[];
  shortAnswers?: string[];
  explanation: string;
};

/*
 * V9 principle
 * - Every quiz fact is explicitly taught in the pre-mission briefing / cheat sheet.
 * - Mostly direct recall, not specialist trivia.
 * - 1,000 entries are wording/type variants of a small set of beginner facts.
 */
const FACTS: FactSeed[] = [
  {
    id: 'booth-role', category: 'booth', difficulty: 'easy',
    briefing: '이 체험에서 참가자는 NEXUS의 미래 바이오 연구원이 되어 미션을 수행합니다.',
    prompts: ['이 부스에서 여러분이 맡는 역할은?', 'BioDockLab에서 참가자는 어떤 역할로 플레이하나요?', '미션 속 플레이어의 직업 역할은 무엇인가요?'],
    correct: '미래 바이오 연구원', distractors: ['택배 기사', '기상 캐스터', '항공 관제사'],
    trueStatement: 'BioDockLab에서는 미래 바이오 연구원이 되어 플레이한다.',
    falseStatement: 'BioDockLab에서 참가자는 바이오 연구와 무관한 역할만 맡는다.',
    shortPrompts: ['이 부스에서 맡는 역할을 짧게 입력하세요.'], shortAnswers: ['미래 바이오 연구원', '바이오 연구원', '연구원'],
    explanation: '이 체험은 미래 바이오 연구원의 업무 흐름을 게임으로 경험하도록 구성했습니다.',
  },
  {
    id: 'booth-90-sec', category: 'booth', difficulty: 'easy',
    briefing: '브리핑을 마치고 START를 누르면 90초 미션이 시작됩니다.',
    prompts: ['기본 미션 제한시간은?', 'START 이후 주어지는 시간은?', 'BioDockLab 미션은 몇 초 동안 진행되나요?'],
    correct: '90초', distractors: ['30초', '5분', '10분'],
    trueStatement: 'BioDockLab의 기본 미션 시간은 90초이다.',
    falseStatement: 'BioDockLab은 시간 제한 없이 진행된다.',
    shortPrompts: ['미션 제한시간을 숫자로 입력하세요.'], shortAnswers: ['90', '90초', '1분30초', '1분 30초'],
    explanation: 'START 버튼을 누른 뒤 90초 카운트다운이 시작됩니다.',
  },
  {
    id: 'booth-zvx-fictional', category: 'booth', difficulty: 'easy',
    briefing: 'ZVX-26은 몰입을 위해 만든 가상의 좀비 바이러스 설정입니다.',
    prompts: ['ZVX-26은 무엇인가요?', '게임 속 ZVX-26에 대한 설명으로 맞는 것은?', 'ZVX-26은 실제 병원체일까요?'],
    correct: '체험용 가상 바이러스', distractors: ['실제 WHO 지정 바이러스', '실제 인플루엔자 아형', '실제 결핵균'],
    trueStatement: 'ZVX-26은 체험을 위한 가상 바이러스이다.',
    falseStatement: 'ZVX-26은 실제로 확인된 감염병 원인 바이러스이다.',
    shortPrompts: ['ZVX-26은 실제 또는 가상 중 무엇인지 입력하세요.'], shortAnswers: ['가상', '가상 바이러스', '가상바이러스', '가상 병원체'],
    explanation: 'ZVX-26은 실제 병원체가 아니라 게임 세계관 설정입니다.',
  },
  {
    id: 'booth-pdb-real', category: 'booth', difficulty: 'easy',
    briefing: 'BioDockLab은 공개 PDB의 실제 3차원 단백질 구조를 관찰하는 체험을 포함합니다.',
    prompts: ['BioDockLab에서 관찰하는 실제 공개 데이터는?', '이 부스에서 사용하는 실제 연구 데이터의 예는?', '3D 구조 체험에 활용하는 공개 데이터는?'],
    correct: 'PDB 단백질 구조', distractors: ['개인 병원 기록', '실시간 처방전', '개인 유전자 검사 결과'],
    trueStatement: 'BioDockLab은 공개 PDB 단백질 구조를 체험에 활용한다.',
    falseStatement: 'BioDockLab의 단백질 구조는 전부 장식용 그림뿐이다.',
    shortPrompts: ['공개 단백질 구조 데이터베이스의 약자를 입력하세요.'], shortAnswers: ['pdb'],
    explanation: 'PDB는 단백질 등 생체분자의 3차원 구조를 공개하는 대표 데이터베이스입니다.',
  },
  {
    id: 'booth-score-game', category: 'booth', difficulty: 'easy',
    briefing: '화면의 SCORE는 체험용 게임 점수이며 실제 치료 효과를 뜻하지 않습니다.',
    prompts: ['화면의 SCORE는 무엇을 의미하나요?', '게임 점수에 대한 설명으로 맞는 것은?', 'SCORE를 어떻게 해석해야 하나요?'],
    correct: '체험용 게임 점수', distractors: ['실제 치료 성공률', '실제 임상 승인 확률', '실제 약효 수치'],
    trueStatement: '화면의 SCORE는 체험용 게임 점수이다.',
    falseStatement: '화면의 SCORE가 높으면 실제 치료 효과가 증명된 것이다.',
    explanation: '점수는 체험 진행을 위한 게임 요소입니다.',
  },
  {
    id: 'booth-candidate', category: 'booth', difficulty: 'easy',
    briefing: '마지막 후보 선택은 치료제를 확정하는 것이 아니라 다음 연구 단계로 보낼 후보를 고르는 체험입니다.',
    prompts: ['마지막 후보 선택의 의미는?', '후보를 선택하면 무엇이 결정되나요?', '연구 후보 선택 단계에서 하는 일은?'],
    correct: '다음 연구 단계 후보를 고른다', distractors: ['치료제를 즉시 확정한다', '환자 처방을 결정한다', '임상 승인을 자동으로 받는다'],
    trueStatement: '후보 선택은 다음 연구 단계로 보낼 대상을 고르는 과정이다.',
    falseStatement: '후보 선택만으로 실제 치료제가 확정된다.',
    explanation: '후보 선정 뒤에도 추가 실험과 검증이 필요합니다.',
  },

  {
    id: 'covid-year-2019', category: 'infection', difficulty: 'easy',
    briefing: 'COVID-19는 2019년 말 중국 우한의 원인 불명 폐렴 집단 사례가 보고되면서 알려지기 시작했습니다.',
    prompts: ['COVID-19가 알려지기 시작한 해는?', 'COVID-19 초기 집단 사례가 보고된 연도는?', 'COVID-19와 연결되는 초기 보고 연도는?'],
    correct: '2019년', distractors: ['2009년', '2012년', '2024년'],
    trueStatement: 'COVID-19는 2019년 말 초기 집단 사례가 보고되면서 알려지기 시작했다.',
    falseStatement: 'COVID-19는 2009년에 처음 알려지기 시작했다.',
    shortPrompts: ['COVID-19 초기 집단 사례가 보고된 연도를 숫자로 입력하세요.'], shortAnswers: ['2019', '2019년'],
    explanation: '2019년 말 우한에서 원인 불명 폐렴 집단 사례가 보고되며 COVID-19가 알려지기 시작했습니다.',
  },
  {
    id: 'covid-pathogen', category: 'infection', difficulty: 'easy',
    briefing: 'COVID-19의 원인 바이러스는 SARS-CoV-2입니다.',
    prompts: ['COVID-19의 원인 바이러스는?', 'COVID-19를 일으키는 바이러스 이름은?', 'SARS-CoV-2가 일으키는 질환은 무엇인가요?'],
    correct: 'SARS-CoV-2', distractors: ['MERS-CoV', 'VZV', 'Norovirus'],
    trueStatement: 'COVID-19의 원인 바이러스는 SARS-CoV-2이다.',
    falseStatement: 'COVID-19의 원인 바이러스는 MERS-CoV이다.',
    shortPrompts: ['COVID-19의 원인 바이러스 이름을 입력하세요.'], shortAnswers: ['sars-cov-2', 'sars cov 2', 'sarscov2', '사스코로나바이러스2'],
    explanation: 'COVID-19은 SARS-CoV-2 감염에 의해 발생합니다.',
  },
  {
    id: 'covid-pandemic-2020', category: 'infection', difficulty: 'easy',
    briefing: 'WHO는 2020년 3월 COVID-19 상황을 팬데믹으로 규정했습니다.',
    prompts: ['WHO가 COVID-19를 팬데믹으로 규정한 해는?', 'COVID-19 팬데믹 규정 연도는?', 'WHO의 COVID-19 팬데믹 규정과 연결되는 연도는?'],
    correct: '2020년', distractors: ['2003년', '2009년', '2012년'],
    trueStatement: 'WHO는 2020년에 COVID-19 상황을 팬데믹으로 규정했다.',
    falseStatement: 'WHO는 2012년에 COVID-19를 팬데믹으로 규정했다.',
    shortPrompts: ['COVID-19 팬데믹 규정 연도를 입력하세요.'], shortAnswers: ['2020', '2020년'],
    explanation: 'WHO는 2020년 3월 COVID-19 상황을 팬데믹으로 규정했습니다.',
  },
  {
    id: 'mers-year-2012', category: 'infection', difficulty: 'easy',
    briefing: 'MERS-CoV는 2012년에 처음 확인되었습니다.',
    prompts: ['MERS-CoV가 처음 확인된 해는?', 'MERS와 연결되는 최초 확인 연도는?', 'MERS-CoV는 몇 년에 처음 확인되었나요?'],
    correct: '2012년', distractors: ['2009년', '2019년', '2024년'],
    trueStatement: 'MERS-CoV는 2012년에 처음 확인되었다.',
    falseStatement: 'MERS-CoV는 2019년에 처음 확인되었다.',
    shortPrompts: ['MERS-CoV가 처음 확인된 연도를 입력하세요.'], shortAnswers: ['2012', '2012년'],
    explanation: 'MERS-CoV는 2012년에 처음 확인되었습니다.',
  },
  {
    id: 'mers-coronavirus', category: 'infection', difficulty: 'easy',
    briefing: 'MERS-CoV는 코로나바이러스 계열의 바이러스입니다.',
    prompts: ['MERS-CoV는 어떤 계열인가요?', 'MERS의 원인 병원체는 어떤 종류인가요?', 'MERS-CoV에 대한 설명으로 맞는 것은?'],
    correct: '코로나바이러스', distractors: ['결핵균', '곰팡이', '기생충'],
    trueStatement: 'MERS-CoV는 코로나바이러스 계열이다.',
    falseStatement: 'MERS는 결핵균에 의해 발생한다.',
    explanation: 'MERS는 MERS coronavirus와 관련된 감염병입니다.',
  },
  {
    id: 'h1n1-year-2009', category: 'infection', difficulty: 'easy',
    briefing: '신종플루 A(H1N1)pdm09의 세계적 유행은 2009년과 연결됩니다.',
    prompts: ['신종플루 H1N1이 세계적으로 유행한 해는?', '2009년과 가장 관련 깊은 감염병은?', 'A(H1N1)pdm09의 유행 연도는?'],
    correct: '2009년', distractors: ['2012년', '2019년', '2024년'],
    trueStatement: '신종플루 H1N1의 세계적 유행은 2009년과 관련된다.',
    falseStatement: '신종플루 H1N1의 세계적 유행은 2019년에 처음 시작되었다.',
    shortPrompts: ['신종플루 H1N1 유행 연도를 입력하세요.'], shortAnswers: ['2009', '2009년'],
    explanation: '2009 H1N1 인플루엔자 유행은 2009년에 시작되었습니다.',
  },
  {
    id: 'h1n1-name', category: 'infection', difficulty: 'easy',
    briefing: '2009년 신종플루는 인플루엔자 A(H1N1)pdm09와 관련됩니다.',
    prompts: ['2009년 신종플루와 관련된 아형은?', '신종플루의 대표 표기는?', 'A형 인플루엔자 중 2009 신종플루와 연결되는 것은?'],
    correct: 'H1N1', distractors: ['H5N8', 'VZV', 'MERS-CoV'],
    trueStatement: '2009년 신종플루는 H1N1과 관련된다.',
    falseStatement: '2009년 신종플루의 원인은 VZV이다.',
    shortPrompts: ['2009년 신종플루의 아형을 입력하세요.'], shortAnswers: ['h1n1', 'a(h1n1)'],
    explanation: '2009년 신종 인플루엔자 유행은 A(H1N1)pdm09와 관련됩니다.',
  },
  {
    id: 'seasonal-flu-virus', category: 'infection', difficulty: 'easy',
    briefing: '계절성 독감은 인플루엔자 바이러스 감염과 관련됩니다.',
    prompts: ['계절성 독감의 원인으로 알맞은 것은?', '독감은 주로 어떤 병원체와 관련되나요?', '계절성 독감과 가장 관련 깊은 것은?'],
    correct: '인플루엔자 바이러스', distractors: ['결핵균', '노로바이러스만', '기생충만'],
    trueStatement: '계절성 독감은 인플루엔자 바이러스와 관련된다.',
    falseStatement: '계절성 독감은 결핵균에 의해 발생한다.',
    explanation: '계절성 독감은 인플루엔자 바이러스 감염에 의해 발생합니다.',
  },
  {
    id: 'tb-bacteria', category: 'infection', difficulty: 'easy',
    briefing: '결핵은 바이러스가 아니라 Mycobacterium tuberculosis라는 세균에 의해 발생합니다.',
    prompts: ['결핵의 원인 병원체 종류는?', '결핵은 바이러스일까요 세균일까요?', '결핵을 일으키는 병원체는 어떤 종류인가요?'],
    correct: '세균', distractors: ['바이러스', '기생충', '곰팡이만'],
    trueStatement: '결핵은 세균성 감염병이다.',
    falseStatement: '결핵은 바이러스성 감염병이다.',
    shortPrompts: ['결핵의 원인 병원체 종류를 입력하세요.'], shortAnswers: ['세균', '박테리아', 'bacteria'],
    explanation: '결핵은 Mycobacterium tuberculosis라는 세균에 의해 발생합니다.',
  },
  {
    id: 'influenza-b-virus', category: 'infection', difficulty: 'easy',
    briefing: 'B형 인플루엔자는 인플루엔자 B 바이러스와 관련되며 B형 간염과는 다른 질환입니다.',
    prompts: ['B형 인플루엔자의 원인은?', 'B형 인플루엔자와 B형 간염은 같은 질환인가요?', 'B형 인플루엔자에 대한 설명으로 맞는 것은?'],
    correct: '인플루엔자 B 바이러스', distractors: ['B형 간염 바이러스와 같은 질환', '결핵균', '노로바이러스'],
    trueStatement: 'B형 인플루엔자와 B형 간염은 서로 다른 질환이다.',
    falseStatement: 'B형 인플루엔자는 B형 간염의 다른 이름이다.',
    explanation: '이름에 B가 들어가지만 B형 인플루엔자와 B형 간염은 서로 다른 질환입니다.',
  },
  {
    id: 'measles-virus', category: 'infection', difficulty: 'easy',
    briefing: '홍역은 홍역 바이러스에 의해 발생하는 감염병입니다.',
    prompts: ['홍역의 원인 병원체 종류는?', '홍역은 바이러스성일까요 세균성일까요?', '홍역을 일으키는 것은?'],
    correct: '바이러스', distractors: ['결핵균', '기생충', '세균만'],
    trueStatement: '홍역은 바이러스성 감염병이다.',
    falseStatement: '홍역은 결핵균이 일으키는 질환이다.',
    explanation: '홍역은 Measles virus에 의해 발생합니다.',
  },
  {
    id: 'chickenpox-vzv', category: 'infection', difficulty: 'easy',
    briefing: '수두는 Varicella-zoster virus(VZV)에 의해 발생합니다.',
    prompts: ['수두의 원인 바이러스 약자는?', 'VZV와 가장 관련 깊은 질환은?', '수두를 일으키는 바이러스는?'],
    correct: 'VZV', distractors: ['H1N1', 'Mpro', 'PDB'],
    trueStatement: '수두는 VZV와 관련된다.',
    falseStatement: '수두는 H1N1이 직접 일으키는 질환이다.',
    shortPrompts: ['수두-대상포진 바이러스의 약자를 입력하세요.'], shortAnswers: ['vzv'],
    explanation: 'Varicella-zoster virus는 흔히 VZV로 표기합니다.',
  },
  {
    id: 'norovirus-gastro', category: 'infection', difficulty: 'easy',
    briefing: '노로바이러스는 급성 위장관염의 흔한 원인 중 하나입니다.',
    prompts: ['노로바이러스와 가장 관련 깊은 것은?', '급성 위장관염과 관련된 바이러스의 예는?', '노로바이러스 감염이 주로 일으키는 것은?'],
    correct: '급성 위장관염', distractors: ['골절', '결핵', '근육 염좌'],
    trueStatement: '노로바이러스는 급성 위장관염의 흔한 원인 중 하나이다.',
    falseStatement: '노로바이러스는 주로 골절을 일으킨다.',
    shortPrompts: ['급성 위장관염의 흔한 원인 바이러스 이름을 입력하세요.'], shortAnswers: ['노로바이러스', 'norovirus', 'noro'],
    explanation: '노로바이러스는 급성 위장관염을 일으킬 수 있습니다.',
  },

  {
    id: 'protein-3d', category: 'structure', difficulty: 'easy',
    briefing: '단백질의 3차원 구조는 기능과 상호작용을 이해하는 중요한 단서입니다.',
    prompts: ['단백질 기능을 이해할 때 중요한 단서는?', 'BioDockLab에서 단백질의 무엇을 관찰하나요?', '단백질 연구에서 중요한 입체 정보는?'],
    correct: '3차원 구조', distractors: ['배경색', '파일 이름 길이', '화면 밝기'],
    trueStatement: '단백질의 3차원 구조는 기능을 이해하는 단서가 된다.',
    falseStatement: '단백질의 3차원 구조는 기능과 전혀 관계가 없다.',
    explanation: '단백질의 입체 구조는 기능과 상호작용을 이해하는 데 중요한 정보입니다.',
  },
  {
    id: 'pdb-database', category: 'structure', difficulty: 'easy',
    briefing: 'PDB는 단백질 등 생체분자의 3차원 구조를 제공하는 공개 데이터베이스입니다.',
    prompts: ['PDB에서 주로 볼 수 있는 것은?', 'Protein Data Bank의 주요 데이터는?', 'PDB는 무엇을 확인하는 데 쓰이나요?'],
    correct: '생체분자의 3차원 구조', distractors: ['날씨 예보', '버스 시간표', '병원 예약 시간'],
    trueStatement: 'PDB는 생체분자의 3차원 구조 데이터를 제공한다.',
    falseStatement: 'PDB는 날씨 예보 데이터베이스이다.',
    shortPrompts: ['Protein Data Bank의 약자를 입력하세요.'], shortAnswers: ['pdb'],
    explanation: 'PDB는 구조생물학에서 널리 활용되는 공개 구조 데이터베이스입니다.',
  },
  {
    id: 'ligand', category: 'structure', difficulty: 'easy',
    briefing: '단백질과 결합하는 분자를 구조 연구에서는 리간드(ligand)라고 부르기도 합니다.',
    prompts: ['단백질과 결합하는 분자를 부르는 용어는?', '리간드는 무엇인가요?', '단백질과 상호작용하는 분자의 대표 용어는?'],
    correct: '리간드', distractors: ['픽셀', '프레임', '폴더'],
    trueStatement: '리간드는 단백질 등과 결합할 수 있는 분자를 뜻한다.',
    falseStatement: '리간드는 브라우저 창 크기를 뜻한다.',
    shortPrompts: ['단백질과 결합하는 분자를 부르는 용어를 입력하세요.'], shortAnswers: ['리간드', 'ligand'],
    explanation: '리간드는 특정 생체분자에 결합하는 분자를 의미합니다.',
  },
  {
    id: 'binding-site', category: 'structure', difficulty: 'easy',
    briefing: '단백질 표면에서 다른 분자가 결합할 수 있는 특정 공간을 결합 부위 또는 결합 포켓이라고 합니다.',
    prompts: ['다른 분자가 단백질과 결합하는 특정 위치는?', '결합 포켓은 무엇을 뜻하나요?', '단백질에서 리간드가 상호작용할 수 있는 공간은?'],
    correct: '결합 부위', distractors: ['주소창', '스크롤바', '파일명'],
    trueStatement: '단백질 표면의 특정 공간은 결합 부위가 될 수 있다.',
    falseStatement: '결합 부위는 브라우저 주소창을 의미한다.',
    shortPrompts: ['단백질에서 다른 분자가 결합하는 위치를 입력하세요.'], shortAnswers: ['결합 부위', '결합부위', '결합 포켓', '결합포켓', 'binding site', 'binding pocket'],
    explanation: '결합 부위는 다른 분자가 단백질과 상호작용하는 공간입니다.',
  },
  {
    id: 'structure-match', category: 'structure', difficulty: 'easy',
    briefing: '구조 매칭에서는 카드 색보다 단백질 자체의 전체적인 입체 형태를 비교합니다.',
    prompts: ['같은 단백질 구조를 찾을 때 무엇을 비교해야 하나요?', '1초 기억 미션에서 기억해야 할 것은?', '구조 매칭의 핵심 단서는?'],
    correct: '전체적인 입체 형태', distractors: ['카드 배경색', '버튼 위치', '글자 크기'],
    trueStatement: '구조 매칭에서는 단백질의 전체적인 입체 형태를 본다.',
    falseStatement: '구조 매칭에서는 배경색만 같으면 같은 구조이다.',
    explanation: '단백질 자체의 접힘과 전체적인 형태를 관찰하는 것이 핵심입니다.',
  },

  {
    id: 'research-not-proof', category: 'research', difficulty: 'easy',
    briefing: '컴퓨터 분석이나 구조 관찰만으로 실제 치료 효과가 확정되는 것은 아닙니다.',
    prompts: ['컴퓨터 분석 뒤에도 필요한 것은?', '구조상 좋아 보이는 후보를 찾은 뒤 무엇을 해야 하나요?', '후보 선정 이후 가장 적절한 단계는?'],
    correct: '추가 실험과 검증', distractors: ['즉시 처방', '검증 생략', '자동 임상 승인'],
    trueStatement: '컴퓨터 분석 결과만으로 실제 치료 효과가 확정되는 것은 아니다.',
    falseStatement: '화면에서 좋아 보이면 실제 치료제로 바로 확정할 수 있다.',
    explanation: '후보의 실제 효과와 안전성은 후속 연구와 검증이 필요합니다.',
  },
  {
    id: 'research-flow', category: 'research', difficulty: 'easy',
    briefing: '이 체험에서는 구조 확인 → 결합 공간 탐색 → 다음 연구 후보 지정의 흐름을 경험합니다.',
    prompts: ['BioDockLab의 연구 흐름으로 알맞은 것은?', '구조를 본 다음에는 무엇을 하나요?', '체험의 연구 사고 흐름은?'],
    correct: '구조 확인 → 결합 공간 탐색 → 후보 지정', distractors: ['처방 → 구조 삭제 → 종료', '후보 확정 → 검증 생략 → 종료', '점수 확인 → 화면 종료 → 처방'],
    trueStatement: '구조를 확인하고 결합 공간을 살핀 뒤 다음 연구 후보를 지정한다.',
    falseStatement: '이 체험은 구조를 보지 않고 바로 치료제를 확정한다.',
    explanation: '실제 연구 과정을 단순화해 구조 관찰에서 후보 의사결정까지 연결합니다.',
  },
  {
    id: 'research-candidate-next', category: 'research', difficulty: 'easy',
    briefing: '연구 후보 선택은 연구의 끝이 아니라 후속 검증으로 이어지는 결정입니다.',
    prompts: ['연구 후보를 고른 다음에는?', '후보 선정은 연구의 끝일까요?', '후보를 확보한 뒤 필요한 것은?'],
    correct: '후속 검증을 계속한다', distractors: ['즉시 판매한다', '모든 데이터를 삭제한다', '검증을 중단한다'],
    trueStatement: '후보를 고른 뒤에도 후속 검증이 필요하다.',
    falseStatement: '후보를 고르면 모든 연구가 끝난다.',
    explanation: '후보 선정은 다음 연구 단계로 이어지는 중간 결정입니다.',
  },
];

const PREFIXES = [
  '',
  '브리핑을 떠올려 보세요. ',
  '핵심 기억 카드에서 본 내용입니다. ',
  '빠르게 골라보세요. ',
  '연구원 체크! ',
];

const SUFFIXES = [
  '',
  ' 가장 알맞은 답을 고르세요.',
  ' 브리핑에서 본 내용을 기준으로 답하세요.',
];

function choiceVariant(seed: FactSeed, variant: number): MegaQuestion {
  const position = variant % 4;
  const options = [...seed.distractors];
  options.splice(position, 0, seed.correct);
  const prompt = seed.prompts[variant % seed.prompts.length];
  return {
    id: `${seed.id}-choice-${variant}`,
    family: seed.id,
    category: seed.category,
    type: 'choice',
    difficulty: seed.difficulty,
    briefing: seed.briefing,
    question: `${PREFIXES[variant % PREFIXES.length]}${prompt}${SUFFIXES[Math.floor(variant / PREFIXES.length) % SUFFIXES.length]}`,
    options,
    answer: position,
    explanation: seed.explanation,
  };
}

function oxVariant(seed: FactSeed, variant: number): MegaQuestion {
  const trueMode = variant % 2 === 0;
  return {
    id: `${seed.id}-ox-${variant}`,
    family: seed.id,
    category: seed.category,
    type: 'ox',
    difficulty: 'easy',
    briefing: seed.briefing,
    question: `${PREFIXES[(variant + 2) % PREFIXES.length]}${trueMode ? seed.trueStatement : seed.falseStatement}`,
    answer: trueMode ? 'O' : 'X',
    explanation: seed.explanation,
  };
}

function shortVariant(seed: FactSeed, variant: number): MegaQuestion {
  const prompts = seed.shortPrompts?.length ? seed.shortPrompts : seed.prompts;
  return {
    id: `${seed.id}-short-${variant}`,
    family: seed.id,
    category: seed.category,
    type: 'short',
    difficulty: 'easy',
    briefing: seed.briefing,
    question: `${PREFIXES[(variant + 1) % PREFIXES.length]}${prompts[variant % prompts.length]}`,
    answers: seed.shortAnswers ?? [seed.correct],
    explanation: seed.explanation,
  };
}

function buildPool(): MegaQuestion[] {
  const generated: MegaQuestion[] = [];
  // 27 beginner fact families × 38 variants > 1000, then fixed to exactly 1000.
  for (const seed of FACTS) {
    for (let variant = 0; variant < 38; variant += 1) {
      const mode = variant % 12;
      if (mode < 3) generated.push(oxVariant(seed, variant));
      else if (mode === 11 && seed.shortAnswers?.length) generated.push(shortVariant(seed, variant));
      else generated.push(choiceVariant(seed, variant));
    }
  }
  return generated.slice(0, 1000);
}

export const megaQuestionPool = buildPool();
