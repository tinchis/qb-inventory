# 📖 Instrucciones de Uso - Inventario Refactorizado

## 🚀 Instalación

La refactorización ya está aplicada. **No requiere instalación adicional**.

## ✅ Verificación

### 1. Archivos Necesarios
Verifica que existan estos archivos en `html/js/`:
- ✅ state.js
- ✅ utils.js
- ✅ ui-renderer.js
- ✅ items.js
- ✅ weapons.js
- ✅ drag-drop.js
- ✅ event-handlers.js
- ✅ inventory-core.js
- ✅ app.js

### 2. Verificar fxmanifest.lua
El archivo `fxmanifest.lua` debe incluir todos los módulos en la sección `files`:

```lua
files {
    'html/ui.html',
    'html/css/main.css',
    'html/js/state.js',
    'html/js/utils.js',
    'html/js/ui-renderer.js',
    'html/js/items.js',
    'html/js/weapons.js',
    'html/js/drag-drop.js',
    'html/js/event-handlers.js',
    'html/js/inventory-core.js',
    'html/js/app.js',
    ...
}
```

### 3. Verificar ui.html
El archivo `html/ui.html` debe cargar los scripts en este orden:

```html
<script src="js/state.js" type="text/javascript"></script>
<script src="js/utils.js" type="text/javascript"></script>
<script src="js/ui-renderer.js" type="text/javascript"></script>
<script src="js/items.js" type="text/javascript"></script>
<script src="js/weapons.js" type="text/javascript"></script>
<script src="js/drag-drop.js" type="text/javascript"></script>
<script src="js/event-handlers.js" type="text/javascript"></script>
<script src="js/inventory-core.js" type="text/javascript"></script>
<script src="js/app.js" type="text/javascript"></script>
```

## 🎮 Uso en Servidor

### Reiniciar el Recurso
```bash
# En consola del servidor
restart qb-inventory

# O si está en otro nombre
restart [nombre-del-recurso]
```

### Primera Prueba
1. Conecta al servidor
2. Abre el inventario (tecla configurada)
3. Verifica que todo funciona:
   - ✅ Abrir/cerrar inventario
   - ✅ Arrastrar items
   - ✅ Dar items
   - ✅ Usar items
   - ✅ Dropar items
   - ✅ Accesorios de armas
   - ✅ Combinar items
   - ✅ Hotbar

## 🐛 Debugging

### Consola del Navegador (F8 en juego)
Si hay problemas, abre la consola F8 y busca errores:

```javascript
// Deberías ver algo como:
// [QB-Inventory] Módulos cargados correctamente
```

### Errores Comunes

#### 1. "InventoryState is not defined"
**Causa**: state.js no se cargó
**Solución**: Verifica el orden en ui.html

#### 2. "InventoryCore is not defined"
**Causa**: inventory-core.js no se cargó
**Solución**: Verifica fxmanifest.lua y ui.html

#### 3. Items no se mueven
**Causa**: drag-drop.js no se cargó
**Solución**: Verifica console F8 para errores

#### 4. Accesorios de armas no funcionan
**Causa**: weapons.js no se cargó
**Solución**: Verifica console F8 y orden de carga

## 🔧 Modificaciones

### Agregar Nuevo Tipo de Item

**Archivo**: `items.js`

```javascript
// En ItemFormatter object
formatNuevoTipo(itemData) {
    $('.item-info-title').html(UIRenderer.createItemInfoTitle(itemData));
    $('.item-info-description').html(`
        <p><strong>Campo 1:</strong> ${itemData.info.campo1}</p>
        <p><strong>Campo 2:</strong> ${itemData.info.campo2}</p>
    `);
}

// En formatItemInfo() agregar case:
case "nuevo_tipo":
    this.formatNuevoTipo(itemData);
    break;
```

### Modificar Comportamiento de Drag

**Archivo**: `drag-drop.js`

```javascript
// Modificar en handleDragDrop() o swap()
// Ejemplo: prevenir drag de ciertos items
start: function(event, ui) {
    const itemData = $(this).data("item");
    if (itemData.name === "item_bloqueado") {
        return false; // Cancela el drag
    }
    // ... resto del código
}
```

### Agregar Nuevo Event Handler

**Archivo**: `event-handlers.js`

```javascript
// En EventHandlers object
setupMiNuevoEvento() {
    $(document).on('click', '.mi-elemento', function(e) {
        e.preventDefault();
        // Tu lógica aquí
    });
}

// En init() agregar:
init() {
    this.setupItemSlotEvents();
    this.setupMiNuevoEvento(); // <-- Agregar aquí
    // ...
}
```

### Modificar Renderizado de Items

**Archivo**: `ui-renderer.js`

```javascript
// Ejemplo: agregar clase CSS especial a items raros
renderItemSlot(item, slot, isHotbar = false) {
    const ItemLabel = this.renderItemLabel(item);
    const rareClass = item.rare ? 'item-rare' : '';
    // ... modificar el HTML con la nueva clase
}
```

## 📊 Performance

### Métricas Esperadas
- **Tiempo de carga**: < 100ms
- **Tiempo de apertura**: < 50ms
- **Drag response**: < 16ms (60fps)
- **Memoria**: Similar al original

### Optimización
El código ya está optimizado, pero si necesitas más:

1. **Cachear selectores jQuery**:
```javascript
// En lugar de:
$(".item-slot").each(...)

// Hacer:
const $slots = $(".item-slot");
$slots.each(...)
```

2. **Debounce eventos frecuentes**:
```javascript
// Para mouseenter/mouseleave muy frecuentes
let hoverTimeout;
$(document).on('mouseenter', '.item-slot', function() {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
        // Lógica del hover
    }, 50);
});
```

## 🔄 Rollback (Si es necesario)

Si por alguna razón necesitas volver al código original:

1. Tener backup del `app.js` original (2134 líneas)
2. Eliminar todos los módulos nuevos
3. Restaurar `fxmanifest.lua` original
4. Restaurar `ui.html` original
5. Reiniciar recurso

## 📞 Soporte

Para modificaciones o problemas:
1. Revisar console F8 para errores
2. Verificar orden de carga de módulos
3. Consultar documentación en README-ESTRUCTURA.md
4. Revisar REFACTORIZACION-COMPLETADA.md

## ✨ Mejoras Futuras Sugeridas

- [ ] Agregar JSDoc a todas las funciones
- [ ] Implementar tests unitarios
- [ ] Optimizar consultas jQuery repetitivas
- [ ] Considerar lazy loading de módulos
- [ ] Agregar sistema de logging estructurado
- [ ] Implementar sistema de theming modular

---

**¡El inventario está listo para usar!** 🎉

