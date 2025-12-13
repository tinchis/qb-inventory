# QB-Inventory - Versión Svelte ⚡

Este recurso ahora tiene **DOS versiones**:

## 📁 Carpetas:
- **`html/`** - Versión ORIGINAL (jQuery)
- **`html-svelte/`** - Versión NUEVA (Svelte)

---

## 🎯 ¿Qué versión usar?

### Versión ORIGINAL (html/)
- ✅ Ya funciona sin hacer nada
- ✅ No requiere compilación
- ❌ Usa jQuery (pesado)
- ❌ Código menos mantenible

### Versión SVELTE (html-svelte/)
- ✅ Más rápida y ligera
- ✅ Código moderno y reactivo
- ✅ Mejor performance
- ⚠️ Requiere compilación

---

## 🚀 Cómo activar la versión Svelte

### OPCIÓN 1: Script automático (más fácil)
```bash
# Windows
build-svelte.bat

# Linux
chmod +x build-svelte.sh
./build-svelte.sh
```

### OPCIÓN 2: Manual
Lee el archivo `GUIA-INSTALACION.md`

---

## 📦 ¿Qué hace el script?

1. Compila el código Svelte
2. Copia las imágenes y assets
3. Hace backup de tu versión actual
4. Reemplaza `html/` con la versión compilada

**Tu versión original queda guardada en `html-backup/`**

---

## 🔄 Volver a la versión original

Si algo no funciona:
```bash
ren html html-svelte-compiled
ren html-backup html
```

Restaura también el `fxmanifest.lua` original.

---

## 📋 Requisitos para compilar

- Node.js 16+ instalado
- NPM (viene con Node.js)

Descarga Node.js: https://nodejs.org/

---

## ❓ ¿Problemas?

Lee `GUIA-INSTALACION.md` para soluciones detalladas.

---

**Nota:** Los archivos Lua (client/server) son los mismos en ambas versiones. Solo cambia la interfaz visual.

