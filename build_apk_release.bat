@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio1\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo Using Java: %JAVA_HOME%
"%JAVA_HOME%\bin\java.exe" -version
cd /d "%~dp0android"
call gradlew.bat assembleRelease
echo.
echo ============================================
echo APK location if build succeeded:
echo %~dp0android\app\build\outputs\apk\release\app-release.apk
echo ============================================
pause
