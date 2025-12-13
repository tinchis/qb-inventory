# Instrucciones para usar el Inventario en Svelte

## 📦 Instalación

1. **Instalar dependencias**:
```bash
npm install
```

2. **Compilar para producción**:
```bash
npm run build
```

Esto generará los archivos en `html/js/main.js` y `html/css/main.css`

## 🎮 Configuración en FiveM

### Opción 1: Reemplazar el HTML original

En `fxmanifest.lua`, cambia:
```lua
ui_page 'html/ui.html'
```

Por:
```lua
ui_page 'html/ui-svelte.html'
```

### Opción 2: Probar ambas versiones

1. **Para usar la versión original (jQuery)**:
```lua
ui_page 'html/ui.html'
```

2. **Para usar la versión Svelte**:
```lua
ui_page 'html/ui-svelte.html'
```

## 🔄 Desarrollo

Para desarrollo en tiempo real:
```bash
npm run dev
```

Esto abrirá un servidor local en `http://localhost:5173`

## 📁 Archivos importantes

- `html/ui-svelte.html` - HTML para la versión Svelte
- `html/ui.html` - HTML original (jQuery)
- `html/js/main.js` - JavaScript compilado de Svelte
- `html/css/main.css` - CSS compilado
- `src/` - Código fuente Svelte

## ✅ Verificación

Después de compilar, verifica que existan estos archivos:
- `html/js/main.js`
- `html/css/main.css`
- `html/ui-svelte.html`

## 🔧 Reconstruir después de cambios

Cada vez que modifiques los archivos `.svelte` en `src/`, ejecuta:
```bash
npm run build
```

Luego reinicia el recurso en FiveM:
```
/restart qb-inventory
```

## ⚠️ Notas

- Los estilos y funcionalidades son **idénticos** a la versión original
- Todas las comunicaciones con FiveM (`fetch('https://qb-inventory/...')`) funcionan igual
- Las imágenes, iconos y assets se mantienen en sus ubicaciones originales
- No necesitas modificar nada en los archivos Lua del servidor/cliente

