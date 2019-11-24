@echo off
setlocal EnableDelayedExpansion

node generateReadme

set "cmd=findstr /R /N "^^" README.md"
set msg="%~2"

set solved=0

for /f %%a in ('!cmd!') do (
  set line=%%a
  if NOT "!line!"=="!line:.**=!" (
    set /A solved=solved+1)
  )
)

echo %solved%

if "%1" == "" (
  git add ./
  git commit -m %solved%
) else (
  if NOT "%1" == "-na" (git add "%1")
  if "%~2" == "" (git commit -m %solved%) else (git commit -m %msg%)
)

git push