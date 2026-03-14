@echo off
setlocal
set ROOT=C:\Users\saura\Documents\New project\pdfpilot
start "PDFPilot Backend" powershell -ExecutionPolicy Bypass -File "%ROOT%\backend\run_dev.ps1"
start "PDFPilot Frontend" powershell -ExecutionPolicy Bypass -File "%ROOT%\frontend\run_dev.ps1"
start "PDFPilot" "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://localhost:3000"
endlocal
