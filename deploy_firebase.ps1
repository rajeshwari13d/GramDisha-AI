# GramDisha AI — Firebase Deployment Helper
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  GramDisha AI — Firebase Deploy Helper  " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Checking Firebase Login Status..." -ForegroundColor Yellow
firebase login

Write-Host ""
Write-Host "[2/3] Building latest frontend production bundle..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\frontend"
npm run build
Set-Location -Path "$PSScriptRoot"

Write-Host ""
Write-Host "[3/3] Deploying to Firebase project 'gramdishaai'..." -ForegroundColor Yellow
firebase deploy --only hosting --project gramdishaai

Write-Host ""
Write-Host "Deployment finished! Check the URL above." -ForegroundColor Green
Pause
