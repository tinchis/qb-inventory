<script>
    import { inventoryStore } from "../stores/inventoryStore";
    import { createEventDispatcher } from "svelte";

    export let slot;
    export let item = null;
    export let inventory = "player";

    const dispatch = createEventDispatcher();

    let hovering = false;
    let dragging = false;

    $: isWeapon = item?.name?.split("_")[0] === "weapon";
    $: isHotkey = slot < 6 || slot === 41;
    $: hotkeyLabel = slot === 41 ? "6" : slot;

    function handleMouseEnter() {
        hovering = true;
        if (item) {
            const event = new CustomEvent("showItemInfo", {
                detail: { item, element: event.target },
            });
            window.dispatchEvent(event);
        }
    }

    function handleMouseLeave() {
        hovering = false;
        const event = new CustomEvent("hideItemInfo");
        window.dispatchEvent(event);
    }

    function handleDoubleClick() {
        if (!item) return;
        inventoryStore.close();
        fetch("https://qb-inventory/UseItem", {
            method: "POST",
            body: JSON.stringify({ inventory, item }),
        });
    }

    function handleClick() {
        if (!item) return;

        if (item.name?.split("_")[0] === "weapon") {
            inventoryStore.update((s) => ({
                ...s,
                clickedItemData: s.clickedItemData === item ? {} : item,
            }));
        }
    }

    function handleDragStart(e) {
        dragging = true;
        inventoryStore.update((s) => ({ ...s, isDragging: true }));
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData(
            "text/plain",
            JSON.stringify({ slot, inventory, item }),
        );
    }

    function handleDragEnd() {
        dragging = false;
        setTimeout(() => {
            inventoryStore.update((s) => ({ ...s, isDragging: false }));
        }, 300);
    }

    function handleDrop(e) {
        e.preventDefault();
        const fromData = JSON.parse(e.dataTransfer.getData("text/plain"));

        fetch("https://qb-inventory/SetInventoryData", {
            method: "POST",
            body: JSON.stringify({
                fromInventory: fromData.inventory,
                toInventory: inventory,
                fromSlot: fromData.slot,
                toSlot: slot,
                fromAmount: $inventoryStore.itemAmount || fromData.item.amount,
            }),
        });
    }

    function handleDragOver(e) {
        e.preventDefault();
    }
</script>

<div
    class="item-slot"
    class:item-drag={item !== null}
    class:item-nodrag={item === null}
    data-slot={slot}
    draggable={item !== null}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:dblclick={handleDoubleClick}
    on:click={handleClick}
    on:dragstart={handleDragStart}
    on:dragend={handleDragEnd}
    on:drop={handleDrop}
    on:dragover={handleDragOver}
>
    {#if isHotkey && inventory === "player"}
        <div class="item-slot-key"><p>{hotkeyLabel}</p></div>
    {/if}

    {#if item}
        <div class="item-slot-img">
            <img src="images/{item.image}" alt={item.name} />
        </div>
        <div class="item-slot-amount">
            <p>{item.amount}</p>
        </div>
        {#if isWeapon && item.info?.quality !== undefined}
            <div class="item-slot-quality">
                <div
                    class="item-slot-quality-bar"
                    style="width: {item.info.quality}%;"
                ></div>
            </div>
        {/if}
        <div class="item-slot-label">
            <p>{item.label}</p>
        </div>
    {:else}
        <div class="item-slot-img"></div>
        <div class="item-slot-label"><p>&nbsp;</p></div>
    {/if}
</div>
