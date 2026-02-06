#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="/Users/ciuverca/desktop/1t career/delicakes"
PID_DIR="/Users/ciuverca/desktop/1t career/delicakes/scripts/.pids"
cd "${ROOT_DIR}"
mkdir -p "${PID_DIR}"
echo "$(tty)" > "${PID_DIR}/data-api.tty"
echo "$$" > "${PID_DIR}/data-api.pid"
echo "[data-api] starting..."
exec npm run data-api
