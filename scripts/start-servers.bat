@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"
for %%I in ("%SCRIPT_DIR%..") do set "ROOT_DIR=%%~fI"

set "PID_DIR=%SCRIPT_DIR%.pids"
set "PID_DATA=%PID_DIR%\data-api.pid"
set "PID_APP=%PID_DIR%\app-server.pid"
set "PID_WATCH=%PID_DIR%\ui-watch.pid"

set "API_DIR=%ROOT_DIR%\api"
set "APP_SERVER_DIR=%ROOT_DIR%\app\server"
set "MAINUI_DIR=%ROOT_DIR%\app\UI\mainUI"
set "EXPENSE_DIR=%ROOT_DIR%\app\UI\expense-tracker"

set "WITH_WATCH=0"
if /I "%~1"=="--watch" set "WITH_WATCH=1"
if not "%~1"=="" if /I not "%~1"=="--watch" goto usage

if not exist "%PID_DIR%" mkdir "%PID_DIR%"

call :ensure_pid_not_running "%PID_DATA%" "data api"
if errorlevel 1 exit /b 1
call :ensure_pid_not_running "%PID_APP%" "app server"
if errorlevel 1 exit /b 1
if "%WITH_WATCH%"=="1" (
  call :ensure_pid_not_running "%PID_WATCH%" "ui watch"
  if errorlevel 1 exit /b 1
)

echo Starting data api terminal...
for /f %%P in ('powershell -NoProfile -Command "$p = Start-Process -FilePath cmd.exe -ArgumentList '/k','title Delicakes Data API && cd /d \"%API_DIR%\" && set PORT=3100 && npm run dev' -PassThru; $p.Id"') do set "DATA_PID=%%P"
if not defined DATA_PID (
  echo Failed to start data api terminal.
  exit /b 1
)
> "%PID_DATA%" echo !DATA_PID!

echo Starting app server terminal...
for /f %%P in ('powershell -NoProfile -Command "$p = Start-Process -FilePath cmd.exe -ArgumentList '/k','title Delicakes App Server && cd /d \"%APP_SERVER_DIR%\" && npm run win:mainui:build && npm run win:expense-tracker:build && set PORT=3000 && npm run dev' -PassThru; $p.Id"') do set "APP_PID=%%P"
if not defined APP_PID (
  echo Failed to start app server terminal.
  exit /b 1
)
> "%PID_APP%" echo !APP_PID!

if "%WITH_WATCH%"=="1" (
  echo Starting UI watch terminal...
  for /f %%P in ('powershell -NoProfile -Command "$p = Start-Process -FilePath cmd.exe -ArgumentList '/k','title Delicakes UI Watch && cd /d \"%MAINUI_DIR%\" && start \"\" /b cmd /c \"npm run win:watch\" && cd /d \"%EXPENSE_DIR%\" && npm run win:watch' -PassThru; $p.Id"') do set "WATCH_PID=%%P"
  if not defined WATCH_PID (
    echo Failed to start ui watch terminal.
    exit /b 1
  )
  > "%PID_WATCH%" echo !WATCH_PID!
) else (
  if exist "%PID_WATCH%" del /q "%PID_WATCH%" >nul 2>&1
)

echo.
echo Started terminals:
echo - data api   (PID !DATA_PID!)
echo - app server (PID !APP_PID!)
if "%WITH_WATCH%"=="1" echo - ui watch   (PID !WATCH_PID!)
echo.
echo To stop all: scripts\stop-servers.bat
exit /b 0

:usage
echo Usage: %~nx0 [--watch]
exit /b 2

:ensure_pid_not_running
set "PID_FILE=%~1"
set "LABEL=%~2"

if not exist "!PID_FILE!" exit /b 0

set /p EXISTING_PID=<"!PID_FILE!"
if "!EXISTING_PID!"=="" (
  del /q "!PID_FILE!" >nul 2>&1
  exit /b 0
)

tasklist /FI "PID eq !EXISTING_PID!" | findstr /R /C:"[ ]!EXISTING_PID![ ]" >nul
if errorlevel 1 (
  del /q "!PID_FILE!" >nul 2>&1
  exit /b 0
)

echo !LABEL! appears to already be running (PID !EXISTING_PID!).
echo Run scripts\stop-servers.bat first.
exit /b 1
