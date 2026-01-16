#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="/Users/ciuverca/Desktop/1T career/delicakes/expense-tracker"
PID_DIR="/Users/ciuverca/Desktop/1T career/delicakes/expense-tracker/scripts/.pids"
cd "${ROOT_DIR}"
mkdir -p "${PID_DIR}"
echo "$(tty)" > "${PID_DIR}/app-server.tty"
echo "$$" > "${PID_DIR}/app-server.pid"
if [[ 0 -eq 0 ]] && [[ ! -d "node_modules" ]]; then echo "[app] running npm install..."; npm install; fi
echo "[app] running npm run build..."; npm run build
echo "[app] starting app-server..."
exec npm run app-server
