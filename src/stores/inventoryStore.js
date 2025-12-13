import { writable } from 'svelte/store';

export const inventoryStore = writable({
    visible: false,
    inventory: [],
    otherInventory: [],
    slots: 40,
    maxWeight: 100000,
    totalWeight: 0,
    otherMaxWeight: 0,
    totalWeightOther: 0,
    otherLabel: '',
    otherName: '',
    isDragging: false,
    itemAmount: 0,
    clickedItemData: {},
    attachmentScreenActive: false,
    activeTab: 'inv',
    combineslotData: null,
    emotesHTML: '',
    clothState: {},
    menus: [],
    currentJob: '',
    isInVehicle: false
});

export const messageHandler = (event) => {
    const { action, data } = event.data;

    switch (action) {
        case 'open':
            openInventory(event.data);
            break;
        case 'close':
            closeInventory();
            break;
        case 'update':
            updateInventory(event.data);
            break;
        case 'itemBox':
            showItemBox(event.data);
            break;
        case 'toggleHotbar':
            toggleHotbar(event.data);
            break;
        case 'emotesHTML':
            inventoryStore.update(s => ({ ...s, emotesHTML: data.html }));
            break;
        case 'toggleCloth':
            inventoryStore.update(s => ({ ...s, clothState: data.data }));
            break;
        case 'registerMenu':
            registerMenu(event.data);
            break;
        case 'updateJob':
            inventoryStore.update(s => ({ ...s, currentJob: data.job }));
            break;
        case 'updateVehicle':
            inventoryStore.update(s => ({ ...s, isInVehicle: data.isIn, currentJob: data.job }));
            break;
    }
};

const openInventory = (data) => {
    inventoryStore.update(s => ({
        ...s,
        visible: true,
        inventory: data.inventory || [],
        otherInventory: data.other?.inventory || [],
        slots: data.slots,
        maxWeight: data.maxweight,
        otherMaxWeight: data.other?.maxweight || 0,
        otherLabel: data.other?.label || 'Drop',
        otherName: data.other?.name || '',
        totalWeight: calculateWeight(data.inventory),
        totalWeightOther: calculateWeight(data.other?.inventory),
        activeTab: 'inv',
        itemAmount: 0
    }));
};

const closeInventory = () => {
    inventoryStore.update(s => ({
        ...s,
        visible: false,
        attachmentScreenActive: false,
        clickedItemData: {}
    }));

    fetch('https://qb-inventory/CloseInventory', {
        method: 'POST',
        body: JSON.stringify({})
    });
};

const updateInventory = (data) => {
    inventoryStore.update(s => ({
        ...s,
        inventory: data.inventory || [],
        slots: data.slots,
        maxWeight: data.maxweight,
        totalWeight: calculateWeight(data.inventory)
    }));
};

const showItemBox = (data) => {
    const event = new CustomEvent('itembox', { detail: data });
    window.dispatchEvent(event);
};

const toggleHotbar = (data) => {
    const event = new CustomEvent('hotbar', { detail: data });
    window.dispatchEvent(event);
};

const registerMenu = (data) => {
    inventoryStore.update(s => ({
        ...s,
        menus: [...s.menus, data.data]
    }));
};

const calculateWeight = (items) => {
    if (!items) return 0;
    return items.reduce((total, item) => {
        if (item) return total + (item.weight * item.amount);
        return total;
    }, 0);
};

inventoryStore.close = closeInventory;
inventoryStore.open = openInventory;
inventoryStore.update = updateInventory;

