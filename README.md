# QB Inventory - Svelte

Versión en Svelte del inventario de FiveM QBCore.

## Estructura del Proyecto

```
src/
├── components/
│   ├── Inventory.svelte          # Contenedor principal
│   ├── InventoryContainer.svelte # Contenedor del inventario del jugador
│   ├── OtherInventory.svelte     # Inventario secundario
│   ├── ItemSlot.svelte           # Slot individual de item
│   ├── TabMenu.svelte            # Menú de pestañas
│   ├── WeaponAttachments.svelte  # Pantalla de accesorios
│   ├── ItemInfo.svelte           # Tooltip de información
│   ├── CombineOption.svelte      # Opciones de combinación
│   ├── ItemBoxes.svelte          # Notificaciones de items
│   └── tabs/
│       ├── InventoryTab.svelte   # Pestaña de inventario
│       ├── EmotesTab.svelte      # Pestaña de emotes
│       ├── ClothesTab.svelte     # Pestaña de ropa
│       └── MenuTab.svelte        # Pestañas de menús dinámicos
├── stores/
│   └── inventoryStore.js         # Store principal de Svelte
├── styles/
│   └── global.css                # Estilos globales
├── App.svelte                    # Componente raíz
└── main.js                       # Punto de entrada

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Desarrollo:
```bash
npm run dev
```

3. Build para producción:
```bash
npm run build
```

Los archivos compilados se generarán en `html-svelte/`.

## Características

- ✅ Sistema de drag & drop funcional
- ✅ Tabs para inventario, emotes, ropa y menús dinámicos
- ✅ Sistema de accesorios de armas
- ✅ Tooltips de información de items
- ✅ Notificaciones de items
- ✅ Sistema de combinación de items
- ✅ Compatibilidad total con el sistema original
- ✅ Componentizado y organizado
- ✅ Mismo diseño y funcionalidades

## Diferencias con el Original

- Código organizado en componentes reutilizables
- Store centralizado para el estado
- Mejor separación de responsabilidades
- Más fácil de mantener y modificar estilos
- Sin dependencias de jQuery

## Notas

- Los estilos CSS se mantienen exactamente iguales
- Todas las funcionalidades del original están implementadas
- Compatible con los eventos de FiveM existentes

