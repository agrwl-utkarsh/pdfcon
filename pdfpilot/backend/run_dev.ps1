$ErrorActionPreference = "Stop"

$backendDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = "C:\Python314\python.exe"
if (!(Test-Path $python)) {
  $python = "python"
}

$venvPath = Join-Path $backendDir ".venv"
$venvPython = Join-Path $venvPath "Scripts\python.exe"

if (!(Test-Path $venvPython)) {
  & $python -m venv $venvPath
}

& $venvPython -m pip install -r (Join-Path $backendDir "requirements.txt")
& $venvPython -m uvicorn main:app --reload
