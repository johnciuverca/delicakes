#!/usr/bin/env bash
set -euo pipefail

# Starts the Delicakes dev stack in separate macOS Terminal windows.
#  - Window 1: data api (:3100)
#  - Window 2: app server (:3000) after UI builds
#  - Window 3 (optional): UI watch mode (pass --watch)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
PID_DIR="${SCRIPT_DIR}/.pids"
LAUNCH_DIR="${PID_DIR}/launchers"

API_DIR="${ROOT_DIR}/api"
APP_SERVER_DIR="${ROOT_DIR}/app/server"
MAINUI_DIR="${ROOT_DIR}/app/UI/mainUI"
EXPENSE_TRACKER_DIR="${ROOT_DIR}/app/UI/expense-tracker"

DATA_PID_FILE="${PID_DIR}/data-api.pid"
APP_PID_FILE="${PID_DIR}/app-server.pid"
WATCH_PID_FILE="${PID_DIR}/ui-watch.pid"

WITH_WATCH=0
if [[ "${1:-}" == "--watch" ]]; then
  WITH_WATCH=1
  shift
fi
if [[ $# -gt 0 ]]; then
  echo "Usage: $(basename "$0") [--watch]" >&2
  exit 2
fi

mkdir -p "$PID_DIR"
mkdir -p "$LAUNCH_DIR"

if ! command -v open >/dev/null 2>&1; then
  echo "open not found; this script requires macOS." >&2
  exit 1
fi

is_pid_alive() {
  local pid="$1"
  kill -0 "$pid" 2>/dev/null
}

ensure_not_running_or_cleanup() {
  local pid_file="$1"
  local label="$2"

  if [[ -f "$pid_file" ]]; then
    local pid
    pid="$(cat "$pid_file" 2>/dev/null || true)"
    if [[ -n "${pid:-}" ]] && is_pid_alive "$pid"; then
      echo "${label} appears to already be running (pid=${pid})." >&2
      echo "Run ./scripts/stop-servers.sh first." >&2
      exit 1
    fi
    rm -f "$pid_file"
  fi
}

ensure_not_running_or_cleanup "$APP_PID_FILE" "app-server"
ensure_not_running_or_cleanup "$DATA_PID_FILE" "data-api"
ensure_not_running_or_cleanup "$WATCH_PID_FILE" "watch"

write_launcher() {
  local path="$1"
  shift

  cat >"$path" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
EOF
  cat >>"$path" <<EOF
$*
EOF
  chmod +x "$path"
}

echo "Opening Terminal windows and starting servers..."

DATA_LAUNCHER="${LAUNCH_DIR}/01-data-api.command"
write_launcher "$DATA_LAUNCHER" "echo \"\$\$\" > \"${DATA_PID_FILE}\"
cd \"${API_DIR}\"
exec npm run dev"

APP_LAUNCHER="${LAUNCH_DIR}/02-app-server.command"
write_launcher "$APP_LAUNCHER" "echo \"\$\$\" > \"${APP_PID_FILE}\"
cd \"${APP_SERVER_DIR}\"
npm run mainui:build
npm run expense-tracker:build
exec npm run dev"

WATCH_LAUNCHER="${LAUNCH_DIR}/03-ui-watch.command"
if [[ "$WITH_WATCH" -eq 1 ]]; then
  write_launcher "$WATCH_LAUNCHER" "echo \"\$\$\" > \"${WATCH_PID_FILE}\"
cd \"${MAINUI_DIR}\"
npm run watch &
MAINUI_WATCH_PID=\$!
cd \"${EXPENSE_TRACKER_DIR}\"
npm run watch &
EXPENSE_WATCH_PID=\$!
trap 'kill \"\${MAINUI_WATCH_PID}\" \"\${EXPENSE_WATCH_PID}\" 2>/dev/null || true' EXIT INT TERM
wait"
fi

open -a Terminal "$APP_LAUNCHER"
open -a Terminal "$DATA_LAUNCHER"

if [[ "$WITH_WATCH" -eq 1 ]]; then
  open -a Terminal "$WATCH_LAUNCHER"
else
  rm -f "$WATCH_PID_FILE"
fi

echo ""
echo "All Terminal windows launched."
echo "App: http://localhost:3000"
echo "API: http://localhost:3100"
echo "To stop everything: ./scripts/stop-servers.sh"
