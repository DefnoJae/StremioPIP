param(
    [string]$StremioPath = "$env:LOCALAPPDATA\Programs\LNV\Stremio-5"
)

$ErrorActionPreference = "Stop"

$modPath = Join-Path $StremioPath "portable_config\webmods\stremio-pip"

if (Test-Path $modPath) {
    Remove-Item -Recurse -Force $modPath
    Write-Host "Stremio PiP removed successfully." -ForegroundColor Green
} else {
    Write-Host "Stremio PiP is not installed at:"
    Write-Host "  $modPath"
}
