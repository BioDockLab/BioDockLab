export type MegaQuestionCategory =
  | 'booth'
  | 'infection'
  | 'structure'
  | 'research';

export type MegaQuestionDifficulty =
  | 'easy'
  | 'normal'
  | 'hard';

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
  prompt: string;
  correct: string;
  distractors: [string, string, string];
  trueStatement: string;
  falseStatement: string;
  shortPrompt?: string;
  shortAnswers?: string[];
  explanation: string;
};

const FACTS: FactSeed[] = [
  {
    id: 'booth-90-sec',
    category: 'booth',
    difficulty: 'easy',
    briefing: 'BioDockLab: LAST HOPE는 90초 제한시간 안에 감염병 지식과 단백질 구조를 활용해 미션을 해결하는 체험입니다.',
    prompt: 'BioDockLab LAST HOPE의 제한시간은 얼마인가요?',
    correct: '90초',
    distractors: ['30초', '3분', '10분'],
    trueStatement: 'BioDockLab LAST HOPE의 기본 제한시간은 90초이다.',
    falseStatement: 'BioDockLab LAST HOPE는 제한시간 없이 진행된다.',
    shortPrompt: 'BioDockLab LAST HOPE의 제한시간을 숫자로 입력하세요.',
    shortAnswers: ['90', '90초', '1분30초', '1분 30초'],
    explanation: '브리핑을 마치고 미션을 시작하면 90초 카운트다운이 시작됩니다.',
  },
  {
    id: 'booth-zvx-fictional',
    category: 'booth',
    difficulty: 'easy',
    briefing: 'ZVX-26은 실제 병원체가 아니라 체험을 위해 만든 가상의 좀비 바이러스 설정입니다.',
    prompt: 'ZVX-26에 대한 설명으로 맞는 것은?',
    correct: '체험용 가상 바이러스',
    distractors: ['실제 WHO 지정 바이러스', '실제 국내 법정감염병', '실제 인플루엔자 아형'],
    trueStatement: 'ZVX-26은 BioDockLab 체험을 위한 가상 바이러스이다.',
    falseStatement: 'ZVX-26은 실제로 확인된 감염병 원인 바이러스이다.',
    shortPrompt: 'ZVX-26은 실제 병원체일까요, 가상 병원체일까요?',
    shortAnswers: ['가상', '가상병원체', '가상 바이러스', '가상바이러스'],
    explanation: 'ZVX-26은 실제 감염병이 아니라 게임 세계관을 위한 가상 설정입니다.',
  },
  {
    id: 'booth-pdb-real',
    category: 'booth',
    difficulty: 'normal',
    briefing: '게임 안 단백질 구조는 공개 PDB 구조 데이터를 활용해 관찰하도록 구성되어 있습니다.',
    prompt: 'BioDockLab에서 실제 데이터로 활용하는 것은 무엇인가요?',
    correct: '공개 PDB 단백질 구조',
    distractors: ['가상의 환자 처방전', '실시간 병원 전자의무기록', '개인 유전자 검사 결과'],
    trueStatement: 'BioDockLab은 실제 공개 PDB 단백질 구조를 체험에 활용한다.',
    falseStatement: 'BioDockLab의 단백질 구조는 모두 임의로 그린 장식 이미지뿐이다.',
    shortPrompt: '단백질 3차원 구조 데이터베이스의 대표 약자를 입력하세요.',
    shortAnswers: ['pdb'],
    explanation: 'PDB는 단백질 등 생체분자의 3차원 구조를 공개하는 대표 데이터베이스입니다.',
  },
  {
    id: 'booth-pass-seven',
    category: 'booth',
    difficulty: 'easy',
    briefing: '보안 퀴즈는 10문제 중 7문제 이상 맞혀야 다음 단계로 진행합니다.',
    prompt: '10문제 중 최소 몇 문제를 맞혀야 보안을 해제할 수 있나요?',
    correct: '7문제',
    distractors: ['3문제', '5문제', '10문제 모두'],
    trueStatement: '10문제 중 7문제 이상 맞히면 다음 단계로 진행할 수 있다.',
    falseStatement: '10문제 중 한 문제만 맞혀도 자동으로 다음 단계로 넘어간다.',
    shortPrompt: '통과 기준 정답 개수를 숫자로 입력하세요.',
    shortAnswers: ['7', '7개', '7문제'],
    explanation: '기본 통과 기준은 10문제 중 7문제 이상 정답입니다.',
  },
  {
    id: 'booth-score-game',
    category: 'booth',
    difficulty: 'normal',
    briefing: '화면의 SCORE는 체험 행동에 따른 게임 점수이며 실제 약효나 결합친화도 점수가 아닙니다.',
    prompt: '게임 화면의 SCORE가 의미하는 것은?',
    correct: '체험용 게임 점수',
    distractors: ['실제 치료 성공률', '임상시험 승인 확률', '실제 결합친화도'],
    trueStatement: 'BioDockLab의 SCORE는 체험용 게임 점수이다.',
    falseStatement: 'BioDockLab의 SCORE는 실제 치료 효과를 의미한다.',
    explanation: '점수는 미션 참여도를 보여주기 위한 게임 요소입니다.',
  },
  {
    id: 'booth-candidate-meaning',
    category: 'booth',
    difficulty: 'normal',
    briefing: '마지막 후보 선택은 실제 치료제를 확정하는 것이 아니라 다음 연구 단계로 보낼 후보를 지정하는 체험입니다.',
    prompt: '마지막 후보 선택 단계의 의미로 가장 적절한 것은?',
    correct: '다음 연구 단계 후보를 지정한다',
    distractors: ['실제 처방약을 확정한다', '환자의 복용량을 결정한다', '임상 승인을 자동으로 받는다'],
    trueStatement: '후보 선택은 다음 연구 단계로 보낼 대상을 지정하는 체험이다.',
    falseStatement: '후보 선택 버튼을 누르면 실제 치료 효과가 증명된다.',
    explanation: '후보 선정은 연구 과정의 일부이며 실제 효과를 확정하지 않습니다.',
  },
  {
    id: 'booth-timer-start',
    category: 'booth',
    difficulty: 'easy',
    briefing: '브리핑을 읽는 동안에는 시간이 흐르지 않고 START 버튼을 누른 순간부터 제한시간이 시작됩니다.',
    prompt: '90초 카운트다운은 언제 시작되나요?',
    correct: '브리핑 완료 후 START를 누를 때',
    distractors: ['페이지를 여는 즉시', '부스에 입장하기 전', '미션이 끝난 뒤'],
    trueStatement: '브리핑을 읽는 동안에는 90초 타이머가 진행되지 않는다.',
    falseStatement: '브리핑 화면을 여는 순간부터 90초가 줄어든다.',
    explanation: '브리핑을 충분히 읽고 START를 눌렀을 때부터 게임 시간이 흐릅니다.',
  },
  {
    id: 'booth-briefing-clue',
    category: 'booth',
    difficulty: 'easy',
    briefing: '부스 소개와 감염병 도감은 단순 설명이 아니라 뒤의 랜덤 퀴즈를 풀기 위한 단서입니다.',
    prompt: '미션 시작 전 브리핑을 읽어야 하는 가장 큰 이유는?',
    correct: '뒤의 문제를 풀 단서를 얻기 위해',
    distractors: ['화면 밝기를 조절하기 위해', '점수를 미리 올리기 위해', '타이머를 줄이기 위해'],
    trueStatement: '브리핑 내용 일부는 뒤의 문제를 푸는 단서가 된다.',
    falseStatement: '브리핑 내용은 게임 문제와 전혀 관계가 없다.',
    explanation: '부스 설명과 감염병 도감은 뒤의 퀴즈와 미니게임을 이해하도록 돕는 학습 구간입니다.',
  },

  {
    id: 'covid-pathogen',
    category: 'infection',
    difficulty: 'easy',
    briefing: 'COVID-19의 원인 바이러스는 SARS-CoV-2입니다.',
    prompt: 'COVID-19의 원인 바이러스는?',
    correct: 'SARS-CoV-2',
    distractors: ['MERS-CoV', 'Norovirus', 'Measles virus'],
    trueStatement: 'COVID-19의 원인 바이러스는 SARS-CoV-2이다.',
    falseStatement: 'COVID-19의 원인 바이러스는 MERS-CoV이다.',
    shortPrompt: 'COVID-19의 원인 바이러스 이름을 입력하세요.',
    shortAnswers: ['sars-cov-2', 'sars cov 2', 'sarscov2', '사스코로나바이러스2'],
    explanation: 'COVID-19은 SARS-CoV-2 감염에 의해 발생합니다.',
  },
  {
    id: 'covid-wuhan',
    category: 'infection',
    difficulty: 'normal',
    briefing: '2019년 말 중국 우한에서 원인 불명의 폐렴 집단 사례가 보고되면서 COVID-19가 알려지기 시작했습니다.',
    prompt: 'COVID-19 초기 집단 사례가 보고된 도시로 알려진 곳은?',
    correct: '우한',
    distractors: ['도쿄', '파리', '시드니'],
    trueStatement: 'COVID-19 초기 집단 사례는 2019년 말 중국 우한에서 보고되기 시작했다.',
    falseStatement: 'COVID-19 초기 집단 사례는 2012년 사우디아라비아에서 처음 알려졌다.',
    shortPrompt: '2019년 말 초기 집단 사례가 알려진 중국 도시를 입력하세요.',
    shortAnswers: ['우한', 'wuhan'],
    explanation: '2019년 말 중국 우한에서 원인 불명 폐렴 집단 사례가 보고되었습니다.',
  },
  {
    id: 'covid-pandemic-2020',
    category: 'infection',
    difficulty: 'normal',
    briefing: 'WHO는 2020년 3월 COVID-19 상황을 팬데믹으로 규정했습니다.',
    prompt: 'WHO가 COVID-19를 팬데믹으로 규정한 해는?',
    correct: '2020년',
    distractors: ['2009년', '2012년', '2024년'],
    trueStatement: 'WHO는 2020년에 COVID-19 상황을 팬데믹으로 규정했다.',
    falseStatement: 'WHO는 2009년에 COVID-19를 팬데믹으로 규정했다.',
    shortPrompt: 'COVID-19 팬데믹 선언 연도를 숫자로 입력하세요.',
    shortAnswers: ['2020', '2020년'],
    explanation: 'WHO는 2020년 3월 COVID-19 상황을 팬데믹으로 규정했습니다.',
  },
  {
    id: 'mers-year',
    category: 'infection',
    difficulty: 'easy',
    briefing: 'MERS-CoV는 2012년에 처음 확인되었습니다.',
    prompt: 'MERS-CoV가 처음 확인된 해는?',
    correct: '2012년',
    distractors: ['2003년', '2009년', '2020년'],
    trueStatement: 'MERS-CoV는 2012년에 처음 확인되었다.',
    falseStatement: 'MERS-CoV는 2020년에 처음 확인되었다.',
    shortPrompt: 'MERS-CoV가 처음 확인된 연도를 입력하세요.',
    shortAnswers: ['2012', '2012년'],
    explanation: 'MERS-CoV는 2012년에 처음 확인되었습니다.',
  },
  {
    id: 'mers-coronavirus',
    category: 'infection',
    difficulty: 'easy',
    briefing: 'MERS-CoV는 코로나바이러스 계열의 바이러스입니다.',
    prompt: 'MERS-CoV는 어떤 계열의 병원체인가요?',
    correct: '코로나바이러스',
    distractors: ['결핵균', '노로바이러스', '홍역균'],
    trueStatement: 'MERS-CoV는 코로나바이러스 계열이다.',
    falseStatement: 'MERS는 결핵균에 의해 발생한다.',
    explanation: 'MERS는 Middle East Respiratory Syndrome coronavirus와 관련된 감염병입니다.',
  },
  {
    id: 'h1n1-2009',
    category: 'infection',
    difficulty: 'easy',
    briefing: '2009년 세계적으로 유행한 신종 인플루엔자는 A(H1N1)pdm09 계열과 관련됩니다.',
    prompt: '2009년 신종플루와 가장 관련 깊은 아형은?',
    correct: 'H1N1',
    distractors: ['H5N8', 'VZV', 'MERS-CoV'],
    trueStatement: '2009년 신종플루 유행은 H1N1 인플루엔자 A와 관련된다.',
    falseStatement: '2009년 신종플루 유행의 원인은 노로바이러스였다.',
    shortPrompt: '2009년 신종플루와 관련된 인플루엔자 아형을 입력하세요.',
    shortAnswers: ['h1n1', 'a(h1n1)', 'influenzaah1n1'],
    explanation: '2009년 신종 인플루엔자 유행은 A(H1N1)pdm09 계열과 관련됩니다.',
  },
  {
    id: 'seasonal-flu-ab',
    category: 'infection',
    difficulty: 'normal',
    briefing: '계절성 독감의 주요 원인에는 인플루엔자 A형과 B형 바이러스가 포함됩니다.',
    prompt: '계절성 독감의 주요 원인으로 알맞은 것은?',
    correct: '인플루엔자 A형과 B형',
    distractors: ['결핵균과 대장균', '노로바이러스만', '홍역 바이러스만'],
    trueStatement: '계절성 독감은 인플루엔자 A형과 B형 바이러스와 관련된다.',
    falseStatement: '계절성 독감은 결핵균에 의해 발생한다.',
    explanation: '계절성 독감은 인플루엔자 바이러스 감염에 의해 발생합니다.',
  },
  {
    id: 'tb-bacteria',
    category: 'infection',
    difficulty: 'easy',
    briefing: '결핵은 바이러스가 아니라 결핵균이라는 세균에 의해 발생합니다.',
    prompt: '결핵의 원인 병원체 종류는?',
    correct: '세균',
    distractors: ['바이러스', '곰팡이만', '기생충만'],
    trueStatement: '결핵은 세균성 감염병이다.',
    falseStatement: '결핵은 바이러스성 감염병이다.',
    shortPrompt: '결핵을 일으키는 병원체 종류를 입력하세요.',
    shortAnswers: ['세균', '박테리아', 'bacteria', 'bacterium'],
    explanation: '결핵은 Mycobacterium tuberculosis라는 세균에 의해 발생합니다.',
  },
  {
    id: 'tb-airborne',
    category: 'infection',
    difficulty: 'normal',
    briefing: '활동성 폐결핵 환자가 기침하거나 말할 때 공기 중으로 배출된 결핵균이 전파에 관여할 수 있습니다.',
    prompt: '폐결핵 전파와 가장 관련 있는 것은?',
    correct: '공기 중으로 배출된 결핵균',
    distractors: ['단순 피부색 변화', '유전만으로 전파', '화면 접촉만으로 전파'],
    trueStatement: '활동성 폐결핵은 공기를 통한 전파가 가능하다.',
    falseStatement: '결핵은 사람 사이에서 절대 전파되지 않는다.',
    explanation: '활동성 폐결핵은 공기 중에 배출된 결핵균을 통해 전파될 수 있습니다.',
  },
  {
    id: 'influenza-b-not-hepatitis',
    category: 'infection',
    difficulty: 'normal',
    briefing: 'B형 인플루엔자는 B형 간염과 이름이 비슷하지만 서로 다른 질환입니다.',
    prompt: 'B형 인플루엔자와 B형 간염의 관계는?',
    correct: '서로 다른 질환이다',
    distractors: ['완전히 같은 질환이다', '둘 다 결핵이다', '둘 다 노로바이러스다'],
    trueStatement: 'B형 인플루엔자와 B형 간염은 서로 다른 질환이다.',
    falseStatement: 'B형 인플루엔자는 B형 간염의 다른 이름이다.',
    explanation: 'B형 인플루엔자와 B형 간염은 원인과 질환 자체가 다릅니다.',
  },
  {
    id: 'measles-virus',
    category: 'infection',
    difficulty: 'easy',
    briefing: '홍역은 홍역 바이러스에 의해 발생하는 전염성이 높은 감염병입니다.',
    prompt: '홍역의 원인 병원체 종류는?',
    correct: '바이러스',
    distractors: ['결핵균', '세균만', '기생충만'],
    trueStatement: '홍역은 바이러스성 감염병이다.',
    falseStatement: '홍역은 결핵균이 일으키는 질환이다.',
    explanation: '홍역은 Measles virus에 의해 발생합니다.',
  },
  {
    id: 'chickenpox-vzv',
    category: 'infection',
    difficulty: 'normal',
    briefing: '수두는 Varicella-zoster virus(VZV)에 의해 발생합니다.',
    prompt: '수두의 원인 바이러스 약자는?',
    correct: 'VZV',
    distractors: ['H1N1', 'Mpro', 'PDB'],
    trueStatement: '수두는 Varicella-zoster virus와 관련된다.',
    falseStatement: '수두는 SARS-CoV-2가 직접 일으키는 질환이다.',
    shortPrompt: '수두-대상포진 바이러스의 대표 약자를 입력하세요.',
    shortAnswers: ['vzv'],
    explanation: 'Varicella-zoster virus는 흔히 VZV로 표기합니다.',
  },
  {
    id: 'norovirus-gastro',
    category: 'infection',
    difficulty: 'easy',
    briefing: '노로바이러스는 급성 위장관염의 흔한 원인 중 하나입니다.',
    prompt: '노로바이러스와 가장 관련 깊은 것은?',
    correct: '급성 위장관염',
    distractors: ['결핵', '골절', '근육 염좌'],
    trueStatement: '노로바이러스는 급성 위장관염의 흔한 원인 중 하나이다.',
    falseStatement: '노로바이러스는 주로 골절을 일으키는 병원체이다.',
    shortPrompt: '급성 위장관염의 흔한 원인 중 하나인 바이러스 이름을 입력하세요.',
    shortAnswers: ['노로바이러스', 'norovirus', 'noro'],
    explanation: '노로바이러스 감염은 구토와 설사 등을 동반한 급성 위장관염을 일으킬 수 있습니다.',
  },
  {
    id: 'virus-host-cell',
    category: 'infection',
    difficulty: 'normal',
    briefing: '바이러스는 일반적으로 숙주 세포의 시스템을 이용해 증식합니다.',
    prompt: '바이러스 증식에 대한 설명으로 알맞은 것은?',
    correct: '숙주 세포의 시스템을 이용한다',
    distractors: ['항상 혼자서 독립 증식한다', '세포 없이도 항상 완전한 대사를 한다', '유전물질이 전혀 없다'],
    trueStatement: '바이러스는 일반적으로 숙주 세포의 시스템을 이용해 증식한다.',
    falseStatement: '바이러스는 숙주 세포와 무관하게 항상 독립적으로 증식한다.',
    explanation: '바이러스는 숙주 세포의 여러 기능을 이용해 복제됩니다.',
  },
  {
    id: 'virus-genetic-material',
    category: 'infection',
    difficulty: 'normal',
    briefing: '바이러스는 DNA 또는 RNA 형태의 유전물질을 가질 수 있습니다.',
    prompt: '바이러스의 유전물질에 대한 설명으로 맞는 것은?',
    correct: 'DNA 또는 RNA를 가질 수 있다',
    distractors: ['유전물질이 절대 없다', '항상 단백질만 있다', '항상 사람 DNA만 가진다'],
    trueStatement: '바이러스는 DNA 또는 RNA 형태의 유전물질을 가질 수 있다.',
    falseStatement: '모든 바이러스에는 유전물질이 전혀 없다.',
    explanation: '바이러스는 종류에 따라 DNA 또는 RNA 유전체를 가질 수 있습니다.',
  },

  {
    id: 'protein-3d-function',
    category: 'structure',
    difficulty: 'easy',
    briefing: '단백질의 3차원 구조는 기능과 상호작용을 이해하는 중요한 단서입니다.',
    prompt: '단백질의 기능을 이해할 때 중요한 단서로 알맞은 것은?',
    correct: '3차원 구조',
    distractors: ['브라우저 배경색', '파일명의 길이', '화면 해상도만'],
    trueStatement: '단백질의 기능은 3차원 구조와 관련이 있다.',
    falseStatement: '단백질의 3차원 구조는 기능과 전혀 관계가 없다.',
    explanation: '단백질의 입체 구조는 다른 분자와의 상호작용과 기능에 중요한 영향을 줍니다.',
  },
  {
    id: 'pdb-database',
    category: 'structure',
    difficulty: 'easy',
    briefing: 'Protein Data Bank(PDB)는 단백질 등 생체분자의 3차원 구조를 제공하는 대표적인 공개 데이터베이스입니다.',
    prompt: 'PDB에서 주로 확인할 수 있는 것은?',
    correct: '생체분자의 3차원 구조',
    distractors: ['병원 예약 시간', '약국 재고', '기상 예보'],
    trueStatement: 'PDB는 단백질 등 생체분자의 3차원 구조 데이터를 제공한다.',
    falseStatement: 'PDB는 주로 날씨 예보를 제공하는 데이터베이스이다.',
    shortPrompt: 'Protein Data Bank의 약자를 입력하세요.',
    shortAnswers: ['pdb'],
    explanation: 'PDB는 구조생물학에서 널리 활용되는 공개 구조 데이터베이스입니다.',
  },
  {
    id: 'ligand-term',
    category: 'structure',
    difficulty: 'normal',
    briefing: '단백질과 결합하는 분자를 구조 연구에서는 ligand라고 부르기도 합니다.',
    prompt: '단백질과 결합하는 분자를 가리키는 용어는?',
    correct: '리간드',
    distractors: ['픽셀', '프레임', '폴더'],
    trueStatement: '리간드는 단백질 등과 결합할 수 있는 분자를 가리키는 용어이다.',
    falseStatement: '리간드는 웹브라우저 창 크기를 뜻하는 용어이다.',
    shortPrompt: '단백질과 결합하는 분자를 부르는 용어를 입력하세요.',
    shortAnswers: ['리간드', 'ligand'],
    explanation: '리간드는 특정 생체분자에 결합하는 분자를 의미합니다.',
  },
  {
    id: 'binding-site',
    category: 'structure',
    difficulty: 'normal',
    briefing: '단백질 표면의 특정 입체 공간은 다른 분자가 상호작용하는 결합 부위가 될 수 있습니다.',
    prompt: '다른 분자가 단백질과 상호작용하는 특정 위치를 무엇이라고 할 수 있나요?',
    correct: '결합 부위',
    distractors: ['배경 영역', '스크롤바', '파일명'],
    trueStatement: '단백질 표면의 특정 공간은 결합 부위가 될 수 있다.',
    falseStatement: '결합 부위는 브라우저 주소창을 뜻한다.',
    shortPrompt: '단백질에서 다른 분자가 결합하는 특정 위치를 입력하세요.',
    shortAnswers: ['결합부위', '결합 부위', '결합포켓', '결합 포켓', 'binding site', 'binding pocket'],
    explanation: '결합 부위 또는 결합 포켓은 분자가 상호작용하는 공간을 의미합니다.',
  },
  {
    id: 'reference-ligand',
    category: 'structure',
    difficulty: 'normal',
    briefing: '실제 구조에서 함께 관찰된 reference ligand는 결합 위치를 탐색하는 단서가 될 수 있습니다.',
    prompt: 'reference ligand를 관찰하는 가장 적절한 이유는?',
    correct: '결합 위치를 탐색하는 단서로 활용',
    distractors: ['PDB 번호를 바꾸기 위해', '화면 밝기를 높이기 위해', '단백질 색을 고정하기 위해'],
    trueStatement: 'reference ligand의 위치는 결합 부위를 이해하는 단서가 될 수 있다.',
    falseStatement: 'reference ligand는 구조 연구와 전혀 관계가 없다.',
    explanation: '기준 리간드의 위치는 단백질의 결합 공간을 이해하는 데 도움을 줄 수 있습니다.',
  },
  {
    id: 'mpro-protease',
    category: 'structure',
    difficulty: 'normal',
    briefing: 'SARS-CoV-2의 Mpro는 Main protease를 의미합니다.',
    prompt: 'Mpro의 pro가 의미하는 것과 가장 가까운 것은?',
    correct: 'protease',
    distractors: ['program', 'profile', 'project'],
    trueStatement: 'Mpro는 Main protease를 뜻한다.',
    falseStatement: 'Mpro의 pro는 project를 뜻한다.',
    shortPrompt: 'Mpro에서 pro가 의미하는 영어 단어를 입력하세요.',
    shortAnswers: ['protease'],
    explanation: 'Mpro는 Main protease의 약칭입니다.',
  },

  {
    id: 'research-computation-not-proof',
    category: 'research',
    difficulty: 'normal',
    briefing: '컴퓨터 분석과 구조 관찰은 연구 과정의 일부이며 실제 치료 효과를 확정하지 않습니다.',
    prompt: '컴퓨터 분석 결과가 좋아 보인 뒤에도 필요한 것은?',
    correct: '추가 실험과 검증',
    distractors: ['즉시 실제 환자 처방', '검증 과정 생략', '자동 임상 승인'],
    trueStatement: '컴퓨터 분석 결과만으로 실제 치료 효과가 증명되는 것은 아니다.',
    falseStatement: '컴퓨터 화면에서 잘 맞아 보이면 실제 치료 효과도 자동으로 확정된다.',
    explanation: '후보물질의 실제 효과와 안전성은 후속 연구와 검증이 필요합니다.',
  },
  {
    id: 'research-candidate-next-step',
    category: 'research',
    difficulty: 'easy',
    briefing: '후보 선택은 연구의 끝이 아니라 후속 검증 단계로 이어지는 결정입니다.',
    prompt: '연구 후보를 선택한 다음 가장 적절한 태도는?',
    correct: '추가 검증을 진행한다',
    distractors: ['즉시 치료제로 확정한다', '모든 데이터를 삭제한다', '검증을 중단한다'],
    trueStatement: '후보물질을 선택한 뒤에도 추가 연구와 검증이 필요하다.',
    falseStatement: '후보물질 선택은 연구의 모든 과정이 끝났다는 뜻이다.',
    explanation: '후보 선정 이후에도 다양한 실험과 검증 단계가 이어질 수 있습니다.',
  },
  {
    id: 'research-structure-match',
    category: 'research',
    difficulty: 'easy',
    briefing: '구조 매칭에서는 카드 색이 아니라 단백질 자체의 전체적인 입체 형태를 비교해야 합니다.',
    prompt: '같은 단백질 구조를 찾을 때 가장 먼저 비교할 것은?',
    correct: '전체적인 입체 형태',
    distractors: ['카드 배경색', '버튼 위치', '글자 크기'],
    trueStatement: '구조 매칭에서는 단백질의 전체적인 입체 형태를 관찰해야 한다.',
    falseStatement: '구조 매칭에서는 배경색만 같으면 같은 단백질로 판단한다.',
    explanation: '단백질 구조 자체의 접힘과 전체적인 형태를 관찰하는 것이 핵심입니다.',
  },
  {
    id: 'research-order',
    category: 'research',
    difficulty: 'normal',
    briefing: '이 체험에서는 구조 확인 → 결합 가능 공간 탐색 → 다음 연구 후보 지정 순서로 연구 사고 흐름을 경험합니다.',
    prompt: 'BioDockLab의 연구 흐름으로 가장 자연스러운 순서는?',
    correct: '구조 확인 → 결합 공간 탐색 → 후보 지정',
    distractors: ['후보 지정 → 구조 삭제 → 종료', '처방 → 진단 생략 → 구조 확인', '점수 확인 → 배경 변경 → 종료'],
    trueStatement: '구조 확인 후 결합 공간을 살피고 다음 연구 후보를 지정하는 흐름을 체험한다.',
    falseStatement: '이 체험은 단백질 구조를 전혀 보지 않고 바로 치료제를 확정한다.',
    explanation: '체험은 구조 관찰에서 연구 후보 의사결정까지의 흐름을 게임으로 단순화합니다.',
  },
];

