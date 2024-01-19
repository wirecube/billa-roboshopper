@echo off
SETLOCAL

REM Check if pnpm is installed
where pnpm >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo pnpm not found, installing...
    npm install -g pnpm
) ELSE (
    echo pnpm is installed.
)

REM Install dependencies using pnpm
echo Installing dependencies...
pnpm install

REM Run the project
echo Starting the project...
pnpm run start

ENDLOCAL