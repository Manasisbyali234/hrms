@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=C:\Program Files\Android\Android Studio\jbr\bin;%PATH%"
cd /d "c:\Users\Mansi\Downloads\HRMS\HRMS\android"
call gradlew.bat assembleRelease
