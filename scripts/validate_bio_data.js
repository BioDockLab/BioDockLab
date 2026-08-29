const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "sample", "bio_experiments.json");

function loadExperiments() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

function classifyPriority(exp) {
  const success = exp.success_rate || 0;
  const risk = exp.risk_level || "Medium";

  if (success >= 80 && risk === "Low") return "High Priority";
  if (success >= 70) return "Review";
  return "Needs Improvement";
}

const experiments = loadExperiments();

console.log("BioDockLab Data Validation");
console.log("==========================");

experiments.forEach((exp) => {
  console.log({
    id: exp.id,
    domain: exp.domain,
    success_rate: exp.success_rate,
    risk_level: exp.risk_level,
    priority: classifyPriority(exp),
  });
});

console.log("==========================");
console.log(`Total experiments: ${experiments.length}`);