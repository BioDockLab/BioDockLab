export type InfectionBriefing = {
  id: string;
  name: string;
  tag: string;
  pathogenType: 'virus' | 'bacteria';
  pathogen: string;
  accent: 'blue' | 'green' | 'violet' | 'red' | 'orange' | 'cyan';
  summary: string;
  transmission: string;
  clue: string;
};

export const infectionBriefings: InfectionBriefing[] = [
  {
    id: 'covid19',
    name: 'COVID-19',
    tag: '2019',
    pathogenType: 'virus',
    pathogen: 'SARS-CoV-2',
    accent: 'blue',

    summary:
      '2019년 말 중국 우한에서 원인 불명의 폐렴 집단이 보고되면서 알려진 호흡기 감염병입니다.',

    transmission:
      '감염자의 호흡기 비말과 에어로졸 등을 통해 전파될 수 있습니다.',

    clue:
      'SARS-CoV-2의 단백질 3차원 구조는 바이러스의 기능과 상호작용을 연구하는 중요한 단서입니다.',
  },

  {
    id: 'mers',
    name: 'MERS',
    tag: '2012',
    pathogenType: 'virus',
    pathogen: 'MERS-CoV',
    accent: 'green',

    summary:
      '2012년 처음 확인된 중동호흡기증후군으로, 코로나바이러스 계열의 호흡기 감염병입니다.',

    transmission:
      '감염자와의 밀접 접촉 등으로 사람 사이 전파가 일어날 수 있습니다.',

    clue:
      'MERS-CoV 역시 여러 단백질을 이용하며, 단백질 구조 분석은 바이러스 기능 연구에 활용됩니다.',
  },

  {
    id: 'h1n1-2009',
    name: '신종플루',
    tag: 'H1N1 · 2009',
    pathogenType: 'virus',
    pathogen: 'Influenza A(H1N1)pdm09',
    accent: 'violet',

    summary:
      '2009년 세계적으로 유행한 새로운 H1N1 인플루엔자 A 바이러스에 의한 감염병입니다.',

    transmission:
      '주로 호흡기 분비물과 가까운 접촉을 통해 전파됩니다.',

    clue:
      '인플루엔자 바이러스의 표면 단백질은 바이러스의 감염과 확산 과정에서 중요한 역할을 합니다.',
  },

  {
    id: 'seasonal-flu',
    name: '계절성 독감',
    tag: 'INFLUENZA',
    pathogenType: 'virus',
    pathogen: 'Influenza A / B viruses',
    accent: 'cyan',

    summary:
      '매년 계절적으로 유행하는 급성 호흡기 감염병으로 인플루엔자 A형과 B형 등이 주요 원인입니다.',

    transmission:
      '기침과 재채기 등에서 나온 호흡기 입자를 통해 전파될 수 있습니다.',

    clue:
      '독감은 일반 감기와 다른 질환이며, 인플루엔자 바이러스의 변화를 지속적으로 관찰합니다.',
  },

  {
    id: 'tuberculosis',
    name: '결핵',
    tag: 'BACTERIA',
    pathogenType: 'bacteria',
    pathogen: 'Mycobacterium tuberculosis',
    accent: 'orange',

    summary:
      '결핵균이라는 세균이 일으키는 감염병으로 주로 폐에 영향을 주지만 다른 장기에도 발생할 수 있습니다.',

    transmission:
      '활동성 폐결핵 환자가 기침하거나 말할 때 공기 중으로 배출된 결핵균을 통해 전파될 수 있습니다.',

    clue:
      '중요: 결핵은 바이러스가 아니라 세균에 의해 발생합니다.',
  },

  {
    id: 'influenza-b',
    name: 'B형 인플루엔자',
    tag: 'INFLUENZA B',
    pathogenType: 'virus',
    pathogen: 'Influenza B virus',
    accent: 'green',

    summary:
      '계절성 독감의 주요 원인 중 하나인 인플루엔자 B 바이러스에 의한 호흡기 감염입니다.',

    transmission:
      '호흡기 분비물과 가까운 접촉 등을 통해 전파될 수 있습니다.',

    clue:
      'B형 인플루엔자는 B형 간염과 전혀 다른 질환입니다.',
  },

  {
    id: 'measles',
    name: '홍역',
    tag: 'MEASLES',
    pathogenType: 'virus',
    pathogen: 'Measles virus',
    accent: 'red',

    summary:
      '홍역 바이러스에 의해 발생하는 전염성이 매우 높은 급성 감염병입니다.',

    transmission:
      '공기 중 호흡기 입자를 통해 쉽게 전파될 수 있습니다.',

    clue:
      '홍역은 예방접종을 통해 예방할 수 있는 대표적인 감염병입니다.',
  },

  {
    id: 'chickenpox',
    name: '수두',
    tag: 'VZV',
    pathogenType: 'virus',
    pathogen: 'Varicella-zoster virus',
    accent: 'violet',

    summary:
      '수두-대상포진 바이러스가 일으키며 발열과 특징적인 수포성 발진이 나타날 수 있습니다.',

    transmission:
      '호흡기 분비물이나 수포 병변과의 직접 접촉 등을 통해 전파될 수 있습니다.',

    clue:
      '수두를 일으킨 바이러스는 감염 후 몸속에 잠복했다가 이후 대상포진으로 재활성화될 수 있습니다.',
  },

  {
    id: 'norovirus',
    name: '노로바이러스',
    tag: 'GASTROENTERITIS',
    pathogenType: 'virus',
    pathogen: 'Norovirus',
    accent: 'cyan',

    summary:
      '급성 위장관염의 흔한 원인으로 구토와 설사 등의 증상을 일으킬 수 있습니다.',

    transmission:
      '오염된 음식·물·표면 또는 감염자와의 접촉을 통해 쉽게 전파됩니다.',

    clue:
      '노로바이러스는 적은 양으로도 전파될 수 있어 손 위생과 환경 관리가 중요합니다.',
  },
];
