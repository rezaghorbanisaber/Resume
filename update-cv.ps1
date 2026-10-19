# Copies the latest CV (PDF + Word) from the "Improved version" folder into the website and publishes it.
# Usage (from this folder):  powershell -ExecutionPolicy Bypass -File .\update-cv.ps1
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$src = Join-Path $PSScriptRoot '..\..\Improved version'
Copy-Item (Join-Path $src 'CV.RezaGhorbaniSaber.pdf') 'cv\RezaGhorbaniSaber_CV.pdf' -Force
Copy-Item (Join-Path $src 'CV.RezaGhorbani.docx')     'cv\RezaGhorbaniSaber_CV.docx' -Force

git add cv
git diff --cached --quiet
if ($LASTEXITCODE -eq 0) { Write-Host 'CV files unchanged - nothing to publish.'; exit 0 }
git commit -m "Update CV files"
git push origin main
Write-Host 'CV updated. The website shows the new version within a minute or two.'
