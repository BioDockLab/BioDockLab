import type { BioExperiment, AnalysisResult } from "./bio_ai_types";

type Props = {
  experiments: BioExperiment[];
  analysis: AnalysisResult[];
};

export function BioDashboard({ experiments, analysis }: Props) {
  const analysisMap = new Map(analysis.map((item) => [item.id, item]));

  return (
    <section>
      <h1>BioDockLab Live Dashboard</h1>
      {experiments.map((exp) => {
        const result = analysisMap.get(exp.id);

        return (
          <article key={exp.id}>
            <h2>{exp.domain}</h2>
            <p>{exp.sample}</p>
            <p>{exp.condition}</p>
            <strong>{exp.success_rate}%</strong>
            <p>{result?.priority ?? "Needs Improvement"}</p>
          </article>
        );
      })}
    </section>
  );
}