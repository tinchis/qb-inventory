const EventHandlers = {
    init() {
        this.setupItemSlotEvents();
        this.setupKeyboardEvents();
        this.setupWeaponEvents();
        this.setupCombineEvents();
        this.setupMenuEvents();
    },

    setupItemSlotEvents() {
        $(document).on("dblclick", ".item-slot", function (e) {
            const ItemData = $(this).data("item");
            const ItemInventory = $(this).parent().attr("data-inventory");
            if (ItemData) {
                InventoryCore.close();
                $.post("https://qb-inventory/UseItem", JSON.stringify({
                    inventory: ItemInventory,
                    item: ItemData,
                }));
            }
        });

        $(document).on('mouseenter', '.item-slot', function (e) {
            e.preventDefault();
            if ($(this).data('item') != null) {
                const top = $(this).offset().top + 'px';
                const left = $(this).offset().left - $(this).outerWidth() * 4 + 'px';

                $('.ply-iteminfo-container').fadeIn(0);
                $('.ply-iteminfo-container').css('top', top);
                $('.ply-iteminfo-container').css('left', 'calc(' + left + ' - 1vh)');

                ItemFormatter.formatItemInfo($(this).data('item'));
            }
        });

        $(document).on('mouseleave', '.item-slot, .item-money', function (e) {
            e.preventDefault();
            $('.ply-iteminfo-container').fadeOut(0);
        });

        $(document).on('click', '.item-slot', function () {
            if ($(".combine-option-container").css("display") == "block") {
                $(".combine-option-container").fadeOut(300);
            }
        });

        $(document).on("mousedown", ".item-slot", function (event) {
            if (event.which === 3) {
                const fromSlot = $(this).attr("data-slot");
                const fromInventory = $(this).parent();
                let toInventory, toSlot;

                if ($(fromInventory).attr('data-inventory') == "player") {
                    toInventory = $(".other-inventory");
                } else {
                    toInventory = $(".player-inventory");
                }

                toSlot = InventoryUtils.getFirstFreeSlot(toInventory, $(this));

                if ($(this).data('item') === undefined) {
                    return;
                }

                let toAmount = $(this).data("item").amount;
                if (toAmount > 1) {
                    toAmount = 1;
                }

                if (InventoryUtils.canQuickMove()) {
                    if (toSlot === null) {
                        InventoryUtils.inventoryError(fromInventory, fromSlot);
                        return;
                    }
                    if (fromSlot == toSlot && fromInventory.is(toInventory)) {
                        return;
                    }
                    if (toAmount >= 0) {
                        if (InventoryUtils.updateWeights(fromSlot, toSlot, fromInventory, toInventory, toAmount)) {
                            DragDropManager.swap(fromSlot, toSlot, fromInventory, toInventory, toAmount);
                        }
                    }
                } else {
                    InventoryUtils.inventoryError(fromInventory, fromSlot);
                }
            }
        });

        $(document).on("click", ".item-slot", function (e) {
            e.preventDefault();
            const ItemData = $(this).data("item");

            if (ItemData !== null && ItemData !== undefined) {
                if (ItemData.name !== undefined) {
                    if (ItemData.name.split("_")[0] == "weapon") {
                        if (!$("#weapon-attachments").length) {
                            $(".player-inv-info").append('<div class="inv-option-item" id="weapon-attachments"><p><i class="fa-solid fa-gun"></i>Accessories</p></div>');
                            $("#weapon-attachments").hide().fadeIn(300);
                            InventoryState.clickedItemData = ItemData;
                        } else if (InventoryState.clickedItemData == ItemData) {
                            $("#weapon-attachments").fadeOut(250, function () {
                                $("#weapon-attachments").remove();
                            });
                            InventoryState.clickedItemData = {};
                        } else {
                            InventoryState.clickedItemData = ItemData;
                        }
                    } else {
                        InventoryState.clickedItemData = {};
                        if ($("#weapon-attachments").length) {
                            $("#weapon-attachments").fadeOut(250, function () {
                                $("#weapon-attachments").remove();
                            });
                        }
                    }
                } else {
                    InventoryState.clickedItemData = {};
                    if ($("#weapon-attachments").length) {
                        $("#weapon-attachments").fadeOut(250, function () {
                            $("#weapon-attachments").remove();
                        });
                    }
                }
            } else {
                InventoryState.clickedItemData = {};
                if ($("#weapon-attachments").length) {
                    $("#weapon-attachments").fadeOut(250, function () {
                        $("#weapon-attachments").remove();
                    });
                }
            }
        });
    },

    setupKeyboardEvents() {
        $(document).on('keyup', function (event) {
            switch (event.keyCode) {
                case 112:
                case 27:
                case 9:
                    InventoryCore.close();
                    InventoryState.controlPressed = false;
                    break;
            }
        });
    },

    setupWeaponEvents() {
        $(document).on('click', '.weapon-attachments-back', function (e) {
            e.preventDefault();
            WeaponManager.closeAttachmentScreen();
        });

        $(document).on('click', '#weapon-attachments', function (e) {
            e.preventDefault();
            WeaponManager.openAttachmentScreen();
        });
    },

    setupCombineEvents() {
        $(document).on('click', '.CombineItem', function (e) {
            e.preventDefault();
            const data = InventoryState.combineslotData;
            if (data.toData.combinable.anim != null) {
                $.post('https://qb-inventory/combineWithAnim', JSON.stringify({
                    combineData: data.toData.combinable,
                    usedItem: data.toData.name,
                    requiredItem: data.fromData.name
                }));
            } else {
                $.post('https://qb-inventory/combineItem', JSON.stringify({
                    reward: data.toData.combinable.reward,
                    toItem: data.toData.name,
                    fromItem: data.fromData.name
                }));
            }
            InventoryCore.close();
        });

        $(document).on('click', '.SwitchItem', function (e) {
            e.preventDefault();
            $(".combine-option-container").hide();
            const data = InventoryState.combineslotData;
            DragDropManager.optionSwitch(data.fromSlot, data.toSlot, data.fromInv, data.toInv, data.toAmount, data.toData, data.fromData);
        });
    },

    setupMenuEvents() {
        $(document).on('click', '#rob-money', function (e) {
            e.preventDefault();
            const TargetId = $(this).data('TargetId');
            $.post('https://qb-inventory/RobMoney', JSON.stringify({
                TargetId: TargetId
            }));
            $("#rob-money").remove();
        });
    },

    buttonsMenuEvents() {
        $(".lateral-menu .boton").off("click").on("click", function () {
            const action = $(this).attr("action");
            const event = $(this).attr("event");
            $.post('https://qb-inventory/inventory_options', JSON.stringify({
                event: event,
                action: action
            }));
        });
    },

    buttonsMenuEventsarriba() {
        $(".menu-superior .boton").off("click").on("click", function () {
            const action = $(this).attr("action");
            $.post('https://qb-inventory/drogas', JSON.stringify({
                action: action
            }));
        });
    }
};

const MenuActions = {
    dardinero() {
        $.post('https://qb-inventory/dardinero', JSON.stringify());
    },

    ropamenuopen() {
        $.post('https://qb-inventory/ropamenuopen', JSON.stringify());
    },

    carmenuopen() {
        $.post('https://qb-inventory/carmenuopen', JSON.stringify());
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EventHandlers, MenuActions };
}

