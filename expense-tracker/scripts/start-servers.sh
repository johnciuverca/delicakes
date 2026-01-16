#!/usr/bin/env bash
set -euo pipefail

# Starts the Expense Tracker dev stack as documented in expense-tracker/README.md,
# but in separate macOS Terminal windows:
#  - Window 1: npm install (optional) -> npm run build -> npm run app-server
#  - Window 2: npm run data-api
#  - Window 3 (optional): npm run watch  (pass --watch)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
PID_DIR="${SCRIPT_DIR}/.pids"

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
for arg in "$@"; do
  case "$arg" in
    --watch)
      WITH_WATCH=1
      ;;
    --no-install)
      NO_INSTALL=1
      ;;
    *)
      echo "Unknown arg: $arg" >&2
      echo "Usage: $(basename "$0") [--watch] [--no-install]" >&2
      exit 2
      ;;
  esac
done

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

# Window 1: npm install (optional) -> build -> app-server
APP_LAUNCHER="${LAUNCH_DIR}/01-app-build-app-server.command"
write_launcher "$APP_LAUNCHER" "ROOT_DIR=\"${ROOT_DIR}\"\nPID_DIR=\"${PID_DIR}\"\ncd \"\${ROOT_DIR}\"\nmkdir -p \"\${PID_DIR}\"\necho \"\$(tty)\" > \"\${PID_DIR}/app-server.tty\"\necho \"\$\$\" > \"\${PID_DIR}/app-server.pid\"\nif [[ ${NO_INSTALL} -eq 0 ]] && [[ ! -d \"node_modules\" ]]; then echo \"[app] running npm install...\"; npm install; fi\necho \"[app] running npm run build...\"; npm run build\necho \"[app] starting app-server...\"\nexec npm run app-server\n"

# Window 2: data-api
DATA_LAUNCHER="${LAUNCH_DIR}/02-data-api.command"
write_launcher "$DATA_LAUNCHER" "ROOT_DIR=\"${ROOT_DIR}\"\nPID_DIR=\"${PID_DIR}\"\ncd \"\${ROOT_DIR}\"\nmkdir -p \"\${PID_DIR}\"\necho \"\$(tty)\" > \"\${PID_DIR}/data-api.tty\"\necho \"\$\$\" > \"\${PID_DIR}/data-api.pid\"\necho \"[data-api] starting...\"\nexec npm run data-api\n"

# Window 3 (optional): watch
WATCH_LAUNCHER="${LAUNCH_DIR}/03-watch.command"
if [[ "$WITH_WATCH" -eq 1 ]]; then
  write_launcher "$WATCH_LAUNCHER" "ROOT_DIR=\"${ROOT_DIR}\"\nPID_DIR=\"${PID_DIR}\"\ncd \"\${ROOT_DIR}\"\nmkdir -p \"\${PID_DIR}\"\necho \"\$(tty)\" > \"\${PID_DIR}/watch.tty\"\necho \"\$\$\" > \"\${PID_DIR}/watch.pid\"\necho \"[watch] starting...\"\nexec npm run watch\n"
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
echo "Open http://localhost:3000"
echo "To stop everything: ./scripts/stop-servers.sh"
