const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 5173;
const ROOT = path.join(__dirname, "..");
const FRONTEND_DIR = path.join(ROOT, "frontend");
const DATA_PATH = path.join(ROOT, "data", "sample", "bio_experiments.json");

function send(res, status, contentType, body) {
  res.writeHead(status, { "Content-Type": contentType + "; charset=utf-8" });
  res.end(body);
}

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, "text/plain", "Not Found");
      return;
    }
    send(res, 200, contentType, data);
  });
}

const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];

  if (url === "/") {
    return serveFile(res, path.join(FRONTEND_DIR, "bio_ai_live_dashboard.html"), "text/html");
  }

  if (url === "/api/experiments") {
    return serveFile(res, DATA_PATH, "application/json");
  }

  if (url === "/api/analysis") {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const experiments = JSON.parse(raw);

    const analysis = experiments.map((exp) => {
      const success = exp.success_rate || 0;
      const risk = exp.risk_level || "Medium";

      let priority = "Needs Improvement";
      if (success >= 80 && risk === "Low") {
        priority = "High Priority";
      } else if (success >= 70) {
        priority = "Review";
      }

      return {
        id: exp.id,
        domain: exp.domain,
        success_rate: success,
        risk_level: risk,
        priority,
        recommendation:
          priority === "High Priority"
            ? "Proceed to next validation stage"
            : priority === "Review"
            ? "Compare similar experiment conditions"
            : "Adjust condition and repeat experiment"
      };
    });

    return send(res, 200, "application/json", JSON.stringify(analysis, null, 2));
  }

  if (url.startsWith("/frontend/")) {
    const filePath = path.join(ROOT, url);
    const ext = path.extname(filePath).toLowerCase();

    const typeMap = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json"
    };

    return serveFile(res, filePath, typeMap[ext] || "text/plain");
  }

  send(res, 404, "text/plain", "BioDockLab route not found");
});

server.listen(PORT, () => {
  console.log(`BioDockLab Node server running at http://127.0.0.1:${PORT}`);
  console.log(`API: http://127.0.0.1:${PORT}/api/experiments`);
});