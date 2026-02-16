#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="/Users/ciuverca/Desktop/1T career/delicakes"
PID_DIR="/Users/ciuverca/Desktop/1T career/delicakes/scripts/.pids"
SERVER_DIR="/Users/ciuverca/Desktop/1T career/delicakes/app/server"
API_DIR="/Users/ciuverca/Desktop/1T career/delicakes/api"
mkdir -p "${PID_DIR}"
echo "$(tty)" > "${PID_DIR}/data-api.tty"
echo "$$" > "${PID_DIR}/data-api.pid"

# Ensure api deps
cd "${API_DIR}"
if [[ 0 -eq 0 ]] && [[ ! -d "node_modules" ]]; then echo "[api] running npm install..."; npm install; fi

# Start api via the main entrypoint (app/server)
cd "${SERVER_DIR}"
echo "[api] starting dev server on :3100..."
export ENVIRONMENT="PROD"
exec npm run api:dev
