#!/usr/bin/env bash
set -euo pipefail

# Starts the current Delicakes dev stack in separate macOS Terminal windows.
# The main entrypoint is app/server (it proxies to api/ and UI/ via npm --prefix).
#  - Window 1: (optional) install + build Expense Tracker UI -> start App Server (:3000)
#  - Window 2: start API server (:3100)
#  - Window 3 (optional): watch mainUI + Expense Tracker rebuilds (pass --watch)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
PID_DIR="${SCRIPT_DIR}/.pids"

SERVER_DIR="${ROOT_DIR}/app/server"
API_DIR="${ROOT_DIR}/api"
EXPENSE_TRACKER_DIR="${ROOT_DIR}/app/UI/expense-tracker"
MAINUI_DIR="${ROOT_DIR}/app/UI/mainUI"

LAUNCH_DIR="${PID_DIR}/launchers"

APP_PID_FILE="${PID_DIR}/app-server.pid"
DATA_PID_FILE="${PID_DIR}/data-api.pid"
WATCH_PID_FILE="${PID_DIR}/watch.pid"

APP_TTY_FILE="${PID_DIR}/app-server.tty"
DATA_TTY_FILE="${PID_DIR}/data-api.tty"
WATCH_TTY_FILE="${PID_DIR}/watch.tty"

APP_WIN_FILE="${PID_DIR}/terminal-app.id"
DATA_WIN_FILE="${PID_DIR}/terminal-data-api.id"
WATCH_WIN_FILE="${PID_DIR}/terminal-watch.id"

WITH_WATCH=0
NO_INSTALL=0
START_ENVIRONMENT="${ENVIRONMENT:-DEV}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --watch)
      WITH_WATCH=1
      shift
      ;;
    --no-install)
      NO_INSTALL=1
      shift
      ;;
    --env|--environment)
      if [[ $# -lt 2 ]]; then
        echo "Missing value for $1" >&2
        echo "Usage: $(basename "$0") [--watch] [--no-install] [--env DEV|PROD]" >&2
        exit 2
      fi
      START_ENVIRONMENT="$2"
      shift 2
      ;;
    --env=*|--environment=*)
      START_ENVIRONMENT="${1#*=}"
      shift
      ;;
    *)
      echo "Unknown arg: $1" >&2
      echo "Usage: $(basename "$0") [--watch] [--no-install] [--env DEV|PROD]" >&2
      exit 2
      ;;
  esac
done

START_ENVIRONMENT="$(echo "$START_ENVIRONMENT" | tr '[:lower:]' '[:upper:]')"
if [[ "$START_ENVIRONMENT" != "DEV" && "$START_ENVIRONMENT" != "PROD" ]]; then
  echo "Invalid environment: $START_ENVIRONMENT" >&2
  echo "Allowed values: DEV, PROD" >&2
  exit 2
fi

mkdir -p "$PID_DIR"

mkdir -p "$LAUNCH_DIR"

# We intentionally avoid AppleScript "make new window" (it fails with -10000 on some macOS versions).
# Using .command launchers + open(1) reliably starts separate Terminal sessions.
if ! command -v open >/dev/null 2>&1; then
  echo "open not found; this script requires macOS." >&2
  exit 1
fi

is_pid_alive() {
  local pid="$1"
  kill -0 "$pid" 2>/dev/null
}

is_port_listening() {
  local port="$1"
  command -v lsof >/dev/null 2>&1 || return 1
  lsof -nP -iTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1
}

