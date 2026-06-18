@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "ANDROID_HOME=C:\Users\Mansi\AppData\Local\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%"
cd /d c:\Users\Mansi\Downloads\HRMS\HRMS\android
call gradlew.bat assembleRelease --stacktrace > ..\build_log.txt 2>&1
echo BUILD EXIT CODE: %ERRORLEVEL%
