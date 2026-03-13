@echo off
cd /d "%~dp0"

REM Start HTTP server in a new window (port 5500)
start "Render Cost Calculator Server" python -m http.server 5500

REM Wait for server to start
timeout /t 2 /nobreak > nul

REM Open index.html in default browser
start http://localhost:5500/index.html

echo.
echo Server running at http://localhost:5500/
echo Close the server window when done.
echo.
