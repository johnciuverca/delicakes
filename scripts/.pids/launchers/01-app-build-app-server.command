#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="/Users/ciuverca/Desktop/1T career/delicakes"
PID_DIR="/Users/ciuverca/Desktop/1T career/delicakes/scripts/.pids"
SERVER_DIR="/Users/ciuverca/Desktop/1T career/delicakes/app/server"
EXPENSE_TRACKER_DIR="/Users/ciuverca/Desktop/1T career/delicakes/app/UI/expense-tracker"
MAINUI_DIR="/Users/ciuverca/Desktop/1T career/delicakes/app/UI/mainUI"
mkdir -p "${PID_DIR}"
echo "$(tty)" > "${PID_DIR}/app-server.tty"
echo "$$" > "${PID_DIR}/app-server.pid"

# Ensure deps (server + UIs)
cd "${SERVER_DIR}"
if [[ 0 -eq 0 ]] && [[ ! -d "node_modules" ]]; then echo "[app/server] running npm install..."; npm install; fi

cd "${MAINUI_DIR}"
if [[ 0 -eq 0 ]] && [[ ! -d "node_modules" ]]; then echo "[mainUI] running npm install..."; npm install; fi

cd "${EXPENSE_TRACKER_DIR}"
if [[ 0 -eq 0 ]] && [[ ! -d "node_modules" ]]; then echo "[expense-tracker] running npm install..."; npm install; fi

# Build UIs (so app/server can serve them)
cd "${SERVER_DIR}"
echo "[mainUI] running npm run mainui:build..."
npm run mainui:build
echo "[expense-tracker] running npm run expense-tracker:build..."
npm run expense-tracker:build

# Start the main app server on :3000
echo "[app/server] starting dev server on :3000..."
export ENVIRONMENT="DEV"
exec npm run app:dev
