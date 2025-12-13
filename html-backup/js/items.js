const ItemFormatter = {
    formatItemInfo(itemData) {
        if (itemData == null || itemData.info == "") {
            this.formatDefaultItem(itemData);
            return;
        }

        switch (itemData.name) {
            case "id_card":
                this.formatIdCard(itemData);
                break;
            case "driver_license":
                this.formatDriverLicense(itemData);
                break;
            case "lawyerpass":
                this.formatLawyerPass(itemData);
                break;
            case "harness":
                this.formatHarness(itemData);
                break;
            case "vehiclekey":
                this.formatVehicleKey(itemData);
                break;
            case "filled_evidence_bag":
                this.formatEvidenceBag(itemData);
                break;
            case "stickynote":
                this.formatStickyNote(itemData);
                break;
            case "moneybag":
                this.formatMoneyBag(itemData);
                break;
            case "markedbills":
                this.formatMarkedBills(itemData);
                break;
            case "labkey":
                this.formatLabKey(itemData);
                break;
            default:
                if (itemData.type == 'weapon') {
                    this.formatWeapon(itemData);
                } else if (itemData.info.costs != undefined && itemData.info.costs != null) {
                    this.formatItemWithCost(itemData);
                } else {
                    this.formatDefaultItem(itemData);
                }
                break;
        }
    },

    formatIdCard(itemData) {
        const gender = itemData.info.gender == 1 ? "Woman" : "Man";
        $('.item-info-title').html(UIRenderer.createItemInfoTitle(itemData));
        $('.item-info-description').html(UIRenderer.createCardInfo(`
            <p><strong>CSN: </strong><span>${itemData.info.citizenid}</span></p>
            <p><strong>Firstname: </strong><span>${itemData.info.firstname}</span></p>
            <p><strong>Lastname: </strong><span>${itemData.info.lastname}</span></p>
            <p><strong>Birthdate: </strong><span>${itemData.info.birthdate}</span></p>
            <p><strong>Gender: </strong><span>${gender}</span></p>
            <p><strong>Nationality: </strong><span>${itemData.info.nationality}</span></p>
        `));
    },

    formatDriverLicense(itemData) {
        $('.item-info-title').html(UIRenderer.createItemInfoTitle(itemData));
        $('.item-info-description').html(UIRenderer.createCardInfo(`
            <p><strong>Firstname: </strong><span>${itemData.info.firstname}</span></p>
            <p><strong>Lastname: </strong><span>${itemData.info.lastname}</span></p>
            <p><strong>Birthdate: </strong><span>${itemData.info.birthdate}</span></p>
            <p><strong>License: </strong><span>${itemData.info.type}</span></p>
        `));
    },

    formatLawyerPass(itemData) {
        $(".item-info-title").html('<span class="green-text">' + itemData.info.model + '</span> <span class="gray-text">X ' + itemData.amount + ' (P' + ((itemData.weight * itemData.amount) / 1000).toFixed(1) + ')</span>');
        $(".item-info-description").html('<p><strong>Pass-ID: </strong><span>' + itemData.info.id + '</span></p><p><strong>Firstname: </strong><span>' + itemData.info.firstname + '</span></p><p><strong>Lastname: </strong><span>' + itemData.info.lastname + '</span></p><p><strong>CSN: </strong><span>' + itemData.info.citizenid + '</span></p>');
    },

    formatHarness(itemData) {
        $(".item-info-title").html('<span class="green-text">' + itemData.info.model + '</span> <span class="gray-text">X ' + itemData.amount + ' (P' + ((itemData.weight * itemData.amount) / 1000).toFixed(1) + ')</span>');
        $(".item-info-description").html('<p>' + itemData.info.uses + ' uses left.</p>');
    },

    formatVehicleKey(itemData) {
        $(".item-info-title").html('<span class="green-text">' + itemData.info.model + '</span> <span class="gray-text">X ' + itemData.amount + ' (P' + ((itemData.weight * itemData.amount) / 1000).toFixed(1) + ')</span>');
        $(".item-info-description").html('<p>Plate : ' + itemData.info.plate + '</p>');
    },

    formatWeapon(itemData) {
        $('.item-info-title').html(UIRenderer.createItemInfoTitle(itemData));
        $('.item-info-description').html(UIRenderer.createWeaponInfo(itemData));
    },

    formatEvidenceBag(itemData) {
        $('.item-info-title').html(UIRenderer.createItemInfoTitle(itemData));

        if (itemData.info.type == "casing") {
            $(".item-info-description").html('<p><strong>Evidence material: </strong><span>' + itemData.info.label + '</span></p><p><strong>Tipo de Numero: </strong><span>' + itemData.info.ammotype + '</span></p><p><strong>Calibre: </strong><span>' + itemData.info.ammolabel + '</span></p><p><strong>Serial number:</strong><span>' + itemData.info.serie + '</span></p><p><strong>Escena del Crimen: </strong><span>' + itemData.info.street + '</span></p><br /><p>' + itemData.description + '</p>');
        } else if (itemData.info.type == "blood") {
            $(".item-info-description").html('<p><strong>Evidence material: </strong><span>' + itemData.info.label + '</span></p><p><strong>Tipo de Sangre: </strong><span>' + itemData.info.bloodtype + '</span></p><p><strong>Codigo DNA: </strong><span>' + itemData.info.dnalabel + '</span></p><p><strong>Escena del Crimen: </strong><span>' + itemData.info.street + '</span></p><br /><p>' + itemData.description + '</p>');
        } else if (itemData.info.type == "fingerprint") {
            $(".item-info-description").html('<p><strong>Evidence material: </strong><span>' + itemData.info.label + '</span></p><p><strong>Vingerpatroon: </strong><span>' + itemData.info.fingerprint + '</span></p><p><strong>Plaats delict: </strong><span>' + itemData.info.street + '</span></p><br /><p>' + itemData.description + '</p>');
        } else if (itemData.info.type == "dna") {
            $(".item-info-description").html('<p><strong>Evidence material: </strong><span>' + itemData.info.label + '</span></p><p><strong>Codigo DNA: </strong><span>' + itemData.info.dnalabel + '</span></p><br /><p>' + itemData.description + '</p>');
        }
    },

    formatItemWithCost(itemData) {
        $(".item-info-title").html('<span class="green-text">' + itemData.label + '</span> <span class="gray-text">X ' + itemData.amount + ' (P' + ((itemData.weight * itemData.amount) / 1000).toFixed(1) + ')</span>');
        $(".item-info-description").html('<p>' + itemData.info.costs + '</p>');
    },

    formatStickyNote(itemData) {
        $(".item-info-title").html('<span class="green-text">' + itemData.label + '</span> <span class="gray-text">X ' + itemData.amount + ' (P' + ((itemData.weight * itemData.amount) / 1000).toFixed(1) + ')</span>');
        $(".item-info-description").html('<p>' + itemData.info.label + '</p>');
    },

    formatMoneyBag(itemData) {
        $(".item-info-description").html("<p><strong>Amount of cash: </strong><span>$" + itemData.info.cash + "</span></p>");
    },

    formatMarkedBills(itemData) {
        $('.item-info-title').html(UIRenderer.createItemInfoTitle(itemData));
        $(".item-info-description").html("<p><strong>Worth: </strong><span>$" + itemData.info.worth + "</span></p>");
    },

    formatLabKey(itemData) {
        $(".item-info-title").html('<p>' + itemData.label + '</p>');
        $(".item-info-description").html('<p>Lab: ' + itemData.info.lab + '</p>');
    },

    formatDefaultItem(itemData) {
        $('.item-info-title').html(UIRenderer.createItemInfoTitle(itemData));
        $('.item-info-description').html(UIRenderer.createItemInfoDescription(itemData.description));
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ItemFormatter;
}

