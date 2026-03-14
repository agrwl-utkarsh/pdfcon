$ErrorActionPreference = "Stop"

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendScript = Join-Path $rootDir "backend\run_dev.ps1"
$frontendScript = Join-Path $rootDir "frontend\run_dev.ps1"

Start-Process -FilePath "powershell" -ArgumentList "-ExecutionPolicy","Bypass","-File",$backendScript -WorkingDirectory (Join-Path $rootDir "backend")
Start-Process -FilePath "powershell" -ArgumentList "-ExecutionPolicy","Bypass","-File",$frontendScript -WorkingDirectory (Join-Path $rootDir "frontend")

Write-Host "PDFPilot dev servers starting..."
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:3000"

$backendReady = $false
for ($i = 0; $i -lt 20; $i++) {
  try {
    Invoke-WebRequest -Uri "http://localhost:8000/" -UseBasicParsing | Out-Null
    $backendReady = $true
    break
  } catch {
    Start-Sleep -Seconds 1
  }
}

if (-not $backendReady) {
  Write-Host "Backend not reachable yet. You can still open the frontend and retry."
}

$opened = $false
$chromePaths = @(
  "C:\Program Files\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)

foreach ($chrome in $chromePaths) {
  if (Test-Path $chrome) {
    Start-Process -FilePath $chrome -ArgumentList "http://localhost:3000"
    $opened = $true
    break
  }
}

if (-not $opened) {
  for ($i = 0; $i -lt 5; $i++) {
    try {
      Start-Process "http://localhost:3000"
      $opened = $true
      break
    } catch {
      Start-Sleep -Seconds 2
    }
  }
}

if (-not $opened) {
  Write-Host "Could not auto-open the browser. Please open http://localhost:3000 manually."
}
