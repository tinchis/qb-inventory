# Guía de Integración - QB Inventory Svelte

## 🔧 Paso 1: Compilar el proyecto Svelte

1. Abre una terminal en la carpeta `html-svelte`:
```bash
cd D:\web\qb-inventory\html-svelte
```

2. Instala las dependencias:
```bash
npm install
```

3. Compila el proyecto:
```bash
npm run build
```

Esto creará la carpeta `html-build` con todos los archivos compilados.

## 📂 Paso 2: Copiar assets necesarios

Copia estas carpetas desde `html` a `html-build`:
- `images/` (todas las imágenes de items)
- `attachment_images/` (imágenes de armas)
- `svgs/` (iconos SVG)
- `*.ttf` y `*.otf` (fuentes)
- `*.ogg` (sonidos)

## 🔄 Paso 3: Reemplazar la carpeta html

Opción A (recomendada - mantener backup):
```bash
# Renombrar html original
ren html html-backup

# Renombrar html-build a html
ren html-build html
```

Opción B (directo):
- Elimina la carpeta `html` actual
- Renombra `html-build` a `html`

## 📝 Paso 4: Actualizar fxmanifest.lua

El fxmanifest.lua ya está configurado correctamente. Solo asegúrate que la sección ui_page apunte a:
```lua
ui_page 'html/index.html'
```

## ✅ Paso 5: Reiniciar el recurso

En la consola del servidor:
```
refresh
restart qb-inventory
```

## ⚠️ Notas importantes

- Los archivos Lua (client/server) NO cambian
- Solo cambia la interfaz (HTML/JS/CSS)
- La comunicación con FiveM sigue igual (postMessage)
- Compatible con todas las funciones del original

## 🐛 Si algo no funciona

Verifica que `html/` contenga:
- index.html
- assets/ (con los .js y .css compilados)
- images/
- attachment_images/
- svgs/
- fuentes (.ttf, .otf)

