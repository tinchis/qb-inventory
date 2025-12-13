window.onload = function (e) {
    EventHandlers.init();

    if (typeof DEBUG_MODE !== 'undefined' && DEBUG_MODE) {
        console.log('[DEBUG MODE] Inventario en modo debug - abre el HTML directamente en el navegador');
        setTimeout(() => {
            const randomItems = {
                1: { name: 'water', amount: 15, info: [], label: 'Agua', description: 'Agua mineral embotellada', weight: 500, type: 'item', unique: false, useable: true, image: 'water.png', slot: 1 },
                2: { name: 'bread', amount: 8, info: [], label: 'Pan', description: 'Pan fresco del día', weight: 200, type: 'item', unique: false, useable: true, image: 'bread.png', slot: 2 },
                5: { name: 'phone', amount: 1, info: [], label: 'Teléfono', description: 'Smartphone con GPS', weight: 300, type: 'item', unique: true, useable: true, image: 'phone.png', slot: 5 },
                7: { name: 'lockpick', amount: 3, info: [], label: 'Ganzúa', description: 'Herramienta para forzar cerraduras', weight: 150, type: 'item', unique: false, useable: true, image: 'lockpick.png', slot: 7 },
                10: { name: 'weapon_pistol', amount: 1, info: { ammo: 12, serie: 'ABC123XYZ', quality: 85 }, label: 'Pistola', description: 'Pistola calibre 9mm', weight: 1500, type: 'weapon', unique: true, useable: false, image: 'weapon_pistol.png', slot: 10 },
                12: { name: 'pistol_ammo', amount: 45, info: [], label: 'Munición 9mm', description: 'Balas para pistola', weight: 50, type: 'item', unique: false, useable: true, image: 'pistol_ammo.png', slot: 12 },
                15: { name: 'bandage', amount: 7, info: [], label: 'Vendaje', description: 'Vendaje médico', weight: 100, type: 'item', unique: false, useable: true, image: 'bandage.png', slot: 15 },
                18: { name: 'sandwich', amount: 4, info: [], label: 'Sandwich', description: 'Sandwich de jamón y queso', weight: 250, type: 'item', unique: false, useable: true, image: 'sandwich.png', slot: 18 },
                20: { name: 'radio', amount: 1, info: [], label: 'Radio', description: 'Radio portátil', weight: 400, type: 'item', unique: false, useable: true, image: 'radio.png', slot: 20 },
                23: { name: 'armor', amount: 1, info: { quality: 95 }, label: 'Chaleco', description: 'Chaleco antibalas', weight: 3000, type: 'item', unique: false, useable: true, image: 'armor.png', slot: 23 },
                25: { name: 'id_card', amount: 1, info: { firstname: 'John', lastname: 'Doe', birthdate: '1990-05-15', gender: 'M', nationality: 'USA' }, label: 'DNI', description: 'Documento de identidad', weight: 50, type: 'item', unique: true, useable: true, image: 'id_card.png', slot: 25 },
                28: { name: 'repairkit', amount: 2, info: [], label: 'Kit Reparación', description: 'Kit para reparar vehículos', weight: 2500, type: 'item', unique: false, useable: true, image: 'repairkit.png', slot: 28 },
                30: { name: 'cigarette', amount: 20, info: [], label: 'Cigarrillo', description: 'Cigarrillo marca Lucky Strike', weight: 10, type: 'item', unique: false, useable: true, image: 'cigarette.png', slot: 30 },
                35: { name: 'advancedlockpick', amount: 1, info: [], label: 'Ganzúa Avanzada', description: 'Ganzúa electrónica', weight: 300, type: 'item', unique: false, useable: true, image: 'advancedlockpick.png', slot: 35 },
                40: { name: 'weapon_knife', amount: 1, info: { serie: 'KNF789', quality: 100 }, label: 'Cuchillo', description: 'Cuchillo de combate', weight: 500, type: 'weapon', unique: true, useable: false, image: 'weapon_knife.png', slot: 40 },
                42: { name: 'markedbills', amount: 1, info: { worth: 5000 }, label: 'Dinero Marcado', description: 'Billetes marcados por la policía', weight: 1000, type: 'item', unique: true, useable: false, image: 'markedbills.png', slot: 42 }
            };

            const otherItems = {
                1: { name: 'goldbar', amount: 3, info: [], label: 'Lingote de Oro', description: 'Lingote de oro puro', weight: 5000, type: 'item', unique: false, useable: false, image: 'goldbar.png', slot: 1 },
                5: { name: 'weapon_smg', amount: 1, info: { ammo: 30, serie: 'SMG456', quality: 75 }, label: 'SMG', description: 'Subfusil compacto', weight: 2500, type: 'weapon', unique: true, useable: false, image: 'weapon_smg.png', slot: 5 },
                8: { name: 'laptop', amount: 1, info: [], label: 'Portátil', description: 'Laptop para hackear', weight: 2000, type: 'item', unique: false, useable: true, image: 'laptop.png', slot: 8 },
                12: { name: 'diamond', amount: 8, info: [], label: 'Diamante', description: 'Diamante de alto valor', weight: 500, type: 'item', unique: false, useable: false, image: 'diamond.png', slot: 12 },
                15: { name: 'rolex', amount: 2, info: [], label: 'Rolex', description: 'Reloj de lujo', weight: 300, type: 'item', unique: false, useable: false, image: 'rolex.png', slot: 15 },
                20: { name: 'steel', amount: 50, info: [], label: 'Acero', description: 'Lingote de acero', weight: 100, type: 'item', unique: false, useable: false, image: 'steel.png', slot: 20 },
                25: { name: 'plastic', amount: 40, info: [], label: 'Plástico', description: 'Material plástico', weight: 50, type: 'item', unique: false, useable: false, image: 'plastic.png', slot: 25 },
                30: { name: 'rubber', amount: 35, info: [], label: 'Goma', description: 'Material de goma', weight: 80, type: 'item', unique: false, useable: false, image: 'rubber.png', slot: 30 }
            };

            const totalWeight = Object.values(randomItems).reduce((sum, item) => sum + (item.weight * item.amount), 0);

            window.postMessage({
                action: 'open',
                inventory: {
                    maxweight: 120000,
                    slots: 50
                },
                other: {
                    maxweight: 100000,
                    slots: 40,
                    name: 'Cofre del Garaje'
                },
                playeritems: randomItems,
                otheritems: otherItems,
                weight: totalWeight,
                maxweight: 120000
            }, '*');
        }, 500);
    }

    window.addEventListener('message', function (event) {
        switch (event.data.action) {
            case "open":
                InventoryCore.open(event.data);
                break;
            case "close":
                InventoryCore.close();
                break;
            case "update":
                InventoryCore.update(event.data);
                break;
            case "itemBox":
                InventoryCore.itemBox(event.data);
                break;
            case "requiredItem":
                InventoryCore.requiredItem(event.data);
                break;
            case "toggleHotbar":
                InventoryCore.toggleHotbar(event.data);
                break;
            case "nearPlayers":
                $("#nearPlayers").html("");
                $.each(event.data.players, function (index, player) {
                    $("#nearPlayers").append('<button class="nearbyPlayerButton" data-player="' + player.player + '">ID ' + player.player + "</button>");
                    if (index == event.data.players.length - 1) {
                        $("#nearPlayers").append('<button class="cerrar-players">Cancelar</button>');
                    }
                });

                $(".nearbyPlayerButton").click(function () {
                    $("#nearPlayers").html("");
                    const player = $(this).data("player");
                    let count = $("#item-amount").val();
                    if (count == 0) { count = event.data.item.amount; }
                    InventoryCore.close();
                    $.post("https://qb-inventory/GiveItem", JSON.stringify({
                        player: player,
                        inventory: event.data.inventory,
                        item: event.data.item,
                        amount: parseInt(count),
                        slot: event.data.slot,
                    }));
                });

                $(".cerrar-players").click(function () {
                    $("#nearPlayers").fadeOut(300, function () {
                        $(this).html("").show();
                    });
                });
                break;
            case "RobMoney":
                break;
            case "ocultarHotbar":
                $(".z-hotbar-inventory").addClass("slide-down").fadeOut(300, function () {
                    $(this).removeClass("slide-down");
                });
                break;
            case "SetCraftResult":
                $(".other-inventory").find("[data-slot=" + event.data.lastslot + "]").css("opacity", "1.0");
                $(".other-inventory").find("[data-slot=" + event.data.lastslot + "]").html(UIRenderer.renderItemSlot(event.data.fromData, event.data.lastslot));
                $(".other-inventory").find("[data-slot=" + event.data.lastslot + "]").data("item", event.data.fromData);
                $(".other-inventory").find("[data-slot=" + event.data.lastslot + "]").addClass("item-drag");
                $(".other-inventory").find("[data-slot=" + event.data.lastslot + "]").removeClass("item-nodrag");
                DragDropManager.handleDragDrop();
                break;
            case "ClearCraftResult":
                $(".other-inventory").find("[data-slot=" + event.data.lastslot + "]").css("opacity", "0.5");
                $(".other-inventory").find("[data-slot=" + event.data.lastslot + "]").html('<div class="item-slot-img"></div><div class="item-slot-label"><p>&nbsp;</p></div>');
                $(".other-inventory").find("[data-slot=" + event.data.lastslot + "]").removeData("item");
                $(".other-inventory").find("[data-slot=" + event.data.lastslot + "]").addClass("item-nodrag");
                $(".other-inventory").find("[data-slot=" + event.data.lastslot + "]").removeClass("item-drag");
                DragDropManager.handleDragDrop();
                break;
            case "UpdateCraftItems":
                $(".other-inventory").find("[data-slot=" + event.data.slot + "]").html(UIRenderer.renderItemSlot(event.data.fromData, event.data.slot));
                $(".other-inventory").find("[data-slot=" + event.data.slot + "]").data("item", event.data.fromData);
                DragDropManager.handleDragDrop();
                break;
            case "ClearCraftItems":
                $(".other-inventory").find("[data-slot=" + event.data.slot + "]").html('<div class="item-slot-img"></div><div class="item-slot-label"><p>&nbsp;</p></div>');
                $(".other-inventory").find("[data-slot=" + event.data.slot + "]").removeData("item");
                DragDropManager.handleDragDrop();
                break;
        }
    });
};

$(document).ready(function () {
    window.addEventListener('message', function (event) {
        switch (event.data.action) {
            case "close":
                InventoryCore.close();
                break;
        }
    });
});

function dardinero() {
    MenuActions.dardinero();
}

function ropamenuopen() {
    MenuActions.ropamenuopen();
}

function carmenuopen() {
    MenuActions.carmenuopen();
}
