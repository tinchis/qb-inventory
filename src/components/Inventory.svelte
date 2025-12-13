<script>
    import { inventoryStore } from "../stores/inventoryStore";
    import InventoryContainer from "./InventoryContainer.svelte";
    import OtherInventory from "./OtherInventory.svelte";
    import TabMenu from "./TabMenu.svelte";
    import WeaponAttachments from "./WeaponAttachments.svelte";
    import ItemInfo from "./ItemInfo.svelte";
    import CombineOption from "./CombineOption.svelte";
    import ItemBoxes from "./ItemBoxes.svelte";

    $: visible = $inventoryStore.visible;
</script>

{#if visible}
    <div id="qbcore-inventory">
        <OtherInventory />
        <InventoryContainer />
        <WeaponAttachments />
        <CombineOption />
        <ItemBoxes />
        <ItemInfo />
    </div>
{/if}

<style>
    #qbcore-inventory {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>
