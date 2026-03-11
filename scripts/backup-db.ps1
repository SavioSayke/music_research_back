# Requires: pg_dump in PATH
# Env vars: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE, BACKUP_DIR
param(
    [string]$BackupDir = $env:BACKUP_DIR,
    [string]$Database = $env:PGDATABASE
)

if (-not $BackupDir) { $BackupDir = "./backups" }
if (-not (Test-Path $BackupDir)) { New-Item -ItemType Directory -Path $BackupDir | Out-Null }

$ts = Get-Date -Format "yyyyMMdd_HHmmss"
if (-not $Database) { $Database = "postgres" }
$fname = Join-Path $BackupDir ("${Database}_backup_${ts}.sql")

Write-Host "Backing up database '$Database' to '$fname'..."

$env:PGPASSWORD = $env:PGPASSWORD
pg_dump --host "$env:PGHOST" --port "$env:PGPORT" --username "$env:PGUSER" --format plain --no-owner --no-privileges "$Database" | Out-File -FilePath $fname -Encoding utf8

if ($LASTEXITCODE -ne 0) { Write-Error "pg_dump failed with exit code $LASTEXITCODE"; exit $LASTEXITCODE }

Write-Host "Backup complete: $fname"