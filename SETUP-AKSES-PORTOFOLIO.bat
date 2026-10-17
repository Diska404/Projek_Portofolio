@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
title DevPulse - Kode akses shortcut portofolio
call npm.cmd run setup:bridge -- %*
echo.
pause
