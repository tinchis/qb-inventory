<script>
  import { inventoryStore } from '../stores/inventory';

  $: show = $inventoryStore.requiredItemsOpen;
  $: items = $inventoryStore.requiredItems;
</script>

{#if show && items.length > 0}
<div class="requiredItem-container fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[hsl(240_3.7%_15.9%)] border border-[hsl(240_3.7%_20%)] rounded-lg p-8 z-[300]">
  {#each items as item}
    <div class="requiredItem-box mb-4">
      <div class="text-[hsl(142.1_76.2%_36.3%)] text-sm font-semibold mb-2">
        Requerido
      </div>
      <div class="text-white text-base mb-2">
        {item.label}
      </div>
      <div class="flex items-center justify-center">
        <img src="/images/{item.image}" alt={item.name} class="w-20 h-20 object-contain">
      </div>
    </div>
  {/each}
</div>
{/if}

