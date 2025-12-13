import { writable, derived } from 'svelte/store';

function createInventoryStore() {
    const { subscribe, set, update } = writable({
        isOpen: false,
        playerItems: {},
        otherItems: {},
        playerMaxWeight: 120000,
        otherMaxWeight: 100000,
        playerWeight: 0,
        otherWeight: 0,
        slots: 50,
        otherSlots: 40,
        otherLabel: 'Otro Inventario',
        otherName: '',
        itemAmount: 1,
        hoveredItem: null,
        clickedWeapon: null,
        attachmentScreen: false,
        isDragging: false,
        requiredItems: [],
        requiredItemsOpen: false,
        itemBoxes: []
    });

    function postData(endpoint, data) {
        fetch(`https://qb-inventory/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    return {
        subscribe,

        handleAction(data) {
            if (!data || !data.action) return;

            switch (data.action) {
                case 'open':
                    update(state => ({
                        ...state,
                        isOpen: true,
                        playerItems: data.inventory || {},
                        otherItems: data.other?.inventory || {},
                        playerMaxWeight: data.maxweight || 120000,
                        otherMaxWeight: data.other?.maxweight || 100000,
                        slots: data.slots || 50,
                        otherSlots: data.other?.slots || 40,
                        otherLabel: data.other?.label || 'Otro Inventario',
                        otherName: data.other?.name || '',
                        playerWeight: calculateWeight(data.inventory),
                        otherWeight: calculateWeight(data.other?.inventory)
                    }));
                    break;

                case 'close':
                    update(state => ({
                        ...state,
                        isOpen: false,
                        attachmentScreen: false,
                        clickedWeapon: null,
                        hoveredItem: null
                    }));
                    break;

                case 'update':
                    update(state => ({
                        ...state,
                        playerItems: data.inventory || {},
                        playerWeight: calculateWeight(data.inventory),
                        playerMaxWeight: data.maxweight || state.playerMaxWeight
                    }));
                    break;

                case 'itemBox':
                    update(state => {
                        const newBox = {
                            id: Date.now(),
                            type: data.type,
                            item: data.item
                        };
                        return {
                            ...state,
                            itemBoxes: [...state.itemBoxes, newBox]
                        };
                    });
                    setTimeout(() => {
                        update(state => ({
                            ...state,
                            itemBoxes: state.itemBoxes.filter(box => box.id !== Date.now())
                        }));
                    }, 3000);
                    break;

                case 'requiredItem':
                    update(state => ({
                        ...state,
                        requiredItems: data.toggle ? data.items : [],
                        requiredItemsOpen: data.toggle
                    }));
                    break;

                case 'toggleHotbar':
                    break;
            }
        },

        close() {
            update(state => ({ ...state, isOpen: false, attachmentScreen: false }));
            postData('CloseInventory', {});
        },

        setItemAmount(amount) {
            update(state => ({ ...state, itemAmount: Math.max(1, Math.min(amount, 10000000)) }));
        },

        setHoveredItem(item) {
            update(state => ({ ...state, hoveredItem: item }));
        },

        setClickedWeapon(item) {
            update(state => ({ ...state, clickedWeapon: item }));
        },

        openAttachmentScreen() {
            update(state => ({ ...state, attachmentScreen: true }));
        },

        closeAttachmentScreen() {
            update(state => ({ ...state, attachmentScreen: false }));
        },

        moveItem(fromSlot, toSlot, fromInventory, toInventory, amount) {
            postData('SetInventoryData', {
                fromInventory,
                toInventory,
                fromSlot,
                toSlot,
                fromAmount: amount
            });
        },

        useItem(item, inventory) {
            update(state => ({ ...state, isOpen: false }));
            postData('UseItem', { inventory, item });
        },

        dropItem(item, inventory, amount) {
            postData('DropItem', { inventory, item, amount });
        }
    };
}

function calculateWeight(items) {
    if (!items) return 0;
    return Object.values(items).reduce((total, item) => {
        return total + (item ? item.weight * item.amount : 0);
    }, 0);
}

export const inventoryStore = createInventoryStore();

