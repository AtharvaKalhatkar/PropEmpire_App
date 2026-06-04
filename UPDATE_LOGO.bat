@echo off
echo ===================================================
echo PropEmpire Logo Updater
echo ===================================================
echo.
echo Make sure you have replaced 'src\assets\COMPANY_LOGO.png' with your new logo before continuing.
echo.
pause

echo.
echo [1/3] Generating new App Icons for Mobile Home Screen...
node generate-icons.js

echo.
echo [2/3] Building and Deploying app to GitHub Pages...
call npm run deploy

echo.
echo [3/3] Saving changes to GitHub Repository...
git add -A
git commit -m "Update COMPANY_LOGO.png and regenerate assets"
git push origin main

echo.
echo ===================================================
echo SUCCESS! Logo has been updated everywhere.
echo Changes may take 1-2 minutes to appear online.
echo ===================================================
pause
