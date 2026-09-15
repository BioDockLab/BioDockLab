export type DeepDiveProteinId =
  | 'sars2-mpro'
  | 'mers-mpro'
  | 'h1n1-neuraminidase';

export type LigandSelection =
  | {
      type: 'chain';
      chain: string;
    }
  | {
      type: 'residue';
      residueName: string;
    };

export type DockingTarget = {
  proteinId: DeepDiveProteinId;
  disease: string;
  virus: string;
  proteinName: string;

  pdbId:
    | '6LU7'
    | '4YLU'
    | '3TI6';

  structurePath: string;

  referenceLigand: {
    name: string;
    selection: LigandSelection;
  };

  sourceUrl: string;

  docking: {
    status:
      | 'pending'
      | 'verified';

    vinaVersion?: string;
    computedAt?: string;
  };
};

export const dockingTargets: Record<
  DeepDiveProteinId,
  DockingTarget
> = {
  'sars2-mpro': {
    proteinId: 'sars2-mpro',
    disease: 'COVID-19',
    virus: 'SARS-CoV-2',
    proteinName: 'Main protease (Mpro)',
    pdbId: '6LU7',
    structurePath:
      '/structures/6LU7.pdb',

    referenceLigand: {
      name: 'N3',
      selection: {
        type: 'chain',
        chain: 'C',
      },
    },

    sourceUrl:
      'https://www.rcsb.org/structure/6LU7',

    docking: {
      status: 'pending',
    },
  },

  'mers-mpro': {
    proteinId: 'mers-mpro',
    disease: 'MERS',
    virus: 'MERS-CoV',
    proteinName: 'Main protease (Mpro)',
    pdbId: '4YLU',
    structurePath:
      '/structures/4YLU.pdb',

    referenceLigand: {
      name: 'R30 · non-covalent inhibitor',
      selection: {
        type: 'residue',
        residueName: 'R30',
      },
    },

    sourceUrl:
      'https://www.rcsb.org/structure/4YLU',

    docking: {
      status: 'pending',
    },
  },

  'h1n1-neuraminidase': {
    proteinId:
      'h1n1-neuraminidase',

    disease:
      '2009 H1N1 influenza',

    virus:
      'Influenza A(H1N1)',

    proteinName:
      'Neuraminidase',

    pdbId: '3TI6',

    structurePath:
      '/structures/3TI6.pdb',

    referenceLigand: {
      name: 'Oseltamivir',
      selection: {
        type: 'residue',
        residueName: 'G39',
      },
    },

    sourceUrl:
      'https://www.rcsb.org/structure/3TI6',

    docking: {
      status: 'pending',
    },
  },
};

export const dockingTargetByProteinId = (
  proteinId: string,
) =>
  dockingTargets[
    proteinId as DeepDiveProteinId
  ];
