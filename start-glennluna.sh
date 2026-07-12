#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

COMMAND="${1:-start}"

if [ "$COMMAND" = "restart" ]; then
  sudo systemctl restart glennluna.service
  sudo systemctl status glennluna.service --no-pager -l
  exit 0
fi

export NODE_ENV="${NODE_ENV:-production}"
export HOST="${HOST:-0.0.0.0}"
export PORT="${PORT:-3003}"
export ASPNETCORE_ENVIRONMENT="${ASPNETCORE_ENVIRONMENT:-Production}"
export ASPNETCORE_URLS="${ASPNETCORE_URLS:-http://127.0.0.1:5000}"

BACKEND_DLL="backend/bin/Release/net10.0/GlennLuna.Api.dll"

if [ ! -d ".next" ]; then
  echo "Missing production build. Run 'npm install' and 'npm run build' first."
  exit 1
fi

if [ ! -f "$BACKEND_DLL" ]; then
  echo "Missing backend build. Run 'dotnet build backend/GlennLuna.Api.csproj --configuration Release' first."
  exit 1
fi

dotnet "$BACKEND_DLL" &
BACKEND_PID=$!

npm start &
FRONTEND_PID=$!

cleanup() {
  trap - EXIT INT TERM
  kill "$FRONTEND_PID" "$BACKEND_PID" 2>/dev/null || true
  wait "$FRONTEND_PID" "$BACKEND_PID" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

set +e
wait -n "$FRONTEND_PID" "$BACKEND_PID"
STATUS=$?
set -e

echo "A Glenn Luna service process exited with status $STATUS; stopping the other process."
exit "$STATUS"