const PREFIXES = [
  '',
  '브리핑 내용을 떠올려 보세요. ',
  '감염병 도감의 단서를 기준으로, ',
  '연구원이라면 어떻게 판단할까요? ',
  'MISSION CHECK. ',
  'ZVX-26 대응 훈련 중입니다. ',
  '빠르게 판단하세요. ',
  '핵심 단서를 확인하세요. ',
];

const SUFFIXES = [
  '',
  ' 가장 알맞은 답을 고르세요.',
  ' 브리핑을 근거로 답하세요.',
  ' 한 번 더 생각하고 선택하세요.',
];

function choiceVariant(seed: FactSeed, variant: number): MegaQuestion {
  const position = variant % 4;
  const wrong = [...seed.distractors];
  const options = [...wrong];
  options.splice(position, 0, seed.correct);

  return {
    id: `${seed.id}-choice-${variant}`,
    family: seed.id,
    category: seed.category,
    type: 'choice',
    difficulty: seed.difficulty,
    briefing: seed.briefing,
    question: `${PREFIXES[variant % PREFIXES.length]}${seed.prompt}${SUFFIXES[Math.floor(variant / PREFIXES.length) % SUFFIXES.length]}`,
    options,
    answer: position,
    explanation: seed.explanation,
  };
}

function oxVariant(seed: FactSeed, variant: number): MegaQuestion {
  const trueMode = variant % 2 === 0;
  const statement = trueMode ? seed.trueStatement : seed.falseStatement;

  return {
    id: `${seed.id}-ox-${variant}`,
    family: seed.id,
    category: seed.category,
    type: 'ox',
    difficulty: seed.difficulty === 'hard' ? 'normal' : seed.difficulty,
    briefing: seed.briefing,
    question: `${PREFIXES[(variant + 3) % PREFIXES.length]}${statement}`,
    answer: trueMode ? 'O' : 'X',
    explanation: seed.explanation,
  };
}

function shortVariant(seed: FactSeed, variant: number): MegaQuestion {
  return {
    id: `${seed.id}-short-${variant}`,
    family: seed.id,
    category: seed.category,
    type: 'short',
    difficulty: seed.difficulty === 'hard' ? 'normal' : seed.difficulty,
    briefing: seed.briefing,
    question: `${PREFIXES[(variant + 5) % PREFIXES.length]}${seed.shortPrompt ?? seed.prompt}`,
    answers: seed.shortAnswers ?? [seed.correct],
    explanation: seed.explanation,
  };
}

function buildPool(): MegaQuestion[] {
  const generated: MegaQuestion[] = [];

  for (const seed of FACTS) {
    for (let variant = 0; variant < 32; variant += 1) {
      const mode = variant % 10;

      if (mode < 2) {
        generated.push(oxVariant(seed, variant));
      } else if (mode >= 8 && seed.shortAnswers?.length) {
        generated.push(shortVariant(seed, variant));
      } else {
        generated.push(choiceVariant(seed, variant));
      }
    }
  }

  return generated.slice(0, 1000);
}

export const megaQuestionPool = buildPool();
