<script>
  import { inventoryStore } from '../stores/inventory';
  import ItemSlot from './ItemSlot.svelte';
  import interact from '@interactjs/interactjs';
  import { onMount } from 'svelte';

  export let inventory = 'player';

  $: items = inventory === 'player' ? $inventoryStore.playerItems : $inventoryStore.otherItems;
  $: totalSlots = inventory === 'player' ? $inventoryStore.slots : $inventoryStore.otherSlots;
  $: slotsArray = Array.from({ length: totalSlots }, (_, i) => i + 1);

  let gridElement;

  onMount(() => {
    if (gridElement) {
      interact('.item-slot-draggable').draggable({
        inertia: false,
        autoScroll: true,
        listeners: {
          start(event) {
            inventoryStore.update(s => ({ ...s, isDragging: true }));
          },
          move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            
            target.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          },
          end(event) {
            const target = event.target;
            target.style.transform = '';
            target.removeAttribute('data-x');
            target.removeAttribute('data-y');
            inventoryStore.update(s => ({ ...s, isDragging: false }));
          }
        }
      });

      interact('.item-slot').dropzone({
        accept: '.item-slot-draggable',
        ondrop(event) {
          const fromSlot = parseInt(event.relatedTarget.dataset.slot);
          const fromInv = event.relatedTarget.dataset.inventory;
          const toSlot = parseInt(event.target.dataset.slot);
          const toInv = event.target.dataset.inventory;
          const amount = $inventoryStore.itemAmount;

          if (fromSlot !== toSlot || fromInv !== toInv) {
            inventoryStore.moveItem(fromSlot, toSlot, fromInv, toInv, amount);
          }
        }
      });
    }
  });
</script>

<div bind:this={gridElement} class="grid grid-cols-6 grid-rows-5 gap-2">
  {#each slotsArray as slot}
    <ItemSlot {slot} {inventory} item={items[slot]} />
  {/each}
</div>

