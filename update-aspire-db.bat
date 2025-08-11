@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM ===== CONFIG =====
set "PORT=52297"
set "DB=bethanydb"
set "USER=postgres"
set "PASS=7f6v3cAhSKK5N6MXuA)7}d"

REM Paths relative to this .bat file (solution root)
cd /d "%~dp0"
set "API_PROJ=.\HHBAspire\HHBAspire.ApiService\HHBAspire.ApiService.csproj"
set "STARTUP_PROJ=.\HHBAspire\HHBAspire.ApiService\HHBAspire.ApiService.csproj"
set "APPHOST_PROJ=.\HHBAspire\HHBAspire.AppHost\HHBAspire.AppHost.csproj"

set "TIMEOUT_SEC=90"

REM Parse args into MIGLIST (split on comma or space)
set "RAW=%*"
set "RAW=%RAW:,= %"
set "MIGLIST=%RAW%"

echo [1/7] Starting .NET Aspire AppHost (logs will appear below)...
for /f "usebackq delims=" %%P in (`
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$p = Start-Process dotnet -ArgumentList 'run --project ""%APPHOST_PROJ%""' -NoNewWindow -PassThru; $p.Id"
`) do set "APPHOST_PID=%%P"
if not defined APPHOST_PID (
  echo Failed to start AppHost.
  set "ERR=1"
  goto cleanup
)

echo [2/7] Waiting for PostgreSQL on localhost:%PORT% (timeout %TIMEOUT_SEC%s)...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$port=%PORT%; $pid=%APPHOST_PID%; $deadline=(Get-Date).AddSeconds(%TIMEOUT_SEC%); while((Get-Date) -lt $deadline){ try { $c=New-Object Net.Sockets.TcpClient('localhost',$port); $c.Close(); exit 0 } catch { Start-Sleep -Milliseconds 500 }; if (-not (Get-Process -Id $pid -ErrorAction SilentlyContinue)) { exit 2 } } exit 1"
set "WAIT_RC=%ERRORLEVEL%"

if "%WAIT_RC%"=="2" (
  echo AppHost exited early. See the console output above for details.
  set "ERR=1"
  goto cleanup
) else if not "%WAIT_RC%"=="0" (
  echo Timed out waiting for port %PORT%. Make sure AppHost sets that port for Postgres.
  set "ERR=1"
  goto cleanup
)

if not "%MIGLIST%"=="" (
  echo [3/7] Creating migrations: %MIGLIST%
  for %%M in (%MIGLIST%) do (
    echo        - Add-Migration %%M
    dotnet ef migrations add "%%M" --project %API_PROJ% --startup-project %STARTUP_PROJ%
    if errorlevel 1 (
      echo Add-Migration %%M failed. Aborting.
      set "ERR=1"
      goto cleanup
    )
  )
) else (
  echo [3/7] No migration names provided. Skipping Add-Migration.
)

echo [4/7] Building ApiService...
dotnet build %API_PROJ%
if errorlevel 1 (
  echo Build failed. Aborting.
  set "ERR=1"
  goto cleanup
)

echo [5/7] Applying EF Core migrations (database update)...
dotnet ef database update --project %API_PROJ% --startup-project %STARTUP_PROJ% --connection "Host=localhost;Port=%PORT%;Database=%DB%;Username=%USER%;Password=%PASS%"
set "ERR=%ERRORLEVEL%"

:cleanup
echo [6/7] Stopping .NET Aspire AppHost (PID %APPHOST_PID%)...
if defined APPHOST_PID powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Get-Process -Id %APPHOST_PID% -ErrorAction SilentlyContinue) { Stop-Process -Id %APPHOST_PID% -Force }" >nul 2>&1

echo [7/7] Done.
echo.
pause

endlocal & exit /b %ERR%
