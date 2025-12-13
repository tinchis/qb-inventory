const DragDropManager = {
    handleDragDrop() {
        const inUse = {
            use: false,
            give: false
        };

        $(".item-drag").draggable({
            helper: function () {
                const clone = $(this).clone();
                clone.css({
                    'width': '80px',
                    'height': '80px',
                    'min-height': '80px'
                });
                return clone;
            },
            appendTo: "body",
            scroll: false,
            revertDuration: 500,
            revert: "invalid",
            cancel: ".item-nodrag",
            start: function (event, ui) {
                InventoryState.isDragging = true;
                $(this).find("img").css("filter", "brightness(50%)");
                $('.ply-iteminfo-container').fadeOut(100);

                const itemData = $(this).data("item");
                const dragAmount = $("#item-amount").val();

                if (!itemData.useable) {
                    $("#item-use").css("background", "rgba(255,255,255, 0.7");
                }

                if (dragAmount == 0) {
                    if (itemData.price != null) {
                        $(".ui-draggable-dragging").find(".item-slot-amount p").html('(' + itemData.amount + ') $' + itemData.price);
                        $(".ui-draggable-dragging").find(".item-slot-key").remove();
                    } else {
                        $(".ui-draggable-dragging").find(".item-slot-key").remove();
                    }
                } else if (dragAmount > itemData.amount) {
                    if (itemData.price != null) {
                        $(this).find(".item-slot-amount p").html('(' + itemData.amount + ') $' + itemData.price);
                    }
                    InventoryUtils.inventoryError($(this).parent(), $(this).attr("data-slot"));
                } else if (dragAmount < 0) {
                    $(".ui-draggable-dragging").find(".item-slot-key").remove();
                    InventoryUtils.inventoryError($(this).parent(), $(this).attr("data-slot"));
                }
            },
            stop: function (event, ui) {
                setTimeout(function () {
                    InventoryState.isDragging = false;
                }, 300);
                $(this).find("img").css("filter", "brightness(100%)");
                $("#item-use").css("background", "rgba(" + InventoryState.option + ")");
            },
        });

        $(".item-drag-money").draggable({
            helper: function () {
                const clone = $(this).clone();
                clone.css({
                    'width': '80px',
                    'height': '80px',
                    'min-height': '80px'
                });
                return clone;
            },
            appendTo: "body",
            scroll: false,
            revertDuration: 500,
            revert: "invalid",
            cancel: ".item-nodrag",
            start: function (event, ui) {
                InventoryState.isDragging = true;
                $(this).find("img").css("filter", "brightness(50%)");
                $(".item-slot").css("border", "1px solid rgba(255, 255, 255, 0.1)");
            },
            stop: function (event, ui) {
                setTimeout(function () {
                    InventoryState.isDragging = false;
                }, 300);
                $(this).css("background", "rgba(0, 0, 0)");
                $(this).find("img").css("filter", "brightness(100%)");
                $("#item-use").css("background", "rgba(" + InventoryState.option + ")");
            },
        });

        $(".item-slot").droppable({
            hoverClass: 'item-slot-hoverClass',
            drop: function (event, ui) {
                setTimeout(function () {
                    InventoryState.isDragging = false;
                }, 300);

                const fromSlot = ui.draggable.attr("data-slot");
                const fromInventory = ui.draggable.parent();
                const toSlot = $(this).attr("data-slot");
                const toInventory = $(this).parent();
                const toAmount = $("#item-amount").val();

                if (fromSlot == toSlot && fromInventory.is(toInventory)) {
                    return;
                }

                if (fromSlot == InventoryState.slots) {
                    return;
                }

                if (toAmount >= 0) {
                    if (InventoryUtils.updateWeights(fromSlot, toSlot, fromInventory, toInventory, toAmount)) {
                        DragDropManager.swap(fromSlot, toSlot, fromInventory, toInventory, toAmount);
                    }
                }
            },
        });

        $("#item-use").droppable({
            hoverClass: 'button-hover',
            drop: function (event, ui) {
                inUse['use'] = true;
                setTimeout(function () {
                    InventoryState.isDragging = false;
                    inUse['use'] = false;
                }, 300);

                const fromData = ui.draggable.data("item");
                const fromInventory = ui.draggable.parent().attr("data-inventory");

                if (fromData.useable) {
                    if (fromData.shouldClose) {
                        InventoryCore.close();
                    }
                    $.post("https://qb-inventory/UseItem", JSON.stringify({
                        inventory: fromInventory,
                        item: fromData,
                    }));
                }
            }
        });

        $("#item-give").droppable({
            hoverClass: 'button-hover',
            drop: function (event, ui) {
                setTimeout(function () {
                    InventoryState.isDragging = false;
                    inUse['drag'] = false;
                }, 300);

                const fromData = ui.draggable.data("item");
                const fromInventory = ui.draggable.parent().attr("data-inventory");

                $.post("https://qb-inventory/GiveItem", JSON.stringify({
                    inventory: fromInventory,
                    item: fromData,
                    count: $("#item-amount").val()
                }));
            }
        });

        $("#item-drop").droppable({
            hoverClass: 'item-slot-hoverClass',
            drop: function (event, ui) {
                setTimeout(function () {
                    InventoryState.isDragging = false;
                }, 300);

                const fromData = ui.draggable.data("item");
                const fromInventory = ui.draggable.parent().attr("data-inventory");
                let amount = $("#item-amount").val();

                if (amount == 0) {
                    amount = fromData.amount;
                }

                $(this).css("background", "rgba(35,35,35, 0.7");

                $.post("https://qb-inventory/DropItem", JSON.stringify({
                    inventory: fromInventory,
                    item: fromData,
                    amount: parseInt(amount),
                }));
            }
        });
    },

    swap($fromSlot, $toSlot, $fromInv, $toInv, $toAmount) {
        const fromData = $fromInv.find("[data-slot=" + $fromSlot + "]").data("item");
        const toData = $toInv.find("[data-slot=" + $toSlot + "]").data("item");
        const otherinventory = InventoryState.otherLabel.toLowerCase();

        if (otherinventory.split("-")[0] == "dropped") {
            if (toData !== null && toData !== undefined) {
                InventoryUtils.inventoryError($fromInv, $fromSlot);
                return;
            }
        }

        if (fromData !== undefined && fromData.amount >= $toAmount) {
            if (($fromInv.attr("data-inventory") == "player" || $fromInv.attr("data-inventory") == "hotbar") &&
                $toInv.attr("data-inventory").split("-")[0] == "itemshop" &&
                $toInv.attr("data-inventory") == "crafting") {
                InventoryUtils.inventoryError($toInv, $toSlot);
                return;
            }

            if ($toAmount == 0 &&
                $fromInv.attr("data-inventory").split("-")[0] == "itemshop" &&
                $fromInv.attr("data-inventory") == "crafting") {
                InventoryUtils.inventoryError($fromInv, $fromSlot);
                return;
            } else if ($toAmount == 0) {
                $toAmount = fromData.amount;
            }

            if ((toData != undefined || toData != null) && toData.name == fromData.name && !fromData.unique) {
                this.stackItems($fromSlot, $toSlot, $fromInv, $toInv, $toAmount, fromData, toData);
            } else {
                this.moveItems($fromSlot, $toSlot, $fromInv, $toInv, $toAmount, fromData, toData);
            }
        }

        DragDropManager.handleDragDrop();
    },

    stackItems($fromSlot, $toSlot, $fromInv, $toInv, $toAmount, fromData, toData) {
        const newData = {
            name: toData.name,
            label: toData.label,
            amount: (parseInt($toAmount) + parseInt(toData.amount)),
            type: toData.type,
            description: toData.description,
            image: toData.image,
            weight: toData.weight,
            info: toData.info,
            useable: toData.useable,
            unique: toData.unique,
            slot: parseInt($toSlot)
        };

        $toInv.find("[data-slot=" + $toSlot + "]").data("item", newData);
        $toInv.find("[data-slot=" + $toSlot + "]").addClass("item-drag");
        $toInv.find("[data-slot=" + $toSlot + "]").removeClass("item-nodrag");
        $toInv.find("[data-slot=" + $toSlot + "]").html(UIRenderer.renderItemSlot(newData, $toSlot));
        UIRenderer.updateQualityBar(newData, $toInv.find("[data-slot=" + $toSlot + "]"));

        if (fromData.amount == $toAmount) {
            $fromInv.find("[data-slot=" + $fromSlot + "]").removeClass("item-drag");
            $fromInv.find("[data-slot=" + $fromSlot + "]").addClass("item-nodrag");
            $fromInv.find("[data-slot=" + $fromSlot + "]").removeData("item");
            $fromInv.find("[data-slot=" + $fromSlot + "]").html('<div class="item-slot-img"></div><div class="item-slot-label"><p>&nbsp;</p></div>');
        } else if (fromData.amount > $toAmount) {
            const newDataFrom = {
                ...fromData,
                amount: parseInt((fromData.amount - $toAmount)),
                slot: parseInt($fromSlot)
            };

            $fromInv.find("[data-slot=" + $fromSlot + "]").data("item", newDataFrom);
            $fromInv.find("[data-slot=" + $fromSlot + "]").addClass("item-drag");
            $fromInv.find("[data-slot=" + $fromSlot + "]").removeClass("item-nodrag");

            if ($fromInv.attr("data-inventory").split("-")[0] == "itemshop") {
                $fromInv.find("[data-slot=" + $fromSlot + "]").html(UIRenderer.renderItemSlotWithPrice(newDataFrom));
            } else {
                $fromInv.find("[data-slot=" + $fromSlot + "]").html(UIRenderer.renderItemSlot(newDataFrom, $fromSlot));
                UIRenderer.updateQualityBar(newDataFrom, $fromInv.find("[data-slot=" + $fromSlot + "]"));
            }
        }

        $.post("https://qb-inventory/PlayDropSound", JSON.stringify({}));
        $.post("https://qb-inventory/SetInventoryData", JSON.stringify({
            fromInventory: $fromInv.attr("data-inventory"),
            toInventory: $toInv.attr("data-inventory"),
            fromSlot: $fromSlot,
            toSlot: $toSlot,
            fromAmount: $toAmount,
        }));
    },

    moveItems($fromSlot, $toSlot, $fromInv, $toInv, $toAmount, fromData, toData) {
        if (fromData.amount == $toAmount) {
            if (toData != undefined && toData.combinable != null && InventoryUtils.isItemAllowed(fromData.name, toData.combinable.accept)) {
                $.post('https://qb-inventory/getCombineItem', JSON.stringify({ item: toData.combinable.reward }), function (item) {
                    $('.combine-option-text').html("<p>Si combinas estos elementos, obtienes: <b>" + item.label + "</b></p>");
                });

                if ($("#weapon-attachments").css("display") == "block") {
                    $("#weapon-attachments").fadeOut(300, function () {
                        $(".combine-option-container").fadeIn(300);
                    });
                } else {
                    $(".combine-option-container").fadeIn(300);
                }

                InventoryState.combineslotData = {
                    fromData: fromData,
                    toData: toData,
                    fromSlot: $fromSlot,
                    toSlot: $toSlot,
                    fromInv: $fromInv,
                    toInv: $toInv,
                    toAmount: $toAmount
                };
                return;
            }

            fromData.slot = parseInt($toSlot);
            $toInv.find("[data-slot=" + $toSlot + "]").data("item", fromData);
            $toInv.find("[data-slot=" + $toSlot + "]").addClass("item-drag");
            $toInv.find("[data-slot=" + $toSlot + "]").removeClass("item-nodrag");
            $toInv.find("[data-slot=" + $toSlot + "]").html(UIRenderer.renderItemSlot(fromData, $toSlot));
            UIRenderer.updateQualityBar(fromData, $toInv.find("[data-slot=" + $toSlot + "]"));

            if (toData != undefined) {
                toData.slot = parseInt($fromSlot);
                $fromInv.find("[data-slot=" + $fromSlot + "]").addClass("item-drag");
                $fromInv.find("[data-slot=" + $fromSlot + "]").removeClass("item-nodrag");
                $fromInv.find("[data-slot=" + $fromSlot + "]").data("item", toData);
                $fromInv.find("[data-slot=" + $fromSlot + "]").html(UIRenderer.renderItemSlot(toData, $fromSlot));
                UIRenderer.updateQualityBar(toData, $fromInv.find("[data-slot=" + $fromSlot + "]"));

                $.post("https://qb-inventory/SetInventoryData", JSON.stringify({
                    fromInventory: $fromInv.attr("data-inventory"),
                    toInventory: $toInv.attr("data-inventory"),
                    fromSlot: $fromSlot,
                    toSlot: $toSlot,
                    fromAmount: $toAmount,
                    toAmount: toData.amount,
                }));
            } else {
                $fromInv.find("[data-slot=" + $fromSlot + "]").removeClass("item-drag");
                $fromInv.find("[data-slot=" + $fromSlot + "]").addClass("item-nodrag");
                $fromInv.find("[data-slot=" + $fromSlot + "]").removeData("item");

                if ($fromSlot < 6 && $fromInv.attr("data-inventory") == "player") {
                    $fromInv.find("[data-slot=" + $fromSlot + "]").html('<div class="item-slot-key"><p>' + $fromSlot + '</p></div><div class="item-slot-img"></div><div class="item-slot-label"><p>&nbsp;</p></div>');
                } else if ($fromSlot == 41 && $fromInv.attr("data-inventory") == "player") {
                    $fromInv.find("[data-slot=" + $fromSlot + "]").html('<div class="item-slot-key"><p>6 <i class="fas fa-lock"></i></p></div><div class="item-slot-img"></div><div class="item-slot-label"><p>&nbsp;</p></div>');
                } else {
                    $fromInv.find("[data-slot=" + $fromSlot + "]").html('<div class="item-slot-img"></div><div class="item-slot-label"><p>&nbsp;</p></div>');
                }

                $.post("https://qb-inventory/SetInventoryData", JSON.stringify({
                    fromInventory: $fromInv.attr("data-inventory"),
                    toInventory: $toInv.attr("data-inventory"),
                    fromSlot: $fromSlot,
                    toSlot: $toSlot,
                    fromAmount: $toAmount,
                }));
            }
            $.post("https://qb-inventory/PlayDropSound", JSON.stringify({}));
        } else if (fromData.amount > $toAmount && (toData == undefined || toData == null)) {
            const newDataTo = {
                ...fromData,
                amount: parseInt($toAmount),
                slot: parseInt($toSlot)
            };

            const newDataFrom = {
                ...fromData,
                amount: parseInt((fromData.amount - $toAmount)),
                slot: parseInt($fromSlot)
            };

            $toInv.find("[data-slot=" + $toSlot + "]").data("item", newDataTo);
            $toInv.find("[data-slot=" + $toSlot + "]").addClass("item-drag");
            $toInv.find("[data-slot=" + $toSlot + "]").removeClass("item-nodrag");
            $toInv.find("[data-slot=" + $toSlot + "]").html(UIRenderer.renderItemSlot(newDataTo, $toSlot));
            UIRenderer.updateQualityBar(newDataTo, $toInv.find("[data-slot=" + $toSlot + "]"));

            $fromInv.find("[data-slot=" + $fromSlot + "]").data("item", newDataFrom);
            $fromInv.find("[data-slot=" + $fromSlot + "]").addClass("item-drag");
            $fromInv.find("[data-slot=" + $fromSlot + "]").removeClass("item-nodrag");

            if ($fromInv.attr("data-inventory").split("-")[0] == "itemshop") {
                $fromInv.find("[data-slot=" + $fromSlot + "]").html(UIRenderer.renderItemSlotWithPrice(newDataFrom));
            } else {
                $fromInv.find("[data-slot=" + $fromSlot + "]").html(UIRenderer.renderItemSlot(newDataFrom, $fromSlot));
                UIRenderer.updateQualityBar(newDataFrom, $fromInv.find("[data-slot=" + $fromSlot + "]"));
            }

            $.post("https://qb-inventory/PlayDropSound", JSON.stringify({}));
            $.post("https://qb-inventory/SetInventoryData", JSON.stringify({
                fromInventory: $fromInv.attr("data-inventory"),
                toInventory: $toInv.attr("data-inventory"),
                fromSlot: $fromSlot,
                toSlot: $toSlot,
                fromAmount: $toAmount,
            }));
        } else {
            InventoryUtils.inventoryError($fromInv, $fromSlot);
        }
    },

    optionSwitch($fromSlot, $toSlot, $fromInv, $toInv, $toAmount, toData, fromData) {
        fromData.slot = parseInt($toSlot);
        $toInv.find("[data-slot=" + $toSlot + "]").data("item", fromData);
        $toInv.find("[data-slot=" + $toSlot + "]").addClass("item-drag");
        $toInv.find("[data-slot=" + $toSlot + "]").removeClass("item-nodrag");
        $toInv.find("[data-slot=" + $toSlot + "]").html(UIRenderer.renderItemSlot(fromData, $toSlot));

        toData.slot = parseInt($fromSlot);
        $fromInv.find("[data-slot=" + $fromSlot + "]").addClass("item-drag");
        $fromInv.find("[data-slot=" + $fromSlot + "]").removeClass("item-nodrag");
        $fromInv.find("[data-slot=" + $fromSlot + "]").data("item", toData);
        $fromInv.find("[data-slot=" + $fromSlot + "]").html(UIRenderer.renderItemSlot(toData, $fromSlot));

        $.post("https://qb-inventory/SetInventoryData", JSON.stringify({
            fromInventory: $fromInv.attr("data-inventory"),
            toInventory: $toInv.attr("data-inventory"),
            fromSlot: $fromSlot,
            toSlot: $toSlot,
            fromAmount: $toAmount,
            toAmount: toData.amount,
        }));
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DragDropManager;
}

