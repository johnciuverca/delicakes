#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="/Users/ciuverca/Desktop/1T career/delicakes/expense-tracker"
PID_DIR="/Users/ciuverca/Desktop/1T career/delicakes/expense-tracker/scripts/.pids"
cd "${ROOT_DIR}"
mkdir -p "${PID_DIR}"
echo "$(tty)" > "${PID_DIR}/watch.tty"
echo "$$" > "${PID_DIR}/watch.pid"
echo "[watch] starting..."
exec npm run watch
