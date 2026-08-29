export type SupabaseExperimentRow = {
  id: string;
  domain: string;
  sample: string;
  condition: string;
  temperature: number | null;
  duration_hours: number | null;
  success_rate: number;
  risk_level: "Low" | "Medium" | "High";
  note: string;
};

// Future implementation:
// import { createClient } from "@supabase/supabase-js";
//
// export const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_ANON_KEY!
// );

export const supabaseTablePlan = {
  experiments: "stores bio experiment records",
  analysis_results: "stores AI priority and recommendation results",
  reports: "stores generated research report metadata"
};