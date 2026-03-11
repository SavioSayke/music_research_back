# Requires: psql in PATH
# Env vars: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
param(
    [Parameter(Mandatory=$true)][string]$BackupFile
)

if (-not (Test-Path $BackupFile)) { Write-Error "Backup file not found: $BackupFile"; exit 1 }

$Database = $env:PGDATABASE
if (-not $Database) { $Database = "postgres" }

Write-Host "Restoring database '$Database' from '$BackupFile'..."

$env:PGPASSWORD = $env:PGPASSWORD
psql --host "$env:PGHOST" --port "$env:PGPORT" --username "$env:PGUSER" --dbname "$Database" --file "$BackupFile"

if ($LASTEXITCODE -ne 0) { Write-Error "psql restore failed with exit code $LASTEXITCODE"; exit $LASTEXITCODE }

Write-Host "Restore complete."