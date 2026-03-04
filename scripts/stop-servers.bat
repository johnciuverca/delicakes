@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"
set "PID_DIR=%SCRIPT_DIR%.pids"

echo Stopping Delicakes terminals...
call :stop_by_pid_file "%PID_DIR%\ui-watch.pid" "ui watch"
call :stop_by_pid_file "%PID_DIR%\data-api.pid" "data api"
call :stop_by_pid_file "%PID_DIR%\app-server.pid" "app server"

echo Done.
exit /b 0

:stop_by_pid_file
set "PID_FILE=%~1"
set "LABEL=%~2"

if not exist "!PID_FILE!" (
  echo - !LABEL!: no pid file found.
  exit /b 0
)

set /p TARGET_PID=<"!PID_FILE!"
if "!TARGET_PID!"=="" (
  del /q "!PID_FILE!" >nul 2>&1
  echo - !LABEL!: pid file was empty.
  exit /b 0
)

taskkill /F /T /PID !TARGET_PID! >nul 2>&1
if errorlevel 1 (
  echo - !LABEL!: process !TARGET_PID! was not running.
) else (
  echo - !LABEL!: stopped process !TARGET_PID!.
)

del /q "!PID_FILE!" >nul 2>&1
exit /b 0
