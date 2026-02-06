#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="/Users/ciuverca/desktop/1t career/delicakes"
PID_DIR="/Users/ciuverca/desktop/1t career/delicakes/scripts/.pids"
cd "${ROOT_DIR}"
mkdir -p "${PID_DIR}"
echo "$(tty)" > "${PID_DIR}/watch.tty"
echo "$$" > "${PID_DIR}/watch.pid"
echo "[watch] starting..."
exec npm run watch
