export type BioDomain =
  | "Organoid"
  | "Surgery AI"
  | "Quantum Biocomputing"
  | "Digital Twin"
  | "CFPS";

export type BioExperiment = {
  id: string;
  domain: BioDomain;
  sample: string;
  condition: string;
  success_rate: number;
  risk_level: "Low" | "Medium" | "High";
  note: string;
};

export type AnalysisResult = {
  id: string;
  priority: "High Priority" | "Review" | "Needs Improvement";
  recommendation: string;
};