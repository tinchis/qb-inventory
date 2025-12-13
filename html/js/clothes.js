const ropa = {
    "glasses":"Glasses",
    "ear":"Ear",
    "neck":"Neck",
    "watch":"Watch",
    "bracelet":"Bracelet",
    "vest":"Vest",
    "shirt":"Shirt",
    "gloves":"Gloves",
    "hat":"Hat",
    "shoes":"Shoes",
    "mask":"Mask",
    "hair":"Hair",
    "bagoff":"Bagoff",
    "pants":"Pants",
    "fixpj":"fixpj"
}
window.addEventListener("load", () => {
    for (const id of Object.keys(ropa)) {
        $(`#${id}`).click(() => {
            $.post("https://qb-inventory/toggleCloth", JSON.stringify(id));
        });
    }
})

window.addEventListener("message", ({data}) => {
    if (data.action === "toggleCloth") {
        console.log("actualizando")
        for (const id of Object.keys(ropa)) {
            if (data.data[ropa[id]] && data.data[ropa[id]] === true) {
                $(`#${id}`).addClass("toggled-cloth");
            }else {
                $(`#${id}`).removeClass("toggled-cloth");
            }
        }
    }
})