assert_port_free() {
  local port="$1"
  local label="$2"

  if is_port_listening "$port"; then
    echo "Port ${port} (${label}) is already in use." >&2
    echo "Run ./scripts/stop-servers.sh and try again." >&2
    exit 1
  fi
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

# Preflight port checks (avoid failing inside spawned Terminal tabs)
assert_port_free 3000 "app/server"
assert_port_free 3100 "api"

rm -f \
  "$APP_WIN_FILE" "$DATA_WIN_FILE" "$WATCH_WIN_FILE" \
  "$APP_TTY_FILE" "$DATA_TTY_FILE" "$WATCH_TTY_FILE"

write_launcher() {
  local path="$1"
  local body="$2"

  cat >"$path" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
EOF
  # Use %b so the body can contain escaped newlines (\n) and other sequences.
  printf '%b' "$body" >>"$path"
  chmod +x "$path"
}

wait_for_file() {
  local path="$1"
  local seconds="$2"

  for _ in $(seq 1 "$seconds"); do
    [[ -f "$path" ]] && return 0
    sleep 1
  done
  return 1
}

echo "Opening Terminal windows and starting servers..."
echo "Environment: ${START_ENVIRONMENT}"

# Window 1: (optional) install + build Expense Tracker UI -> start app server
APP_LAUNCHER="${LAUNCH_DIR}/01-app-build-app-server.command"
write_launcher "$APP_LAUNCHER" "ROOT_DIR=\"${ROOT_DIR}\"\nPID_DIR=\"${PID_DIR}\"\nSERVER_DIR=\"${SERVER_DIR}\"\nEXPENSE_TRACKER_DIR=\"${EXPENSE_TRACKER_DIR}\"\nMAINUI_DIR=\"${MAINUI_DIR}\"\nmkdir -p \"\${PID_DIR}\"\necho \"\$(tty)\" > \"\${PID_DIR}/app-server.tty\"\necho \"\$\$\" > \"\${PID_DIR}/app-server.pid\"\n\n# Ensure deps (server + UIs)\ncd \"\${SERVER_DIR}\"\nif [[ ${NO_INSTALL} -eq 0 ]] && [[ ! -d \"node_modules\" ]]; then echo \"[app/server] running npm install...\"; npm install; fi\n\ncd \"\${MAINUI_DIR}\"\nif [[ ${NO_INSTALL} -eq 0 ]] && [[ ! -d \"node_modules\" ]]; then echo \"[mainUI] running npm install...\"; npm install; fi\n\ncd \"\${EXPENSE_TRACKER_DIR}\"\nif [[ ${NO_INSTALL} -eq 0 ]] && [[ ! -d \"node_modules\" ]]; then echo \"[expense-tracker] running npm install...\"; npm install; fi\n\n# Build UIs (so app/server can serve them)\ncd \"\${SERVER_DIR}\"\necho \"[mainUI] running npm run mainui:build...\"\nnpm run mainui:build\necho \"[expense-tracker] running npm run expense-tracker:build...\"\nnpm run expense-tracker:build\n\n# Start the main app server on :3000\necho \"[app/server] starting dev server on :3000...\"\nexport ENVIRONMENT=\"${START_ENVIRONMENT}\"\nexec npm run app:dev\n"

# Window 2: API server on :3100
DATA_LAUNCHER="${LAUNCH_DIR}/02-data-api.command"
write_launcher "$DATA_LAUNCHER" "ROOT_DIR=\"${ROOT_DIR}\"\nPID_DIR=\"${PID_DIR}\"\nSERVER_DIR=\"${SERVER_DIR}\"\nAPI_DIR=\"${API_DIR}\"\nmkdir -p \"\${PID_DIR}\"\necho \"\$(tty)\" > \"\${PID_DIR}/data-api.tty\"\necho \"\$\$\" > \"\${PID_DIR}/data-api.pid\"\n\n# Ensure api deps\ncd \"\${API_DIR}\"\nif [[ ${NO_INSTALL} -eq 0 ]] && [[ ! -d \"node_modules\" ]]; then echo \"[api] running npm install...\"; npm install; fi\n\n# Start api via the main entrypoint (app/server)\ncd \"\${SERVER_DIR}\"\necho \"[api] starting dev server on :3100...\"\nexport ENVIRONMENT=\"${START_ENVIRONMENT}\"\nexec npm run api:dev\n"

# Window 3 (optional): watch mainUI + Expense Tracker rebuilds
WATCH_LAUNCHER="${LAUNCH_DIR}/03-watch.command"
if [[ "$WITH_WATCH" -eq 1 ]]; then
  write_launcher "$WATCH_LAUNCHER" "ROOT_DIR=\"${ROOT_DIR}\"\nPID_DIR=\"${PID_DIR}\"\nSERVER_DIR=\"${SERVER_DIR}\"\nMAINUI_DIR=\"${MAINUI_DIR}\"\nEXPENSE_TRACKER_DIR=\"${EXPENSE_TRACKER_DIR}\"\nmkdir -p \"\${PID_DIR}\"\necho \"\$(tty)\" > \"\${PID_DIR}/watch.tty\"\necho \"\$\$\" > \"\${PID_DIR}/watch.pid\"\n\n# Ensure deps\ncd \"\${MAINUI_DIR}\"\nif [[ ${NO_INSTALL} -eq 0 ]] && [[ ! -d \"node_modules\" ]]; then echo \"[mainUI] running npm install...\"; npm install; fi\n\ncd \"\${EXPENSE_TRACKER_DIR}\"\nif [[ ${NO_INSTALL} -eq 0 ]] && [[ ! -d \"node_modules\" ]]; then echo \"[expense-tracker] running npm install...\"; npm install; fi\n\ncd \"\${SERVER_DIR}\"\necho \"[watch] starting mainUI + expense-tracker watchers...\"\ntrap 'kill 0' INT TERM\nexport ENVIRONMENT=\"${START_ENVIRONMENT}\"\nnpm run mainui:watch &\nnpm run expense-tracker:watch &\nwait\n"
fi

open -a Terminal "$APP_LAUNCHER"
open -a Terminal "$DATA_LAUNCHER"

if [[ "$WITH_WATCH" -eq 1 ]]; then
  open -a Terminal "$WATCH_LAUNCHER"
fi

# Best-effort: wait briefly for PID/TTY files to appear.
wait_for_file "$APP_PID_FILE" 10 || true
wait_for_file "$DATA_PID_FILE" 10 || true
if [[ "$WITH_WATCH" -eq 1 ]]; then
  wait_for_file "$WATCH_PID_FILE" 10 || true
fi

echo ""
echo "All Terminal windows launched."
echo "App: http://localhost:3000"
echo "API: http://localhost:3100"
echo "To stop everything: ./scripts/stop-servers.sh"
