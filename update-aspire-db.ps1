#!/usr/bin/env pwsh
param(
  [int]    $Port = 52297,
  [string] $Db   = 'bethanydb',
  [string] $User = 'postgres',
  [string] $Pass = '7f6v3cAhSKK5N6MXuA)7}d',
  [string[]] $Migrations
)

$ErrorActionPreference = 'Stop'

# Resolve paths relative to this script
$root        = Split-Path -Parent $PSCommandPath
$apiProj     = Join-Path $root 'HHBAspire/HHBAspire.ApiService/HHBAspire.ApiService.csproj'
$startupProj = $apiProj
$appHostProj = Join-Path $root 'HHBAspire/HHBAspire.AppHost/HHBAspire.AppHost.csproj'

Set-Location $root

Write-Host "[1/6] Starting .NET Aspire AppHost..."
$p = Start-Process dotnet -ArgumentList @('run','--project', $appHostProj) -PassThru -NoNewWindow

Write-Host "[2/6] Waiting for PostgreSQL on localhost:$Port (90s timeout)..."
$deadline = (Get-Date).AddSeconds(90)
while ((Get-Date) -lt $deadline) {
  try {
    $c = New-Object System.Net.Sockets.TcpClient('localhost', [int]$Port)
    $c.Close()
    break
  } catch {
    if ($p.HasExited) { throw "AppHost exited early (code $($p.ExitCode))." }
    Start-Sleep -Milliseconds 500
  }
}
if ((Get-Date) -ge $deadline) { throw "Timed out waiting for port $Port." }

# Parse migrations: supports comma- or space-separated names
$names = @()
if ($Migrations) {
  foreach ($m in $Migrations) {
    $names += ($m -split '[,\s]+' | Where-Object { $_ -ne '' })
  }
}
if ($names.Count -gt 0) {
  Write-Host "[3/6] Creating migrations: $($names -join ', ')"
  foreach ($name in $names) {
    Write-Host "   - Add-Migration $name"
    dotnet ef migrations add $name --project $apiProj --startup-project $startupProj
  }
} else {
  Write-Host "[3/6] No migration names provided. Skipping Add-Migration."
}

Write-Host "[4/6] Building ApiService..."
dotnet build $apiProj

Write-Host "[5/6] Applying EF Core migrations (database update)..."
$cs = "Host=localhost;Port=$Port;Database=$Db;Username=$User;Password=$Pass"
dotnet ef database update --project $apiProj --startup-project $startupProj --connection $cs

Write-Host "[6/6] Stopping .NET Aspire AppHost (PID $($p.Id))..."
if (-not $p.HasExited) { Stop-Process -Id $p.Id -Force }
