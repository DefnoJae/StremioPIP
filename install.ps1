param(
    [string]$StremioPath = "$env:LOCALAPPDATA\Programs\LNV\Stremio-5"
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Stremio PiP Installer" -ForegroundColor Cyan
Write-Host "---------------------"

if (-not (Test-Path $StremioPath)) {
    Write-Host "Stremio Community v5 was not found at:" -ForegroundColor Yellow
    Write-Host "  $StremioPath"
    Write-Host ""
    Write-Host "Pass the install path manually, for example:"
    Write-Host '  .\install.ps1 -StremioPath "C:\Path\To\Stremio-5"'
    exit 1
}

$webModsPath = Join-Path $StremioPath "portable_config\webmods"
$modPath = Join-Path $webModsPath "stremio-pip"

New-Item -ItemType Directory -Force -Path $modPath | Out-Null

$repoRaw = "https://raw.githubusercontent.com/DefnoJae/StremioPIP/main"

Write-Host "Downloading latest Stremio PiP files..."
Invoke-WebRequest -UseBasicParsing "$repoRaw/manifest.json" -OutFile (Join-Path $modPath "manifest.json")
Invoke-WebRequest -UseBasicParsing "$repoRaw/stremio-pip.js" -OutFile (Join-Path $modPath "stremio-pip.js")

Write-Host ""
Write-Host "Installed successfully to:" -ForegroundColor Green
Write-Host "  $modPath"
Write-Host ""
Write-Host "Fully close Stremio Community v5 and reopen it."
Write-Host "Then start a video and look for the PiP button in the player controls."
Write-Host ""
