window.onload = function (e) {
    EventHandlers.init();

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
