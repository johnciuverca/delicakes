#!/usr/bin/env bash
set -euo pipefail

# Stops the processes started by scripts/start-servers.sh using PID files.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_DIR="${SCRIPT_DIR}/.pids"

DATA_PID_FILE="${PID_DIR}/data-api.pid"
APP_PID_FILE="${PID_DIR}/app-server.pid"
WATCH_PID_FILE="${PID_DIR}/ui-watch.pid"

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

stop_by_pid_file() {
  local label="$1"
  local pid_file="$2"

  if [[ ! -f "$pid_file" ]]; then
    echo "- ${label}: no pid file found."
    return 0
  fi

  local pid
  pid="$(read_pid "$pid_file")"
  if [[ -z "${pid:-}" ]]; then
    echo "- ${label}: pid file was empty."
    rm -f "$pid_file"
    return 0
  fi

  if ! is_pid_alive "$pid"; then
    echo "- ${label}: process ${pid} was not running."
    rm -f "$pid_file"
    return 0
  fi

  local pgid=""
  pgid="$(ps -o pgid= -p "$pid" 2>/dev/null | tr -d ' ' || true)"

  if [[ -n "${pgid:-}" ]]; then
    kill -TERM -- "-${pgid}" 2>/dev/null || true
  fi
  kill -TERM "$pid" 2>/dev/null || true

  sleep 1

  if is_pid_alive "$pid"; then
    if [[ -n "${pgid:-}" ]]; then
      kill -KILL -- "-${pgid}" 2>/dev/null || true
    fi
    kill -9 "$pid" 2>/dev/null || true
  fi

  echo "- ${label}: stopped process ${pid}."
  rm -f "$pid_file"
}

echo "Stopping Delicakes terminals..."
stop_by_pid_file "ui watch" "$WATCH_PID_FILE"
stop_by_pid_file "data api" "$DATA_PID_FILE"
stop_by_pid_file "app server" "$APP_PID_FILE"

echo "Done."
