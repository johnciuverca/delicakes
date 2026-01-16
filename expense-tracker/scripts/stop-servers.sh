#!/usr/bin/env bash
set -euo pipefail

# Stops the processes and closes the Terminal windows started by scripts/start-servers.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_DIR="${SCRIPT_DIR}/.pids"

APP_PID_FILE="${PID_DIR}/app-server.pid"
DATA_PID_FILE="${PID_DIR}/data-api.pid"
WATCH_PID_FILE="${PID_DIR}/watch.pid"

APP_TTY_FILE="${PID_DIR}/app-server.tty"
DATA_TTY_FILE="${PID_DIR}/data-api.tty"
WATCH_TTY_FILE="${PID_DIR}/watch.tty"

APP_WIN_FILE="${PID_DIR}/terminal-app.id"
DATA_WIN_FILE="${PID_DIR}/terminal-data-api.id"
WATCH_WIN_FILE="${PID_DIR}/terminal-watch.id"

read_tty() {
  local tty_file="$1"
  if [[ -f "$tty_file" ]]; then
    cat "$tty_file" 2>/dev/null || true
  fi
}

close_terminal_tabs_by_tty_file() {
  local label="$1"
  local tty_file="$2"

  local tty
  tty="$(read_tty "$tty_file")"
  rm -f "$tty_file"

  [[ -z "${tty:-}" ]] && return 0
  command -v osascript >/dev/null 2>&1 || return 0

  # Close any Terminal tab whose tty matches.
  # We close tabs (not windows) because Terminal may open .command files as tabs depending on user prefs.
  osascript \
    -e 'tell application "Terminal"' \
    -e 'try' \
    -e 'repeat with w in windows' \
    -e 'repeat with t in tabs of w' \
    -e "try" \
    -e "if (tty of t as text) is \"${tty}\" then close t" \
    -e "end try" \
    -e 'end repeat' \
    -e 'end repeat' \
    -e 'end try' \
    -e 'end tell' >/dev/null 2>&1 || true

  echo "Closed Terminal tab(s) for ${label} (tty=${tty})."
}

is_pid_alive() {
  local pid="$1"
  kill -0 "$pid" 2>/dev/null
}

read_pid() {
  local pid_file="$1"
  if [[ -f "$pid_file" ]]; then
    cat "$pid_file" 2>/dev/null || true
  fi
}

stop_pid_if_running() {
  local label="$1"
  local pid_file="$2"

  local pid
  pid="$(read_pid "$pid_file")"
  if [[ -z "${pid:-}" ]]; then
    return 0
  fi

  if ! is_pid_alive "$pid"; then
    echo "${label} pid=${pid} already stopped."
    rm -f "$pid_file"
    return 0
  fi

  echo "Sending SIGTERM to ${label} pid=${pid}..."
  kill "$pid" 2>/dev/null || true
}

force_kill_pid_if_running() {
  local label="$1"
  local pid_file="$2"

  local pid
  pid="$(read_pid "$pid_file")"
  if [[ -z "${pid:-}" ]]; then
    return 0
  fi

  if is_pid_alive "$pid"; then
    echo "${label} pid=${pid} still running; sending SIGKILL..."
    kill -9 "$pid" 2>/dev/null || true
  fi

  rm -f "$pid_file"
}

close_terminal_window_by_id_file() {
  local label="$1"
  local id_file="$2"

  if [[ ! -f "$id_file" ]]; then
    return 0
  fi

  local win_id
  win_id="$(cat "$id_file" 2>/dev/null || true)"
  rm -f "$id_file"

  if [[ -z "${win_id:-}" ]]; then
    return 0
  fi

  if command -v osascript >/dev/null 2>&1; then
    osascript -e 'tell application "Terminal"' \
      -e 'try' \
      -e "set w to first window whose id is ${win_id}" \
      -e 'close w' \
      -e 'end try' \
      -e 'end tell' >/dev/null 2>&1 || true
    echo "Closed Terminal window for ${label} (window id=${win_id})."
  fi
}

echo "Stopping servers..."

# Stop in reverse order (watch -> data-api -> app-server)
stop_pid_if_running "watch" "$WATCH_PID_FILE"
stop_pid_if_running "data-api" "$DATA_PID_FILE"
stop_pid_if_running "app-server" "$APP_PID_FILE"

sleep 1

force_kill_pid_if_running "watch" "$WATCH_PID_FILE"
force_kill_pid_if_running "data-api" "$DATA_PID_FILE"
force_kill_pid_if_running "app-server" "$APP_PID_FILE"

# Close Terminal tabs/windows (requested)
close_terminal_tabs_by_tty_file "watch" "$WATCH_TTY_FILE"
close_terminal_tabs_by_tty_file "data-api" "$DATA_TTY_FILE"
close_terminal_tabs_by_tty_file "app/build/app-server" "$APP_TTY_FILE"

# Clean up any old window id files from previous implementation.
rm -f "$WATCH_WIN_FILE" "$DATA_WIN_FILE" "$APP_WIN_FILE"

echo "Done."
