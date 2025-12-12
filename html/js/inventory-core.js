const InventoryCore = {
    slots: 40,
    dropslots: 30,
    droplabel: "Otro inventario",
    dropmaxweight: 100000,

    open(data) {
        InventoryState.slots = data.slots;
        EventHandlers.buttonsMenuEvents();
        EventHandlers.buttonsMenuEventsarriba();
        InventoryState.totalWeight = 0;
        InventoryState.totalWeightOther = 0;

        $("#nearPlayers").html("");
        $("#item-amount").val("1");
        $(".player-inventory").find(".item-slot").remove();
        $(".player-inventory").find(".item-money").remove();
        $(".ply-hotbar-inventory").find(".item-slot").remove();

        if (InventoryState.requiredItemOpen) {
            $(".requiredItem-container").hide();
            InventoryState.requiredItemOpen = false;
        }

        if (typeof DEBUG_MODE === 'undefined' || !DEBUG_MODE) {
            $("#game-view").show();
        }

        $("#qb-inventory1").removeClass("slide-right").fadeIn(300);

        if (data.other != null && data.other != "") {
            $(".other-inventory").attr("data-inventory", data.other.name);
        } else {
            $(".other-inventory").attr("data-inventory", 0);
        }

        const firstSlots = $(".player-inventory-first");
        for (let i = 1; i < 7; i++) {
            firstSlots.append(
                '<div class="item-slot relative aspect-square w-full h-full bg-[#101010] border border-[#242424] rounded-md  cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[80px] hover:border-[#0C5952] hover:bg-[#161616] hover:-translate-y-0.5" data-slot="' + i + '">' +
                '<div class="item-slot-key"><p>' + i + '</p></div>' +
                '<div class="item-slot-img"></div>' +
                '<div class="item-slot-label"><p>&nbsp;</p></div>' +
                '</div>'
            );
        }
        $(".player-inventory").append(firstSlots);

        for (let i = 7; i < data.slots - 1; i++) {
            $(".player-inventory").append(
                '<div class="item-slot relative aspect-square w-full h-full bg-[hsl(240_3.7%_15.9%)] border border-[hsl(240_3.7%_20%)] rounded-md cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[80px] hover:border-[#0C5952] hover:bg-[#161616] hover:-translate-y-0.5" data-slot="' + i + '">' +
                '<div class="item-slot-img"></div>' +
                '<div class="item-slot-label"><p>&nbsp;</p></div>' +
                '</div>'
            );
        }

        if (data.other != null && data.other != "") {
            $(".other-inv-container-wrapper").show();
            $("#item-use").hide();
            $(".ply-iteminfo-container").removeClass("inv-normal");

            for (let i = 1; i < (data.other.slots + 1); i++) {
                $(".other-inventory").append(
                    '<div class="item-slot relative aspect-square w-full h-full bg-[hsl(240_3.7%_15.9%)] border border-[hsl(240_3.7%_20%)] rounded-md cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[80px] hover:border-[#0C5952] hover:bg-[#161616] hover:-translate-y-0.5" data-slot="' + i + '">' +
                    '<div class="item-slot-img"></div>' +
                    '<div class="item-slot-label"><p>&nbsp;</p></div>' +
                    '</div>'
                );
            }
        } else {
            $(".other-inv-container-wrapper").hide();
            $("#item-use").show();

            for (let i = 1; i < (this.dropslots + 1); i++) {
                $(".other-inventory").append(
                    '<div class="item-slot relative aspect-square w-full h-full bg-black border border-[hsl(240_3.7%_20%)] rounded-md cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[80px] hover:border-[#0C5952] hover:bg-[#161616] hover:-translate-y-0.5" data-slot="' + i + '">' +
                    '<div class="item-slot-img"></div>' +
                    '<div class="item-slot-label"><p>&nbsp;</p></div>' +
                    '</div>'
                );
            }
        }

        let totalItems = 0;
        if (data.inventory !== null) {
            $.each(data.inventory, function (i, item) {
                if (item != null) {
                    InventoryState.totalWeight += (item.weight * item.amount);
                    totalItems += item.amount;
                    const slotHtml = UIRenderer.renderItemSlot(item, item.slot);

                    if (item.slot < 7) {
                        $(".player-inventory").find("[data-slot=" + item.slot + "]").addClass("item-drag");
                        $(".player-inventory").find("[data-slot=" + item.slot + "]").html(slotHtml);
                        $(".player-inventory").find("[data-slot=" + item.slot + "]").data("item", item);
                    } else if (item.slot == 41) {
                        $(".player-inventory").find("[data-slot=" + item.slot + "]").addClass("item-drag");
                        $(".player-inventory").find("[data-slot=" + item.slot + "]").html(slotHtml);
                        $(".player-inventory").find("[data-slot=" + item.slot + "]").data("item", item);
                    } else {
                        if (item.slot != data.slots) {
                            $(".player-inventory").find("[data-slot=" + item.slot + "]").addClass("item-drag");
                            $(".player-inventory").find("[data-slot=" + item.slot + "]").html(slotHtml);
                            $(".player-inventory").find("[data-slot=" + item.slot + "]").data("item", item);
                        } else {
                            $(".player-inventory").find("[data-slot=" + item.slot + "]").addClass("item-drag-money");
                            $(".player-inventory").find("[data-slot=" + item.slot + "]").html(slotHtml);
                            $(".player-inventory").find("[data-slot=" + item.slot + "]").data("item", item);
                        }
                    }

                    UIRenderer.updateQualityBar(item, $(".player-inventory").find("[data-slot=" + item.slot + "]"));
                }
            });
        }

        if ((data.other != null && data.other != "") && data.other.inventory != null) {
            $.each(data.other.inventory, function (i, item) {
                if (item != null) {
                    InventoryState.totalWeightOther += (item.weight * item.amount);
                    $(".other-inventory").find("[data-slot=" + item.slot + "]").addClass("item-drag");

                    if (item.price != null) {
                        $(".other-inventory").find("[data-slot=" + item.slot + "]").html(UIRenderer.renderItemSlotWithPrice(item));
                    } else {
                        $(".other-inventory").find("[data-slot=" + item.slot + "]").html(UIRenderer.renderItemSlot(item, item.slot));
                    }

                    $(".other-inventory").find("[data-slot=" + item.slot + "]").data("item", item);
                    UIRenderer.updateQualityBar(item, $(".other-inventory").find("[data-slot=" + item.slot + "]"));
                }
            });
        }

        const percent = ((InventoryState.totalWeight / 1000).toFixed(2) / (data.maxweight / 1000).toFixed(2)) * 100;
        $("#enUsoPersonal").css("width", percent + "%");

        const maxItems = data.slots || 30;
        const itemPercent = (totalItems / maxItems) * 100;
        $("#inventory-capacity-bar").css("width", itemPercent + "%");
        $("#inventory-capacity-text").html(totalItems + "/" + maxItems);

        InventoryState.playerMaxWeight = data.maxweight;

        if (data.other != null) {
            const name = data.other.name.toString();
            if (name != null && (name.split("-")[0] == "itemshop" || name == "crafting")) {
                $("#other-inv-label").html(data.other.label);
            } else {
                $("#other-inv-label").html(data.other.label);
                $("#other-inv-weight").html("Weight: " + (InventoryState.totalWeightOther / 1000).toFixed(2) + " / " + (data.other.maxweight / 1000).toFixed(2));
            }
            InventoryState.otherMaxWeight = data.other.maxweight;
            InventoryState.otherLabel = data.other.label;
        } else {
            $("#other-inv-label").html(this.droplabel);
            $("#other-inv-weight").html("Weight: " + (InventoryState.totalWeightOther / 1000).toFixed(2) + " / " + (this.dropmaxweight / 1000).toFixed(2));
            InventoryState.otherMaxWeight = this.dropmaxweight;
            InventoryState.otherLabel = this.droplabel;
        }

        $.each(data.maxammo, function (index, ammotype) {
            $("#" + index + "_ammo").find('.ammo-box-amount').css({ "height": "0%" });
        });

        if (data.Ammo !== null) {
            $.each(data.Ammo, function (i, amount) {
                const Handler = i.split("_");
                const Type = Handler[1].toLowerCase();
                if (amount > data.maxammo[Type]) {
                    amount = data.maxammo[Type];
                }
                const Percentage = (amount / data.maxammo[Type] * 100);
                $("#" + Type + "_ammo").find('.ammo-box-amount').css({ "height": Percentage + "%" });
                $("#" + Type + "_ammo").find('span').html(amount + "x");
            });
        }

        DragDropManager.handleDragDrop();
    },

    close() {
        $(".item-slot").css("border", "1px solid rgba(255, 255, 255, 0.1)");
        $(".ply-hotbar-inventory").css("display", "block");
        $(".ply-iteminfo-container").css("display", "none");

        if (typeof DEBUG_MODE === 'undefined' || !DEBUG_MODE) {
            $("#game-view").hide();
        }

        $("#qb-inventory1").addClass("slide-right");
        $("#qb-inventory1").addClass("slide-right").fadeOut(300, function () {
            $(".item-slot").remove();
            $(".item-money").remove();
        });

        $(".combine-option-container").hide();

        if ($("#rob-money").length) {
            $("#rob-money").remove();
        }

        $.post("https://qb-inventory/CloseInventory", JSON.stringify({}));

        if (InventoryState.attachmentScreenActive) {
            $("#qb-inventory1").css({ "display": "none", "left": "13vw" });
            $(".weapon-attachments-container").css({ "display": "none" });
            InventoryState.attachmentScreenActive = false;
        }

        if (InventoryState.clickedItemData !== null) {
            $("#weapon-attachments").fadeOut(250, function () {
                $("#weapon-attachments").remove();
                InventoryState.clickedItemData = {};
            });
        }

        $('.ply-iteminfo-container').css('display', 'none');
    },

    update(data) {
        InventoryState.totalWeight = 0;
        InventoryState.totalWeightOther = 0;
        $(".player-inventory").find(".item-slot").remove();
        $(".player-inventory-first").find(".item-slot").remove();
        $(".ply-hotbar-inventory").find(".item-slot").remove();

        if (data.error) {
            $.post("https://qb-inventory/PlayDropFail", JSON.stringify({}));
        }

        const firstSlots = $(".player-inventory-first");
        for (let i = 1; i < 7; i++) {
            firstSlots.append(
                '<div class="item-slot" data-slot="' + i + '">' +
                '<div class="item-slot-key"><p>' + i + '</p></div>' +
                '<div class="item-slot-img"></div>' +
                '<div class="item-slot-label"><p>&nbsp;</p></div>' +
                '</div>'
            );
        }
        $(".player-inventory").append(firstSlots);

        for (let i = 1; i < (data.slots + 1); i++) {
            if (i == 41) {
                $(".player-inventory").append(
                    '<div class="item-slot" data-slot="' + i + '">' +
                    '<div class="item-slot-key"><p>6 <i class="fas fa-lock"></i></p></div>' +
                    '<div class="item-slot-img"></div>' +
                    '<div class="item-slot-label"><p>&nbsp;</p></div>' +
                    '</div>'
                );
            } else {
                if (data.slots < data.slots) {
                    $(".player-inventory").append(
                        '<div class="item-slot" data-slot="' + i + '">' +
                        '<div class="item-slot-img"></div>' +
                        '<div class="item-slot-label"><p>&nbsp;</p></div>' +
                        '</div>'
                    );
                }
            }
        }

        $.each(data.inventory, function (i, item) {
            if (item != null) {
                InventoryState.totalWeight += (item.weight * item.amount);
                const slotHtml = UIRenderer.renderItemSlot(item, item.slot);

                if (item.slot < 7) {
                    $(".player-inventory").find("[data-slot=" + item.slot + "]").addClass("item-drag");
                    $(".player-inventory").find("[data-slot=" + item.slot + "]").html(slotHtml);
                    $(".player-inventory").find("[data-slot=" + item.slot + "]").data("item", item);
                } else if (item.slot == 41) {
                    $(".player-inventory").find("[data-slot=" + item.slot + "]").addClass("item-drag");
                    $(".player-inventory").find("[data-slot=" + item.slot + "]").html(slotHtml);
                    $(".player-inventory").find("[data-slot=" + item.slot + "]").data("item", item);
                } else {
                    $(".player-inventory").find("[data-slot=" + item.slot + "]").addClass("item-drag");
                    $(".player-inventory").find("[data-slot=" + item.slot + "]").html(slotHtml);
                    $(".player-inventory").find("[data-slot=" + item.slot + "]").data("item", item);
                }
            }
        });

        $("#player-inv-weight").html("Weight: " + (InventoryState.totalWeight / 1000).toFixed(2) + " / " + (data.maxweight / 1000).toFixed(2));

        DragDropManager.handleDragDrop();
    },

    toggleHotbar(data) {
        if (data.open) {
            $(".z-hotbar-inventory").html("");
            for (let i = 1; i < 7; i++) {
                const elem = '<div class="z-hotbar-item-slot" data-zhotbarslot="' + i + '"> <div class="z-hotbar-item-slot-key"><p>' + i + '</p></div><div class="z-hotbar-item-slot-img"></div><div class="z-hotbar-item-slot-label"><p>&nbsp;</p></div></div>';
                $(".z-hotbar-inventory").append(elem);
            }

            $.each(data.items, function (i, item) {
                if (item != null) {
                    const ItemLabel = UIRenderer.renderItemLabel(item);
                    if (item.slot == 41) {
                        return;
                    }
                    $(".z-hotbar-inventory").find("[data-zhotbarslot=" + item.slot + "]").html(
                        '<div class="z-hotbar-item-slot-key"><p>' + item.slot + '</p></div>' +
                        '<div class="z-hotbar-item-slot-img"><img src="images/' + item.image + '" alt="' + item.name + '" /></div>' +
                        '<div class="z-hotbar-item-slot-amount"><p>' + item.amount + '</p></div>' +
                        ItemLabel
                    );

                    UIRenderer.updateQualityBar(item, $(".z-hotbar-inventory").find("[data-zhotbarslot=" + item.slot + "]"));
                }
            });

            $(".z-hotbar-inventory").fadeIn(300);
        } else {
            $(".z-hotbar-inventory").addClass("slide-down").fadeOut(300, function () {
                $(".z-hotbar-inventory").html("");
                $(this).removeClass("slide-down");
            });
        }
    },

    useItem(data) {
        $(".itembox-container").hide();
        $(".itembox-container").fadeIn(250);
        $("#itembox-action").html("<p>Used</p>");
        $("#itembox-label").html("<p>" + data.item.label + "</p>");
        $("#itembox-image").html('<div class="item-slot-img"><img src="images/' + data.item.image + '" alt="' + data.item.name + '" /></div>');
        setTimeout(function () {
            $(".itembox-container").fadeOut(250);
        }, 2000);
    },

    itemBox(data) {
        let type = "Used";
        if (data.type == "add") {
            type = "Received";
        } else if (data.type == "remove") {
            type = "Removed";
        }

        const $itembox = $(".itembox-container.template").clone();
        $itembox.removeClass('template');
        $itembox.html(
            '<div id="itembox-action"><p>' + type + '</p></div>' +
            '<div id="itembox-label"><p>' + data.item.label + '</p></div>' +
            '<div class="item-slot-img"><img src="images/' + data.item.image + '" alt="' + data.item.name + '" /></div>'
        );

        $(".itemboxes-container").prepend($itembox);
        $itembox.fadeIn(250);

        setTimeout(function () {
            $.when($itembox.fadeOut(300)).done(function () {
                $itembox.remove();
            });
        }, 3000);
    },

    requiredItem(data) {
        if (data.toggle) {
            if (!InventoryState.requiredItemOpen) {
                $(".requiredItem-container").html("");
                $.each(data.items, function (index, item) {
                    const element = '<div class="requiredItem-box"><div id="requiredItem-action">Requerido</div><div id="requiredItem-label"><p>' + item.label + '</p></div><div id="requiredItem-image"><div class="item-slot-img"><img src="images/' + item.image + '" alt="' + item.name + '" /></div></div></div>';
                    $(".requiredItem-container").hide();
                    $(".requiredItem-container").append(element);
                    $(".requiredItem-container").fadeIn(100);
                });
                InventoryState.requiredItemOpen = true;
            }
        } else {
            $(".requiredItem-container").fadeOut(100);
            setTimeout(function () {
                $(".requiredItem-container").html("");
                InventoryState.requiredItemOpen = false;
            }, 100);
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventoryCore;
}

