const UIRenderer = {
    renderItemLabel(item) {
        if ((item.name).split("_")[0] == "weapon") {
            if (!InventoryUtils.isWeaponBlocked(item.name)) {
                return '<div class="item-slot-quality"><div class="item-slot-quality-bar"><p>100</p></div></div><div class="item-slot-label"><p>' + item.label + '</p></div>';
            }
        }
        return '<div class="item-slot-label"><p>' + item.label + '</p></div>';
    },

    renderItemSlot(item, slot, isHotbar = false) {
        const ItemLabel = this.renderItemLabel(item);
        const weightDisplay = ((item.weight * item.amount) / 1000).toFixed(1);
        const imgHtml = '<div class="item-slot-img"><img src="images/' + item.image + '" alt="' + item.name + '" /></div>';
        const amountHtml = '<div class="item-slot-amount"><p>' + item.amount + ' (' + weightDisplay + ')</p></div>';

        if (slot < 6 && !isHotbar) {
            return '<div class="item-slot-key"><p>' + slot + '</p></div>' + imgHtml + amountHtml + ItemLabel;
        } else if (slot == 41 && !isHotbar) {
            return '<div class="item-slot-key"><p>6 <i class="fas fa-lock"></i></p></div>' + imgHtml + amountHtml + ItemLabel;
        } else {
            return imgHtml + amountHtml + ItemLabel;
        }
    },

    renderItemSlotWithPrice(item) {
        return '<div class="item-slot-img"><img src="images/' + item.image + '" alt="' + item.name + '" /></div><div class="item-slot-amount"><p>(' + item.amount + ') $' + item.price + '</p></div><div class="item-slot-label"><p>' + item.label + '</p></div>';
    },

    updateQualityBar(item, $slot) {
        if (!InventoryUtils.isWeaponBlocked(item.name) && (item.name).split("_")[0] == "weapon") {
            if (item.info.quality == undefined) { item.info.quality = 100.0; }

            let QualityColor = "rgb(39, 174, 96)";
            if (item.info.quality < 25) {
                QualityColor = "rgb(192, 57, 43)";
            } else if (item.info.quality > 25 && item.info.quality < 50) {
                QualityColor = "rgb(230, 126, 34)";
            }

            let qualityLabel = item.info.quality !== undefined ? (item.info.quality).toFixed() : item.info.quality;
            if (item.info.quality == 0) {
                qualityLabel = "ROTO";
            }

            $slot.find(".item-slot-quality-bar").css({
                "width": item.info.quality == 0 ? "100%" : qualityLabel + "%",
                "background-color": QualityColor
            }).find('p').html(qualityLabel);
        }
    },

    createItemInfoTitle(itemData) {
        return `
            <div class="item-title-infos">
                <span class="gray-text-titule-item">${itemData.label}</span>
                <span class="gray-text-cantidad">X ${itemData.amount}</span>
                <span class="gray-textddd">(P${((itemData.weight * itemData.amount) / 1000).toFixed(1)})</span>
            </div>
        `;
    },

    createItemInfoDescription(content) {
        return `
            <div class="item-desc-infos">
                <div class="d-flex align-items-center justify-content-between">
                    <p>${content}</p>
                </div>
            </div>
        `;
    },

    createWeaponInfo(itemData) {
        const ammo = itemData.info.ammo !== undefined && itemData.info.ammo !== null ? itemData.info.ammo : 0;
        let attachmentString = '';

        if (itemData.info.attachments != null) {
            $.each(itemData.info.attachments, function (i, attachment) {
                if (i == itemData.info.attachments.length - 1) {
                    attachmentString += attachment.label;
                } else {
                    attachmentString += attachment.label + ', ';
                }
            });

            return `
                <div class="weapon-desc-info">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <img src="https://i.ibb.co/TRLHN6h/Vr0Nd4Z.png" style="width:2vh;">
                            <div class="weapon-number">${itemData.info.serie}</div>
                        </div>
                        <div class="d-flex align-items-center">
                            <img src="https://i.ibb.co/7k3W1jk/jI57Qhp.png" style="width:1.8vh;margin-right:.5vh">
                            <span class="bullets">${ammo}</span>
                        </div>
                    </div>
                    <p><strong>Accesories: </strong><span>${attachmentString}</span></p>
                </div>
            `;
        } else {
            return `
                <div class="weapon-desc-info">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <img src="https://i.ibb.co/TRLHN6h/Vr0Nd4Z.png" style="width:2vh;">
                            <div class="weapon-number">${itemData.info.serie}</div>
                        </div>
                        <div class="d-flex align-items-center">
                            <img src="https://i.ibb.co/7k3W1jk/jI57Qhp.png" style="width:1.8vh;margin-right:.5vh">
                            <span class="bullets">${ammo}</span>
                        </div>
                    </div>
                </div>
                <div class="item-desc-infos">
                    <div class="d-flex align-items-center justify-content-between">
                        <p>${itemData.description}</p>
                    </div>
                </div>
            `;
        }
    },

    createCardInfo(data) {
        return `
            <div class="item-desc-infos-cards">
                ${data}
            </div>
        `;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIRenderer;
}

