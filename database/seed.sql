INSERT INTO experiments (
  id,
  domain,
  sample,
  condition,
  temperature,
  duration_hours,
  success_rate,
  risk_level,
  note
) VALUES
(
  'ORG-001',
  'Organoid',
  'intestinal organoid',
  'growth factor A + drug candidate X',
  37,
  72,
  78,
  'Medium',
  'Potential drug response model'
),
(
  'CFPS-001',
  'CFPS',
  'cell-free protein synthesis',
  'enzyme mix B + amino acid pool',
  30,
  6,
  84,
  'Low',
  'Protein production simulation sample'
);