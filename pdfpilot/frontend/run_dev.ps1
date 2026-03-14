$ErrorActionPreference = "Stop"

$frontendDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$npm = "C:\Program Files\nodejs\npm.cmd"
if (!(Test-Path $npm)) {
  $npm = "npm"
}

Push-Location $frontendDir
& $npm install
& $npm run dev
Pop-Location
