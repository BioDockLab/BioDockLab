CREATE TABLE experiments (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  sample TEXT NOT NULL,
  condition TEXT NOT NULL,
  temperature REAL,
  duration_hours REAL,
  success_rate INTEGER,
  risk_level TEXT,
  note TEXT
);

CREATE TABLE analysis_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  experiment_id TEXT NOT NULL,
  priority TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (experiment_id) REFERENCES experiments(id)
);