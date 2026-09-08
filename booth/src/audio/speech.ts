export type BioDockLabSpeechId =
  | 'welcome'
  | 'sample-detected'
  | 'capturing'
  | 'analyzing'
  | 'analysis-complete'
  | 'research-question'
  | 'protein'
  | 'ai-research'
  | 'candidate'
  | 'research-complete';

type SpeechDefinition = {
  text: string;
  rate?: number;
  pitch?: number;
};

const SPEECH: Record<
  BioDockLabSpeechId,
  SpeechDefinition
> = {
  welcome: {
    text:
      '바이오 도크 랩에 오신 것을 환영합니다. 샘플을 넣고 연구를 시작해 주세요.',
    rate: 0.94,
  },

  'sample-detected': {
    text:
      '샘플이 인식되었습니다.',
    rate: 0.95,
  },

  capturing: {
    text:
      '셀 스코프가 샘플 이미지를 촬영하고 있습니다.',
    rate: 0.95,
  },

  analyzing: {
    text:
      '세포 집합의 형태와 분포 특징을 분석합니다.',
    rate: 0.94,
  },

  'analysis-complete': {
    text:
      '샘플 분석이 완료되었습니다. 다음 연구 질문을 선택해 주세요.',
    rate: 0.94,
  },

  'research-question': {
    text:
      '이 샘플로 연구하고 싶은 질환을 선택해 주세요.',
    rate: 0.94,
  },

  protein: {
    text:
      '선택한 연구 질문과 관련된 단백질 구조를 탐색합니다.',
    rate: 0.94,
  },

  'ai-research': {
    text:
      '인공지능을 활용한 단백질 구조 연구 과정을 살펴봅니다.',
    rate: 0.94,
  },

  candidate: {
    text:
      '세 후보의 구조적 상호작용을 비교합니다. 더 탐색하고 싶은 연구 방향을 선택해 주세요.',
    rate: 0.93,
  },

  'research-complete': {
    text:
      '오늘의 연구 기록이 완성되었습니다. 바이오 도크 랩 연구 체험을 완료했습니다.',
    rate: 0.93,
  },
};

const getKoreanVoice = () => {
  if (
    typeof window === 'undefined' ||
    !('speechSynthesis' in window)
  ) {
    return null;
  }

  const voices =
    window.speechSynthesis.getVoices();

  return (
    voices.find(
      (voice) =>
        voice.lang
          .toLowerCase()
          .startsWith('ko') &&
        voice.localService,
    ) ??
    voices.find((voice) =>
      voice.lang
        .toLowerCase()
        .startsWith('ko'),
    ) ??
    null
  );
};

export const stopBioDockLabSpeech = () => {
  if (
    typeof window === 'undefined' ||
    !('speechSynthesis' in window)
  ) {
    return;
  }

  window.speechSynthesis.cancel();
};

export const speakBioDockLab = (
  id: BioDockLabSpeechId,
) => {
  if (
    typeof window === 'undefined' ||
    !('speechSynthesis' in window)
  ) {
    console.info(
      `[BioDockLab Voice] ${SPEECH[id].text}`,
    );

    return;
  }

  const definition = SPEECH[id];

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(
      definition.text,
    );

  utterance.lang = 'ko-KR';
  utterance.rate =
    definition.rate ?? 0.94;
  utterance.pitch =
    definition.pitch ?? 1;
  utterance.volume = 1;

  const voice = getKoreanVoice();

  if (voice) {
    utterance.voice = voice;
  }

  utterance.onerror = (event) => {
    if (
      event.error === 'canceled' ||
      event.error === 'interrupted'
    ) {
      return;
    }

    console.warn(
      '[BioDockLab Voice]',
      event.error,
    );
  };

  window.speechSynthesis.speak(
    utterance,
  );
};

export const getBioDockLabSpeechText = (
  id: BioDockLabSpeechId,
) => SPEECH[id].text;