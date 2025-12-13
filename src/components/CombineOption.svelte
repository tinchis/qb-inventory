<script>
    import { inventoryStore } from "../stores/inventoryStore";

    $: combineslotData = $inventoryStore.combineslotData;
    $: visible = combineslotData !== null;

    function handleCombine() {
        if (!combineslotData) return;

        if (combineslotData.toData.combinable.anim != null) {
            fetch("https://qb-inventory/combineWithAnim", {
                method: "POST",
                body: JSON.stringify({
                    combineData: combineslotData.toData.combinable,
                    usedItem: combineslotData.toData.name,
                    requiredItem: combineslotData.fromData.name,
                }),
            });
        } else {
            fetch("https://qb-inventory/combineItem", {
                method: "POST",
                body: JSON.stringify({
                    reward: combineslotData.toData.combinable.reward,
                    toItem: combineslotData.toData.name,
                    fromItem: combineslotData.fromData.name,
                }),
            });
        }
        inventoryStore.close();
    }

    function handleSwitch() {
        if (!combineslotData) return;
        inventoryStore.update((s) => ({ ...s, combineslotData: null }));
    }
</script>

{#if visible}
    <div class="combine-option-container">
        <div class="inv-option-item CombineItem" on:click={handleCombine}>
            <p>Combinar</p>
        </div>
        <div class="inv-option-item SwitchItem" on:click={handleSwitch}>
            <p>Cambiar</p>
        </div>
    </div>
{/if}
