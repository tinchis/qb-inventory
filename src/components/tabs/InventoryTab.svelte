<script>
    import { inventoryStore } from "../../stores/inventoryStore";
    import ItemSlot from "../ItemSlot.svelte";

    $: inventory = $inventoryStore.inventory;
    $: slots = $inventoryStore.slots;
    $: totalWeight = $inventoryStore.totalWeight;
    $: maxWeight = $inventoryStore.maxWeight;

    $: percentage = maxWeight > 0 ? (totalWeight / maxWeight) * 100 : 0;
    $: progressClass =
        percentage < 50
            ? ""
            : percentage < 75
              ? "ui-progressbar-medium"
              : "ui-progressbar-high";

    function getPlayerSlots() {
        const result = { keys: [], main: [] };

        for (let i = 1; i < 6; i++) {
            const item = inventory.find((it) => it?.slot === i);
            result.keys.push({ slot: i, item: item || null });
        }

        for (let i = 6; i <= slots; i++) {
            const item = inventory.find((it) => it?.slot === i);
            result.main.push({ slot: i, item: item || null });
        }

        return result;
    }

    $: playerSlots = getPlayerSlots();
</script>

<div class="tab" id="inv-tab">
    <div
        id="player-inv-progressbar"
        class={progressClass}
        style="width: {percentage}%;"
    ></div>
    <div class="ply-inv-container">
        <div class="player-inventory-keys" data-inventory="player">
            {#each playerSlots.keys as { slot, item }}
                <ItemSlot {slot} {item} inventory="player" />
            {/each}
        </div>
        <div class="player-inventory" data-inventory="player">
            {#each playerSlots.main as { slot, item }}
                <ItemSlot {slot} {item} inventory="player" />
            {/each}
        </div>
    </div>
</div>
