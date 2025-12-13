<script>
    import { inventoryStore } from "../stores/inventoryStore";
    import ItemSlot from "./ItemSlot.svelte";

    $: otherInventory = $inventoryStore.otherInventory;
    $: otherLabel = $inventoryStore.otherLabel;
    $: totalWeightOther = $inventoryStore.totalWeightOther;
    $: otherMaxWeight = $inventoryStore.otherMaxWeight;
    $: otherName = $inventoryStore.otherName;
    $: activeTab = $inventoryStore.activeTab;
    $: visible = otherName !== "" && activeTab === "inv";

    $: percentage =
        otherMaxWeight > 0 ? (totalWeightOther / otherMaxWeight) * 100 : 0;
    $: progressClass =
        percentage < 50
            ? ""
            : percentage < 75
              ? "ui-progressbar-medium"
              : "ui-progressbar-high";

    function getSlots() {
        const slots = [];
        const maxSlots = otherInventory.length || 30;
        for (let i = 1; i <= maxSlots; i++) {
            const item = otherInventory.find((it) => it?.slot === i);
            slots.push({ slot: i, item: item || null });
        }
        return slots;
    }
</script>

{#if visible}
    <div class="inv-container-left">
        <div class="other-inv-info">
            <span id="other-inv-label">{otherLabel}</span>
            <span id="other-inv-weight-value"
                >{(totalWeightOther / 1000).toFixed(1)}/{(
                    otherMaxWeight / 1000
                ).toFixed(1)}</span
            >
        </div>
        <div
            id="other-inv-progressbar"
            class={progressClass}
            style="width: {percentage}%;"
        ></div>
        <div class="oth-inv-container">
            <div class="other-inventory" data-inventory="other">
                {#each getSlots() as { slot, item }}
                    <ItemSlot {slot} {item} inventory="other" />
                {/each}
            </div>
        </div>
    </div>
{/if}

<style>
    .oth-inv-container {
        position: relative;
        padding: 0.75vh;
        background: rgba(233, 233, 233, 0.075);
        border-radius: 0.4vh;
    }
</style>
