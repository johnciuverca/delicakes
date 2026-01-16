#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="/Users/ciuverca/Desktop/1T career/delicakes/expense-tracker"
PID_DIR="/Users/ciuverca/Desktop/1T career/delicakes/expense-tracker/scripts/.pids"
cd "${ROOT_DIR}"
mkdir -p "${PID_DIR}"
echo "$(tty)" > "${PID_DIR}/data-api.tty"
echo "$$" > "${PID_DIR}/data-api.pid"
echo "[data-api] starting..."
exec npm run data-api
