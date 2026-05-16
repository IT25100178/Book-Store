@echo off
set PATH=%~dp0node-v20.11.1-win-x64;%PATH%
npm run dev > frontend_out.log 2>&1
