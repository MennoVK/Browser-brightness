md temp

xcopy styles temp\styles /S /Y /I
xcopy scripts temp\scripts /S /Y /I
xcopy assets temp\assets /S /Y /I
xcopy index.html temp /Y
xcopy manifest.json temp /Y

for %%I in (.) do set CurrDirName=%%~nxI
powershell Compress-Archive -Path "temp\*" -DestinationPath %CurrDirName% -Force

rmdir temp /s /q