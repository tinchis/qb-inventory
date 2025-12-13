const InventoryState = {
    option: "255, 255 ,255 , 0.4",

    totalWeight: 0,
    totalWeightOther: 0,
    playerMaxWeight: 0,
    otherMaxWeight: 0,
    otherLabel: "",

    clickedItemData: {},
    selectedAttachment: null,
    attachmentScreenActive: false,
    controlPressed: false,
    disableRightMouse: false,
    selectedItem: null,
    isDragging: false,

    zIndex: 3,
    slots: 0,

    animOut: false,
    timeOut: null,

    attachmentDraggingData: {},
    combineslotData: null,
    requiredItemOpen: false,

    reset() {
        this.totalWeight = 0;
        this.totalWeightOther = 0;
        this.clickedItemData = {};
        this.isDragging = false;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventoryState;
}

