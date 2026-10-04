param(
    [string]$StremioPath = ""
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Stremio PiP Installer" -ForegroundColor Cyan
Write-Host "---------------------"

$possiblePaths = @(
    "$env:LOCALAPPDATA\Programs\LNV\Stremio-5",
    "$env:LOCALAPPDATA\Programs\Stremio-5"
)

if ([string]::IsNullOrWhiteSpace($StremioPath)) {
    $StremioPath = $possiblePaths | Where-Object {
        Test-Path (Join-Path $_ "stremio.exe")
    } | Select-Object -First 1
}

if ([string]::IsNullOrWhiteSpace($StremioPath) -or -not (Test-Path $StremioPath)) {
    Write-Host ""
    Write-Host "Stremio Community v5 was not found automatically." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "This PiP project is a WebMod, so it currently needs Stremio Community v5."
    Write-Host "If you already installed it somewhere else, run:"
    Write-Host '  & ([scriptblock]::Create((irm https://raw.githubusercontent.com/DefnoJae/StremioPIP/main/install.ps1))) -StremioPath "C:\Path\To\Stremio-5"'
    Write-Host ""
    return
}

$webModsPath = Join-Path $StremioPath "portable_config\webmods"
$modPath = Join-Path $webModsPath "stremio-pip"

New-Item -ItemType Directory -Force -Path $modPath | Out-Null

$repoRaw = "https://raw.githubusercontent.com/DefnoJae/StremioPIP/main"

Write-Host ""
Write-Host "Found Stremio Community v5 at:" -ForegroundColor DarkGray
Write-Host "  $StremioPath"
Write-Host ""
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
