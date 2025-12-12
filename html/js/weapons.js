const WeaponManager = {
    formatAttachmentInfo(data) {
        $.post("https://qb-inventory/GetWeaponData", JSON.stringify({
            weapon: data.name,
            ItemData: InventoryState.clickedItemData,
        }), function (weaponData) {
            let AmmoLabel = "9mm";
            if (weaponData.WeaponData.ammotype == "AMMO_RIFLE") {
                AmmoLabel = "7.62";
            } else if (weaponData.WeaponData.ammotype == "AMMO_SHOTGUN") {
                AmmoLabel = "12 Gauge";
            }

            let Durability = 100;
            if (InventoryState.clickedItemData.info.quality !== undefined) {
                Durability = InventoryState.clickedItemData.info.quality;
            }

            $(".weapon-attachments-container-title").html(weaponData.WeaponData.label + " | " + AmmoLabel);
            $(".weapon-attachments-container-description").html(weaponData.WeaponData.description);
            $(".weapon-attachments-container-details").html('<span style="font-weight: bold; letter-spacing: .1vh;">Serial Number</span><br> ' + InventoryState.clickedItemData.info.serie + '<br><br><span style="font-weight: bold; letter-spacing: .1vh;">Durability - ' + Durability.toFixed() + '% </span> <div class="weapon-attachments-container-detail-durability"><div class="weapon-attachments-container-detail-durability-total"></div></div>');

            $(".weapon-attachments-container-detail-durability-total").css({
                width: Durability + "%",
            });

            const weaponImgSrc = "./attachment_images/" + weaponData.WeaponData.name + ".png";
            $(".weapon-attachments-container-image").attr("src", weaponImgSrc).on('error', function () {
                $(this).css({ 'opacity': '0.3', 'filter': 'grayscale(1)' });
            });
            $(".weapon-attachments").html("");

            if (weaponData.AttachmentData !== null && weaponData.AttachmentData !== undefined) {
                if (weaponData.AttachmentData.length > 0) {
                    $(".weapon-attachments-title").html('<span style="font-weight: bold; letter-spacing: .1vh;">Attachments</span>');
                    $.each(weaponData.AttachmentData, function (i, attachment) {
                        const attachImgSrc = './images/' + attachment.attachment + '.png';
                        $(".weapon-attachments").append('<div class="item-slot weapon-attachment" id="weapon-attachment-' + i + '"> <div class="item-slot-label"><p>' + attachment.label + '</p></div> <div class="item-slot-img"><img class="loading" src="' + attachImgSrc + '" onerror="this.onerror=null; this.style.opacity=\'0.3\'; this.style.filter=\'grayscale(1)\';" onload="this.classList.remove(\'loading\');"></div> </div>');
                        attachment.id = i;
                        $("#weapon-attachment-" + i).data("AttachmentData", attachment);
                    });
                } else {
                    $(".weapon-attachments-title").html('<span style="font-weight: bold; letter-spacing: .1vh;">This gun doesn\'t contain attachments</span>');
                }
            } else {
                $(".weapon-attachments-title").html('<span style="font-weight: bold; letter-spacing: .1vh;">This gun doesn\'t contain attachments</span>');
            }

            WeaponManager.handleAttachmentDrag();
        });
    },

    handleAttachmentDrag() {
        $(".weapon-attachment").draggable({
            helper: 'clone',
            appendTo: "body",
            scroll: true,
            revertDuration: 500,
            revert: "invalid",
            start: function (event, ui) {
                const ItemData = $(this).data('AttachmentData');
                $(this).css("z-index", InventoryState.zIndex++);
                $(this).addClass('weapon-dragging-class');
                InventoryState.attachmentDraggingData = ItemData;
            },
            stop: function () {
                $(this).removeClass('weapon-dragging-class');
            },
        });

        $(".weapon-attachments-remove").droppable({
            accept: ".weapon-attachment",
            hoverClass: 'weapon-attachments-remove-hover',
            drop: function (event, ui) {
                $.post('https://qb-inventory/RemoveAttachment', JSON.stringify({
                    AttachmentData: InventoryState.attachmentDraggingData,
                    WeaponData: InventoryState.clickedItemData,
                }), function (data) {
                    if (data.Attachments !== null && data.Attachments !== undefined) {
                        if (data.Attachments.length > 0) {
                            $("#weapon-attachment-" + InventoryState.attachmentDraggingData.id).fadeOut(150, function () {
                                $("#weapon-attachment-" + InventoryState.attachmentDraggingData.id).remove();
                                InventoryState.attachmentDraggingData = null;
                            });
                        } else {
                            $("#weapon-attachment-" + InventoryState.attachmentDraggingData.id).fadeOut(150, function () {
                                $("#weapon-attachment-" + InventoryState.attachmentDraggingData.id).remove();
                                InventoryState.attachmentDraggingData = null;
                                $(".weapon-attachments").html("");
                            });
                            $(".weapon-attachments-title").html('<span style="font-weight: bold; letter-spacing: .1vh;">Este arma no contiene archivos adjuntos.</span>');
                        }
                    } else {
                        $("#weapon-attachment-" + InventoryState.attachmentDraggingData.id).fadeOut(150, function () {
                            $("#weapon-attachment-" + InventoryState.attachmentDraggingData.id).remove();
                            InventoryState.attachmentDraggingData = null;
                            $(".weapon-attachments").html("");
                        });
                        $(".weapon-attachments-title").html('<span style="font-weight: bold; letter-spacing: .1vh;">Este arma no contiene archivos adjuntos.</span>');
                    }
                });
            },
        });
    },

    openAttachmentScreen() {
        if (!InventoryUtils.isWeaponBlocked(InventoryState.clickedItemData.name)) {
            $(".weapon-attachments-container").css({ "display": "block" });
            $(".weapon-attachments-container").removeClass("slide-right");
            $(".weapon-attachments-container").addClass("slide-left");
            $(".info-arma").css("display", "block");
            $("#qb-inventory1").css({ "display": "none" });
            InventoryState.attachmentScreenActive = true;
            this.formatAttachmentInfo(InventoryState.clickedItemData);
        } else {
            $.post('https://qb-inventory/Notify', JSON.stringify({
                message: "Los accesorios no están disponibles para este arma.",
                type: "error"
            }));
        }
    },

    closeAttachmentScreen() {
        $("#qb-inventory1").css({ "display": "block", "left": "13vw" });
        $(".weapon-attachments-container").css({ "display": "none" });
        $(".weapon-attachments-container").addClass("slide-right");
        $(".weapon-attachments-container").fadeOut(300);
        InventoryState.attachmentScreenActive = false;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeaponManager;
}

