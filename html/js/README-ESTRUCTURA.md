# Estructura Refactorizada del Inventario QB

## Archivos Módulos

### 1. **state.js**
- Contiene todas las variables globales del estado del inventario
- Maneja: pesos, slots, items seleccionados, estados de drag/drop

### 2. **utils.js**
- Funciones utilitarias y helpers
- Maneja: búsqueda de slots libres, validaciones de movimiento, cálculo de pesos, errores visuales

### 3. **ui-renderer.js**
- Renderizado de elementos visuales
- Maneja: generación de HTML para items, labels, barras de calidad, slots

### 4. **items.js**
- Formateo específico de información de items
- Maneja: tarjetas de ID, licencias, armas, evidencias, etc.

### 5. **weapons.js**
- Gestión de accesorios de armas
- Maneja: pantalla de attachments, drag & drop de accesorios, información de armas

### 6. **drag-drop.js**
- Sistema completo de arrastrar y soltar
- Maneja: movimiento de items, stacking, swapping, validaciones

### 7. **event-handlers.js**
- Todos los event listeners y handlers
- Maneja: clicks, doble clicks, teclado, hover, menús

### 8. **inventory-core.js**
- Funcionalidad principal del inventario
- Maneja: abrir/cerrar, actualizar, hotbar, itembox

### 9. **app.js**
- Punto de entrada principal
- Maneja: mensajes NUI, inicialización, coordinación de módulos

## Orden de Carga

Los archivos se cargan en este orden específico en `ui.html`:

1. state.js (variables globales primero)
2. utils.js (utilidades básicas)
3. ui-renderer.js (renderizado)
4. items.js (formateo de items)
5. weapons.js (sistema de armas)
6. drag-drop.js (sistema de arrastre)
7. event-handlers.js (eventos)
8. inventory-core.js (lógica principal)
9. app.js (inicialización)

## Ventajas de la Nueva Estructura

- **Mantenibilidad**: Cada módulo tiene una responsabilidad clara
- **Legibilidad**: Funciones organizadas por contexto
- **Debugging**: Más fácil encontrar y corregir bugs
- **Escalabilidad**: Simple agregar nuevas funcionalidades
- **Reutilización**: Funciones modulares reutilizables

## Compatibilidad

- 100% compatible con el código original
- Mismos callbacks NUI
- Misma funcionalidad
- Sin cambios en archivos Lua

