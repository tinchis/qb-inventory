<script>
  import { inventoryStore } from '../stores/inventory';

  export let slot;
  export let inventory;
  export let item = null;

  $: hasItem = item !== null && item !== undefined;
  $: isHotkey = slot <= 6 && inventory === 'player';

  function handleMouseEnter() {
    if (hasItem) {
      inventoryStore.setHoveredItem(item);
    }
  }

  function handleMouseLeave() {
    inventoryStore.setHoveredItem(null);
  }

  function handleDoubleClick() {
    if (hasItem && item.useable) {
      inventoryStore.useItem(item, inventory);
    }
  }

  function handleRightClick(e) {
    e.preventDefault();
    if (hasItem) {
      const targetInv = inventory === 'player' ? 'other' : 'player';
      inventoryStore.moveItem(slot, null, inventory, targetInv, 1);
    }
  }

  $: qualityColor = item?.info?.quality < 25 ? 'rgb(192, 57, 43)' : 
                    item?.info?.quality < 50 ? 'rgb(230, 126, 34)' : 
                    'rgb(39, 174, 96)';
</script>

<div 
  class="item-slot relative aspect-square w-full h-full bg-[#101010] border border-[#242424] rounded-md cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[80px] hover:border-[#0C5952] hover:bg-[#161616] hover:-translate-y-0.5"
  class:item-slot-draggable={hasItem}
  data-slot={slot}
  data-inventory={inventory}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:dblclick={handleDoubleClick}
  on:contextmenu={handleRightClick}
>
  {#if isHotkey}
    <div class="item-slot-key">
      <p>{slot}</p>
    </div>
  {/if}

  {#if hasItem}
    <div class="item-slot-img">
      <img src="/images/{item.image}" alt={item.name}>
    </div>
    <div class="item-slot-amount">
      <p>{item.amount}</p>
    </div>
    <div class="item-slot-label">
      <p>{item.label}</p>
    </div>
    
    {#if item.type === 'weapon' && item.info?.quality !== undefined}
      <div class="item-slot-quality">
        <div class="item-slot-quality-bar" style="width: {item.info.quality}%; background-color: {qualityColor}">
          <p>{item.info.quality.toFixed(0)}</p>
        </div>
      </div>
    {/if}
  {:else}
    <div class="item-slot-img"></div>
    <div class="item-slot-label"><p>&nbsp;</p></div>
  {/if}
</div>

<style>
  .item-slot-key {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #1F1F1F;
    font-size: 2.7rem;
    font-weight: 600;
    z-index: 5;
    pointer-events: none;
  }

  .item-slot-img {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }

  .item-slot-img img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .item-slot-amount {
    position: absolute;
    bottom: 0.25rem;
    right: 0.25rem;
    background: hsl(240 10% 3.9% / 0.9);
    color: hsl(0 0% 98%);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.625rem;
    font-weight: 600;
  }

  .item-slot-label {
    position: absolute;
    bottom: 0.25rem;
    left: 0.25rem;
    right: 2.5rem;
    font-size: 0.625rem;
    color: hsl(240 5% 64.9%);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-slot-quality {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    left: 0.25rem;
    height: 0.25rem;
    background: hsl(240 3.7% 10%);
    border-radius: 0.125rem;
    overflow: hidden;
  }

  .item-slot-quality-bar {
    height: 100%;
    transition: width 0.3s ease;
  }

  .item-slot-quality-bar p {
    display: none;
  }

  .item-slot-draggable {
    cursor: move;
  }
</style>

