@echo off
echo ========================================
echo   Git Push - Placement Portal
echo ========================================
echo.

cd C:\Users\Asus\placement-portal

REM Initialize git if not already initialized
if not exist ".git" (
    echo [1/6] Initializing Git repository...
    git init
) else (
    echo [1/6] Git already initialized, skipping...
)

echo [2/6] Adding all files...
git add .

echo.
echo [3/6] Committing changes...
git commit -m "Initial commit: Full Stack Placement Preparation Portal with SQLite

Features:
- User Authentication (JWT + bcrypt)
- Question Bank with categories (aptitude, technical, coding)
- Mock Tests with timer and scoring
- Company Portal with interview experiences
- Progress Tracking with analytics
- Admin Panel for content management
- SQLite database (no external setup required)
- React + Vite frontend with Tailwind CSS
- Recharts for analytics visualization"

REM Set branch to main
echo [4/6] Setting branch to main...
git branch -M main

REM Set remote origin
echo [5/6] Adding remote origin...
git remote set-url origin https://github.com/deeptismitab-ship-it/Full_Stack_Placement_Preparation_Portal.git 2>nul
if errorlevel 1 (
    git remote add origin https://github.com/deeptismitab-ship-it/Full_Stack_Placement_Preparation_Portal.git
)

REM Push to GitHub
echo [6/6] Pushing to GitHub...
git push -u origin main --force

echo.
echo ========================================
echo   Done! Check your GitHub repository.
echo ========================================
pause