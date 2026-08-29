import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

type ExperimentChartItem = {
  id: string;
  domain: string;
  success_rate: number;
};

export function ResearchCharts({ data }: { data: ExperimentChartItem[] }) {
  return (
    <section>
      <h2>Experiment Success Rate</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="success_rate" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}