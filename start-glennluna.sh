#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

export NODE_ENV="${NODE_ENV:-production}"
export HOST="${HOST:-0.0.0.0}"
export PORT="${PORT:-3003}"

if [ ! -d ".next" ]; then
  echo "Missing production build. Run 'npm install' and 'npm run build' first."
  exit 1
fi

exec npm start
