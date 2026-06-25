@echo off
title HRMS - Debug APK Build

set "PROJECT_ROOT=c:\Users\Mansi\Downloads\HRMS\HRMS"
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "ANDROID_HOME=C:\Users\Mansi\AppData\Local\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%"

:: Match gradle.properties: newArchEnabled=true, hermesEnabled=true, arm64-v8a
set "GRADLE_OPTS=-PreactNativeArchitectures=arm64-v8a -PnewArchEnabled=true -PhermesEnabled=true"

echo ================================================
echo   HRMS - Building Debug APK
echo   Arch: arm64-v8a  |  NewArch: ON  |  Hermes: ON
echo   Gradle: 8.13  |  React Native: 0.85.3
echo   Expo: 56.x
echo ================================================
echo.

:: Check Java
java -version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Java not found. Check JAVA_HOME: %JAVA_HOME%
    pause & exit /b 1
)
echo [OK] Java found

:: Check Android SDK
if not exist "%ANDROID_HOME%" (
    echo [ERROR] Android SDK not found at: %ANDROID_HOME%
    pause & exit /b 1
)
echo [OK] Android SDK found

:: Go to project root
cd /d "%PROJECT_ROOT%"

:: Install node_modules if missing
if not exist "node_modules" (
    echo [INFO] node_modules not found. Running npm install...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] npm install failed
        pause & exit /b 1
    )
)
echo [OK] node_modules ready

:: Build debug APK
echo.
echo [BUILD] Running assembleDebug...
echo.
cd android
call gradlew.bat assembleDebug %GRADLE_OPTS% --build-cache 2>&1
set BUILD_CODE=%ERRORLEVEL%
cd ..

echo.
if %BUILD_CODE% equ 0 (
    echo ================================================
    echo   BUILD SUCCESSFUL
    echo   APK: android\app\build\outputs\apk\debug\app-debug.apk
    echo ================================================
) else (
    echo ================================================
    echo   BUILD FAILED  ^(exit code: %BUILD_CODE%^)
    echo   Check output above for errors.
    echo ================================================
)

echo.
pause
