# 🚀 GUÍA RÁPIDA: Instalar QB-Inventory Svelte

## ✅ OPCIÓN FÁCIL: Usar el script automático

### Windows:
1. Haz doble clic en `build-svelte.bat`
2. Espera a que termine
3. En tu servidor FiveM:
   ```
   refresh
   restart qb-inventory
   ```

### Linux:
```bash
chmod +x build-svelte.sh
./build-svelte.sh
```

---

## 📝 OPCIÓN MANUAL (si el script no funciona):

### Paso 1: Copiar assets a la carpeta public

Copia estas carpetas desde `html/` a `html-svelte/public/`:
- `images/`
- `attachment_images/`
- `svgs/`
- Todos los archivos `.ttf`, `.otf`, `.ogg`

### Paso 2: Compilar

```bash
cd html-svelte
npm install
npm run build
```

### Paso 3: Reemplazar carpeta html

```bash
# Hacer backup (desde la raíz del recurso)
ren html html-backup

# Los archivos compilados están en html-build, renombrarlo
ren html-build html
```

### Paso 4: Actualizar fxmanifest.lua

Reemplaza tu `fxmanifest.lua` con el contenido de `fxmanifest-svelte.lua`

O simplemente cambia estas líneas:

```lua
ui_page 'html/index.html'

files {
    'html/index.html',
    'html/assets/*.js',
    'html/assets/*.css',
    'html/images/*.png',
    'html/images/*.jpg',
    'html/images/*.PNG',
    'html/attachment_images/*.png',
    'html/svgs/*.svg',
    'html/*.ttf',
    'html/*.otf',
    'html/*.ogg'
}
```

### Paso 5: Reiniciar recurso

En la consola del servidor:
```
refresh
restart qb-inventory
```

---

## ⚠️ IMPORTANTE

- **NO toques** los archivos Lua (client/server)
- **SOLO** cambia la carpeta `html/`
- Guarda backup de tu `html/` original
- Los assets (images, fonts, etc) DEBEN estar en la carpeta final

---

## 🐛 Solución de problemas

**"No se ven las imágenes"**
→ Verifica que `html/images/` tenga todos los archivos

**"El inventario no abre"**
→ Revisa la consola F8 en el juego, mira errores
→ Verifica que `fxmanifest.lua` apunte a `html/index.html`

**"Error en el build"**
→ Asegúrate de tener Node.js instalado
→ Borra `node_modules` y ejecuta `npm install` de nuevo

**"Quiero volver al original"**
→ Borra `html/` actual
→ Renombra `html-backup/` a `html/`
→ Restaura el `fxmanifest.lua` original

