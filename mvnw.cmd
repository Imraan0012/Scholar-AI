@REM ----------------------------------------------------------------------------
@REM Scholar AI Maven Wrapper
@REM ----------------------------------------------------------------------------
@echo off
if exist "C:\Users\moham\.m2\apache-maven-3.9.6\bin\mvn.cmd" (
  "C:\Users\moham\.m2\apache-maven-3.9.6\bin\mvn.cmd" -f backend\pom.xml %*
) else (
  mvn -f backend\pom.xml %*
)
