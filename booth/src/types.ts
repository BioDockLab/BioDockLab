export type ThemeId =
  | 'brain-organoid'
  | 'cancer-cell'
  | 'neuron';

export type DiseaseId =
  | 'glioblastoma'
  | 'alzheimers'
  | 'parkinsons';

export type CellModelId =
  | '2d-cell'
  | '3d-organoid';

export type CandidateId =
  | 'candidate-a'
  | 'candidate-b'
  | 'candidate-c';

export type ResearchSession = {
  sessionId: string;
  researcherName: string;
  dreamRole: string;

  themeId: ThemeId;
  diseaseId: DiseaseId;
  cellModelId: CellModelId;

  proteinId: 'egfr';

  selectedCandidateId: CandidateId;

  /**
   * true only after the visitor explicitly selects
   * a candidate as their next research direction.
   *
   * selectedCandidateId may contain a default value
   * for rendering, but it must not be treated as the
   * visitor's decision until this flag is true.
   */
  candidateConfirmed: boolean;

  startedAt: string;
};

export type Theme = {
  id: ThemeId;
  title: string;
  description: string;
  tags: string[];
  icon:
    | 'brain'
    | 'cells'
    | 'neuron';
};

export type Disease = {
  id: DiseaseId;
  title: string;
  titleEn: string;
  description: string;
  recommended?: boolean;
  icon:
    | 'cells'
    | 'neuron'
    | 'spark';
};

export type Candidate = {
  id: CandidateId;
  name: string;
  code: string;
  dockingScore: number;
  stability: number;
  selectivity: number;
  solubility: number;
  interactions: string[];
  feature: string;
  accent:
    | 'blue'
    | 'cyan'
    | 'purple';
};