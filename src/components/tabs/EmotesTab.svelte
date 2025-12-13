<script>
    import { inventoryStore } from "../../stores/inventoryStore";

    $: emotesHTML = $inventoryStore.emotesHTML;
</script>

<div class="tab" id="emotes-tab">
    {@html emotesHTML}
</div>
