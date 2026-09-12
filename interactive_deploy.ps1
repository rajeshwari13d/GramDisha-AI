Clear-Host
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       GramDisha AI — Firebase Deployment Helper          " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Step 1: Signing in with rjmali2006@gmail.com..." -ForegroundColor Yellow
Write-Host "(A browser window will open — please choose rjmali2006@gmail.com)" -ForegroundColor Gray
Write-Host ""

firebase login:add

Write-Host ""
Write-Host "Step 2: Deploying hosting to project 'gramdishaai'..." -ForegroundColor Yellow
firebase deploy --only hosting --project gramdishaai

Write-Host ""
Write-Host "Deployment complete! Live link: https://gramdishaai.web.app" -ForegroundColor Green
Write-Host "Press any key to close this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
