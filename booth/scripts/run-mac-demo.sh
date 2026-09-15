#!/usr/bin/env bash
set -euo pipefail

BOOTH_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MOCK_PID=""
APP_PID=""

cleanup() {
  if [[ -n "$MOCK_PID" ]]; then
    kill "$MOCK_PID" 2>/dev/null || true
  fi
  if [[ -n "$APP_PID" ]]; then
    kill "$APP_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

cd "$BOOTH_DIR"

if [[ ! -d node_modules ]]; then
  npm ci
fi

python3 mock-device/server.py &
MOCK_PID=$!

npm run dev &
APP_PID=$!

sleep 2
open "http://localhost:5173/?cellscope=device" >/dev/null 2>&1 &
wait "$APP_PID"
