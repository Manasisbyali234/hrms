@echo off
set JAVA_HOME=C:\PROGRA~1\Android\ANDROI~1\jbr
set ANDROID_HOME=C:\Users\Mansi\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%
echo JAVA_HOME=%JAVA_HOME%
cd android
call gradlew.bat assembleRelease
echo.
echo APK location: android\app\build\outputs\apk\release\app-release.apk
pause
