<script>
  import { inventoryStore } from '../stores/inventory';

  $: itemBoxes = $inventoryStore.itemBoxes;

  function getTypeLabel(type) {
    switch(type) {
      case 'add': return 'Received';
      case 'remove': return 'Removed';
      default: return 'Used';
    }
  }
</script>

<div class="itemboxes-container fixed bottom-4 right-4 flex flex-col gap-2 z-50">
  {#each itemBoxes as box (box.id)}
    <div class="itembox-container bg-[hsl(240_3.7%_15.9%/0.95)] border border-[hsl(142.1_76.2%_36.3%)] rounded-lg p-4 min-w-[250px]" style="animation: slideInRight 0.3s ease;">
      <div class="text-[hsl(142.1_76.2%_36.3%)] text-sm font-semibold mb-1">
        {getTypeLabel(box.type)}
      </div>
      <div class="text-white text-base mb-2">
        {box.item.label}
      </div>
      <div class="flex items-center justify-center">
        <img src="/images/{box.item.image}" alt={box.item.name} class="w-16 h-16 object-contain">
      </div>
    </div>
  {/each}
</div>

