#!/bin/bash

echo "========================================"
echo "QB-Inventory Svelte - Build Script"
echo "========================================"
echo ""

cd html-svelte

echo "[1/4] Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: No se pudieron instalar las dependencias"
    exit 1
fi

echo ""
echo "[2/4] Compilando proyecto Svelte..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: No se pudo compilar el proyecto"
    exit 1
fi

cd ..

echo ""
echo "[3/4] Copiando assets necesarios..."

if [ ! -d "html-build" ]; then
    echo "ERROR: No se encontró la carpeta html-build"
    exit 1
fi

cp -r html/images html-build/
cp -r html/attachment_images html-build/
cp -r html/svgs html-build/
cp html/*.ttf html-build/ 2>/dev/null || true
cp html/*.otf html-build/ 2>/dev/null || true
cp html/*.ogg html-build/ 2>/dev/null || true

echo ""
echo "[4/4] Creando backup y reemplazando..."

if [ -d "html-backup" ]; then
    echo "Eliminando backup anterior..."
    rm -rf html-backup
fi

if [ -d "html" ]; then
    echo "Creando backup de html original..."
    mv html html-backup
fi

echo "Activando nueva versión..."
mv html-build html

echo ""
echo "========================================"
echo "BUILD COMPLETADO EXITOSAMENTE"
echo "========================================"
echo ""
echo "La carpeta 'html' ahora contiene la versión Svelte compilada."
echo "Tu versión original está en 'html-backup'."
echo ""
echo "Reinicia el recurso en tu servidor:"
echo "  refresh"
echo "  restart qb-inventory"
echo ""

