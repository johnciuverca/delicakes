#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="/Users/ciuverca/Desktop/1T career/delicakes"
PID_DIR="/Users/ciuverca/Desktop/1T career/delicakes/scripts/.pids"
SERVER_DIR="/Users/ciuverca/Desktop/1T career/delicakes/app/server"
MAINUI_DIR="/Users/ciuverca/Desktop/1T career/delicakes/app/UI/mainUI"
EXPENSE_TRACKER_DIR="/Users/ciuverca/Desktop/1T career/delicakes/app/UI/expense-tracker"
mkdir -p "${PID_DIR}"
echo "$(tty)" > "${PID_DIR}/watch.tty"
echo "$$" > "${PID_DIR}/watch.pid"

# Ensure deps
cd "${MAINUI_DIR}"
if [[ 1 -eq 0 ]] && [[ ! -d "node_modules" ]]; then echo "[mainUI] running npm install..."; npm install; fi

cd "${EXPENSE_TRACKER_DIR}"
if [[ 1 -eq 0 ]] && [[ ! -d "node_modules" ]]; then echo "[expense-tracker] running npm install..."; npm install; fi

cd "${SERVER_DIR}"
echo "[watch] starting mainUI + expense-tracker watchers..."
trap 'kill 0' INT TERM
export ENVIRONMENT="DEV"
npm run mainui:watch &
npm run expense-tracker:watch &
wait
