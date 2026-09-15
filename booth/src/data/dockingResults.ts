import type {
  CandidateId,
} from '../types';

import type {
  DeepDiveProteinId,
} from './dockingTargets';

export type DockingCandidateResult = {
  id: CandidateId;

  name: string;
  code: string;

  status:
    | 'pending'
    | 'verified';

  vinaScore:
    | number
    | null;

  interactions: string[];

  note: string;
};

export type DockingResultSet = {
  proteinId: DeepDiveProteinId;

  calculation: {
    engine: 'AutoDock Vina';

    version:
      | string
      | null;

    computedAt:
      | string
      | null;

    status:
      | 'pending'
      | 'verified';
  };

  candidates:
    DockingCandidateResult[];
};

/**
 * Booth rule:
 *
 * Numerical scores must remain null until
 * an actual pre-calculated result has been
 * reviewed and inserted.
 */
export const dockingResults:
Record<
  DeepDiveProteinId,
  DockingResultSet
> = {
  'sars2-mpro': {
    proteinId:
      'sars2-mpro',

    calculation: {
      engine:
        'AutoDock Vina',

      version: null,
      computedAt: null,
      status: 'pending',
    },

    candidates: [
      {
        id: 'candidate-a',
        name: 'COVID Candidate A',
        code: 'C19-MPRO-A',
        status: 'pending',
        vinaScore: null,
        interactions: [],
        note:
          '사전 계산 결과 검증 대기',
      },
      {
        id: 'candidate-b',
        name: 'COVID Candidate B',
        code: 'C19-MPRO-B',
        status: 'pending',
        vinaScore: null,
        interactions: [],
        note:
          '사전 계산 결과 검증 대기',
      },
      {
        id: 'candidate-c',
        name: 'COVID Candidate C',
        code: 'C19-MPRO-C',
        status: 'pending',
        vinaScore: null,
        interactions: [],
        note:
          '사전 계산 결과 검증 대기',
      },
    ],
  },

  'mers-mpro': {
    proteinId:
      'mers-mpro',

    calculation: {
      engine:
        'AutoDock Vina',

      version: null,
      computedAt: null,
      status: 'pending',
    },

    candidates: [
      {
        id: 'candidate-a',
        name: 'MERS Candidate A',
        code: 'MERS-MPRO-A',
        status: 'pending',
        vinaScore: null,
        interactions: [],
        note:
          '사전 계산 결과 검증 대기',
      },
      {
        id: 'candidate-b',
        name: 'MERS Candidate B',
        code: 'MERS-MPRO-B',
        status: 'pending',
        vinaScore: null,
        interactions: [],
        note:
          '사전 계산 결과 검증 대기',
      },
      {
        id: 'candidate-c',
        name: 'MERS Candidate C',
        code: 'MERS-MPRO-C',
        status: 'pending',
        vinaScore: null,
        interactions: [],
        note:
          '사전 계산 결과 검증 대기',
      },
    ],
  },

  'h1n1-neuraminidase': {
    proteinId:
      'h1n1-neuraminidase',

    calculation: {
      engine:
        'AutoDock Vina',

      version: null,
      computedAt: null,
      status: 'pending',
    },

    candidates: [
      {
        id: 'candidate-a',
        name: 'H1N1 Candidate A',
        code: 'H1N1-NA-A',
        status: 'pending',
        vinaScore: null,
        interactions: [],
        note:
          '사전 계산 결과 검증 대기',
      },
      {
        id: 'candidate-b',
        name: 'H1N1 Candidate B',
        code: 'H1N1-NA-B',
        status: 'pending',
        vinaScore: null,
        interactions: [],
        note:
          '사전 계산 결과 검증 대기',
      },
      {
        id: 'candidate-c',
        name: 'H1N1 Candidate C',
        code: 'H1N1-NA-C',
        status: 'pending',
        vinaScore: null,
        interactions: [],
        note:
          '사전 계산 결과 검증 대기',
      },
    ],
  },
};

export const dockingResultByProteinId = (
  proteinId: string,
) =>
  dockingResults[
    proteinId as DeepDiveProteinId
  ];
