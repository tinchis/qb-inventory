const InventoryUtils = {
    getFirstFreeSlot($toInv, $fromSlot) {
        let retval = null;
        $.each($toInv.find('.item-slot'), function (i, slot) {
            if ($(slot).data('item') === undefined) {
                if (retval === null && !($toInv.attr('data-inventory') == 'player' && i + 1 <= 5)) {
                    retval = i + 1;
                }
            }
        });
        return retval;
    },

    canQuickMove() {
        const otherinventory = InventoryState.otherLabel.toLowerCase();
        let retval = true;
        if (otherinventory.split('-')[0] == 'player') {
            retval = false;
        }
        return retval;
    },

    isItemAllowed(item, allowedItems) {
        let retval = false;
        $.each(allowedItems, function (index, i) {
            if (i == item) {
                retval = true;
            }
        });
        return retval;
    },

    inventoryError($elinv, $elslot) {
        $elinv.find("[data-slot=" + $elslot + "]")
            .css("background", "rgba(156, 20, 20, 0.5)")
            .css("transition", "background 500ms");
        setTimeout(function () {
            $elinv.find("[data-slot=" + $elslot + "]").css("background", "rgba(0, 0, 0)");
        }, 500);
        $.post("https://qb-inventory/PlayDropFail", JSON.stringify({}));
    },

    isWeaponBlocked(weaponName) {
        const durabilityBlockedWeapons = ["weapon_unarmed"];
        let retval = false;
        $.each(durabilityBlockedWeapons, function (i, name) {
            if (name == weaponName) {
                retval = true;
            }
        });
        return retval;
    },

    updateWeights($fromSlot, $toSlot, $fromInv, $toInv, $toAmount) {
        const otherinventory = InventoryState.otherLabel.toLowerCase();

        if (otherinventory.split("-")[0] == "dropped") {
            const toData = $toInv.find("[data-slot=" + $toSlot + "]").data("item");
            if (toData !== null && toData !== undefined) {
                this.inventoryError($fromInv, $fromSlot);
                return false;
            }
        }

        if (($fromInv.attr("data-inventory") == "hotbar" && $toInv.attr("data-inventory") == "player") ||
            ($fromInv.attr("data-inventory") == "player" && $toInv.attr("data-inventory") == "hotbar") ||
            ($fromInv.attr("data-inventory") == "player" && $toInv.attr("data-inventory") == "player") ||
            ($fromInv.attr("data-inventory") == "hotbar" && $toInv.attr("data-inventory") == "hotbar")) {
            return true;
        }

        if (($fromInv.attr("data-inventory").split("-")[0] == "itemshop" && $toInv.attr("data-inventory").split("-")[0] == "itemshop") ||
            ($fromInv.attr("data-inventory") == "crafting" && $toInv.attr("data-inventory") == "crafting")) {
            const itemData = $fromInv.find("[data-slot=" + $fromSlot + "]").data("item");
            const imgPath = 'images/' + itemData.image;
            if ($fromInv.attr("data-inventory").split("-")[0] == "itemshop") {
                $fromInv.find("[data-slot=" + $fromSlot + "]").html('<div class="item-slot-img"><img class="loading" src="' + imgPath + '" alt="' + itemData.name + '" onerror="this.onerror=null; this.style.opacity=\'0.3\'; this.style.filter=\'grayscale(1)\';" onload="this.classList.remove(\'loading\');" /></div><div class="item-slot-amount"><p>(' + itemData.amount + ') $' + itemData.price + '</p></div><div class="item-slot-label"><p>' + itemData.label + '</p></div>');
            } else {
                $fromInv.find("[data-slot=" + $fromSlot + "]").html('<div class="item-slot-img"><img class="loading" src="' + imgPath + '" alt="' + itemData.name + '" onerror="this.onerror=null; this.style.opacity=\'0.3\'; this.style.filter=\'grayscale(1)\';" onload="this.classList.remove(\'loading\');" /></div><div class="item-slot-amount"><p>' + itemData.amount + ' (' + ((itemData.weight * itemData.amount) / 1000).toFixed(1) + ')</p></div><div class="item-slot-label"><p>' + itemData.label + '</p></div>');
            }
            this.inventoryError($fromInv, $fromSlot);
            return false;
        }

        if ($toAmount == 0 && ($fromInv.attr("data-inventory").split("-")[0] == "itemshop" || $fromInv.attr("data-inventory") == "crafting")) {
            const itemData = $fromInv.find("[data-slot=" + $fromSlot + "]").data("item");
            const imgPath = 'images/' + itemData.image;
            if ($fromInv.attr("data-inventory").split("-")[0] == "itemshop") {
                $fromInv.find("[data-slot=" + $fromSlot + "]").html('<div class="item-slot-img"><img class="loading" src="' + imgPath + '" alt="' + itemData.name + '" onerror="this.onerror=null; this.style.opacity=\'0.3\'; this.style.filter=\'grayscale(1)\';" onload="this.classList.remove(\'loading\');" /></div><div class="item-slot-amount"><p>(' + itemData.amount + ') $' + itemData.price + '</p></div><div class="item-slot-label"><p>' + itemData.label + '</p></div>');
            } else {
                $fromInv.find("[data-slot=" + $fromSlot + "]").html('<div class="item-slot-img"><img class="loading" src="' + imgPath + '" alt="' + itemData.name + '" onerror="this.onerror=null; this.style.opacity=\'0.3\'; this.style.filter=\'grayscale(1)\';" onload="this.classList.remove(\'loading\');" /></div><div class="item-slot-amount"><p>' + itemData.amount + ' (' + ((itemData.weight * itemData.amount) / 1000).toFixed(1) + ')</p></div><div class="item-slot-label"><p>' + itemData.label + '</p></div>');
            }
            this.inventoryError($fromInv, $fromSlot);
            return false;
        }

        if ($toInv.attr("data-inventory").split("-")[0] == "itemshop" || $toInv.attr("data-inventory") == "crafting") {
            const itemData = $toInv.find("[data-slot=" + $toSlot + "]").data("item");
            const imgPath = 'images/' + itemData.image;
            if ($toInv.attr("data-inventory").split("-")[0] == "itemshop") {
                $toInv.find("[data-slot=" + $toSlot + "]").html('<div class="item-slot-img"><img class="loading" src="' + imgPath + '" alt="' + itemData.name + '" onerror="this.onerror=null; this.style.opacity=\'0.3\'; this.style.filter=\'grayscale(1)\';" onload="this.classList.remove(\'loading\');" /></div><div class="item-slot-amount"><p>(' + itemData.amount + ') $' + itemData.price + '</p></div><div class="item-slot-label"><p>' + itemData.label + '</p></div>');
            } else {
                $toInv.find("[data-slot=" + $toSlot + "]").html('<div class="item-slot-img"><img class="loading" src="' + imgPath + '" alt="' + itemData.name + '" onerror="this.onerror=null; this.style.opacity=\'0.3\'; this.style.filter=\'grayscale(1)\';" onload="this.classList.remove(\'loading\');" /></div><div class="item-slot-amount"><p>' + itemData.amount + ' (' + ((itemData.weight * itemData.amount) / 1000).toFixed(1) + ')</p></div><div class="item-slot-label"><p>' + itemData.label + '</p></div>');
            }
            this.inventoryError($fromInv, $fromSlot);
            return false;
        }

        if ($fromInv.attr("data-inventory") != $toInv.attr("data-inventory")) {
            const fromData = $fromInv.find("[data-slot=" + $fromSlot + "]").data("item");
            const toData = $toInv.find("[data-slot=" + $toSlot + "]").data("item");
            if ($toAmount == 0) { $toAmount = fromData.amount; }

            if (toData == null || fromData.name == toData.name) {
                if ($fromInv.attr("data-inventory") == "player" || $fromInv.attr("data-inventory") == "hotbar") {
                    InventoryState.totalWeight = InventoryState.totalWeight - (fromData.weight * $toAmount);
                    InventoryState.totalWeightOther = InventoryState.totalWeightOther + (fromData.weight * $toAmount);
                } else {
                    InventoryState.totalWeight = InventoryState.totalWeight + (fromData.weight * $toAmount);
                    InventoryState.totalWeightOther = InventoryState.totalWeightOther - (fromData.weight * $toAmount);
                }
            } else {
                if ($fromInv.attr("data-inventory") == "player" || $fromInv.attr("data-inventory") == "hotbar") {
                    InventoryState.totalWeight = InventoryState.totalWeight - (fromData.weight * $toAmount);
                    InventoryState.totalWeight = InventoryState.totalWeight + (toData.weight * toData.amount);
                    InventoryState.totalWeightOther = InventoryState.totalWeightOther + (fromData.weight * $toAmount);
                    InventoryState.totalWeightOther = InventoryState.totalWeightOther - (toData.weight * toData.amount);
                } else {
                    InventoryState.totalWeight = InventoryState.totalWeight + (fromData.weight * $toAmount);
                    InventoryState.totalWeight = InventoryState.totalWeight - (toData.weight * toData.amount);
                    InventoryState.totalWeightOther = InventoryState.totalWeightOther - (fromData.weight * $toAmount);
                    InventoryState.totalWeightOther = InventoryState.totalWeightOther + (toData.weight * toData.amount);
                }
            }
        }

        if (InventoryState.totalWeight > InventoryState.playerMaxWeight ||
            (InventoryState.totalWeightOther > InventoryState.otherMaxWeight &&
                $fromInv.attr("data-inventory").split("-")[0] != "itemshop" &&
                $fromInv.attr("data-inventory") != "crafting")) {
            this.inventoryError($fromInv, $fromSlot);
            return false;
        }

        $("#player-inv-weight").html("Weight: " + (parseInt(InventoryState.totalWeight) / 1000).toFixed(2) + " / " + (InventoryState.playerMaxWeight / 1000).toFixed(2));
        if ($fromInv.attr("data-inventory").split("-")[0] != "itemshop" &&
            $toInv.attr("data-inventory").split("-")[0] != "itemshop" &&
            $fromInv.attr("data-inventory") != "crafting" &&
            $toInv.attr("data-inventory") != "crafting") {
            $("#other-inv-label").html(InventoryState.otherLabel);
            $("#other-inv-weight").html("Weight: " + (parseInt(InventoryState.totalWeightOther) / 1000).toFixed(2) + " / " + (InventoryState.otherMaxWeight / 1000).toFixed(2));
        }

        return true;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventoryUtils;
}

