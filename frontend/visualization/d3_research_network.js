// D3.js scaffold for future BioDockLab research relationship network.
// Planned graph:
// Bio Domain → Experiment → Analysis Result → Recommendation

export const researchNodes = [
  { id: "Organoid", group: "bio" },
  { id: "CFPS", group: "bio" },
  { id: "Digital Twin", group: "simulation" },
  { id: "AI Analysis", group: "ai" },
  { id: "Research Report", group: "report" }
];

export const researchLinks = [
  { source: "Organoid", target: "AI Analysis" },
  { source: "CFPS", target: "AI Analysis" },
  { source: "Digital Twin", target: "AI Analysis" },
  { source: "AI Analysis", target: "Research Report" }
];