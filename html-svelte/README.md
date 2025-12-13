# QB Inventory - Svelte Version

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Para desarrollo (con hot reload):
```bash
npm run dev
```

3. Para compilar para producción:
```bash
npm run build
```

Los archivos compilados estarán en `../html-build/`

## Estructura del Proyecto

```
html-svelte/
├── src/
│   ├── components/       # Componentes Svelte
│   │   ├── Inventory.svelte
│   │   ├── InventoryGrid.svelte
│   │   ├── ItemSlot.svelte
│   │   ├── ItemInfo.svelte
│   │   ├── WeaponAttachments.svelte
│   │   ├── ItemBoxes.svelte
│   │   └── RequiredItems.svelte
│   ├── stores/          # State management
│   │   └── inventory.js
│   ├── App.svelte       # Componente principal
│   ├── main.js          # Entry point
│   └── app.css          # Estilos globales
├── index.html
├── package.json
├── vite.config.js
└── svelte.config.js
```

## Características

- ✅ Sistema de drag & drop con interactjs
- ✅ Gestión de estado reactiva con Svelte stores
- ✅ Interfaz completamente reactiva
- ✅ Comunicación con FiveM via postMessage
- ✅ Todos los estilos y funcionalidades del original
- ✅ Modo debug para desarrollo
- ✅ Performance optimizada

## Uso en FiveM

Después de compilar (`npm run build`), copiar los archivos de `html-build/` a tu carpeta `html/` del recurso FiveM.

Actualizar `fxmanifest.lua` para incluir los nuevos archivos generados.

