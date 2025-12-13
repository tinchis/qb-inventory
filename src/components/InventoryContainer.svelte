<script>
    import { inventoryStore } from "../stores/inventoryStore";
    import TabMenu from "./TabMenu.svelte";
    import InventoryTab from "./tabs/InventoryTab.svelte";
    import EmotesTab from "./tabs/EmotesTab.svelte";
    import ClothesTab from "./tabs/ClothesTab.svelte";
    import MenuTab from "./tabs/MenuTab.svelte";

    $: activeTab = $inventoryStore.activeTab;
    $: menus = $inventoryStore.menus;
    $: itemAmount = $inventoryStore.itemAmount;

    function handleAmountChange(e) {
        inventoryStore.update((s) => ({
            ...s,
            itemAmount: parseInt(e.target.value) || 0,
        }));
    }
</script>

<div class="inv-container">
    <div
        style="display: flex; flex-direction: row; width: 95%; justify-content: space-between; margin-bottom: 1vh;"
    >
        <TabMenu />
        <div
            id="cantidad_back"
            style="display: flex; flex-direction: column; justify-content: center;"
        >
            <span
                style="color: white; opacity: .8; font-size: 1vh; text-align: center; font-family: Quicksand;"
                >CANTIDAD</span
            >
            <input
                type="number"
                id="item-amount"
                class="inv-option-item"
                min="0"
                value={itemAmount}
                on:input={handleAmountChange}
                on:focus={(e) => (e.target.value = "")}
            />
        </div>
    </div>

    {#if activeTab === "inv"}
        <InventoryTab />
    {:else if activeTab === "emotes"}
        <EmotesTab />
    {:else if activeTab === "clothes"}
        <ClothesTab />
    {:else}
        {#each menus as menu}
            {#if activeTab === menu.name}
                <MenuTab {menu} />
            {/if}
        {/each}
    {/if}
</div>
