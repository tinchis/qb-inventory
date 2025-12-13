@echo off
echo ========================================
echo QB-Inventory Svelte - Script de Build
echo ========================================
echo.

cd html-svelte

echo [1/4] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)

echo.
echo [2/4] Compilando proyecto Svelte...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: No se pudo compilar el proyecto
    pause
    exit /b 1
)

cd ..

echo.
echo [3/4] Copiando assets necesarios...

if not exist "html-build" (
    echo ERROR: No se encontro la carpeta html-build
    pause
    exit /b 1
)

xcopy /E /I /Y "html\images" "html-build\images"
xcopy /E /I /Y "html\attachment_images" "html-build\attachment_images"
xcopy /E /I /Y "html\svgs" "html-build\svgs"
xcopy /Y "html\*.ttf" "html-build\"
xcopy /Y "html\*.otf" "html-build\"
xcopy /Y "html\*.ogg" "html-build\"

echo.
echo [4/4] Creando backup y reemplazando...

if exist "html-backup" (
    echo Eliminando backup anterior...
    rmdir /S /Q "html-backup"
)

if exist "html" (
    echo Creando backup de html original...
    ren html html-backup
)

echo Activando nueva version...
ren html-build html

echo.
echo ========================================
echo BUILD COMPLETADO EXITOSAMENTE
echo ========================================
echo.
echo La carpeta 'html' ahora contiene la version Svelte compilada.
echo Tu version original esta en 'html-backup'.
echo.
echo Reinicia el recurso en tu servidor:
echo   refresh
echo   restart qb-inventory
echo.
pause

