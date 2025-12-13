<script>
  import { inventoryStore } from '../stores/inventory';

  $: hoveredItem = $inventoryStore.hoveredItem;
  $: show = hoveredItem !== null;
</script>

{#if show && hoveredItem}
<div class="ply-iteminfo-container fixed pointer-events-none z-[1000]" style="display: block;">
  <div class="ply-iteminfo bg-secondary border border-border rounded-lg p-4 min-w-[250px]">
    <div class="iteminfo-content">
      <div class="item-info-title text-foreground text-base font-semibold mb-2">
        {hoveredItem.label}
      </div>
      <div class="item-info-line border-t border-border my-2"></div>
      <div class="item-info-description text-muted-foreground text-sm leading-relaxed">
        {hoveredItem.description || 'Sin descripción'}
        
        {#if hoveredItem.type === 'weapon' && hoveredItem.info}
          <div class="mt-2">
            <p><strong>Serie:</strong> {hoveredItem.info.serie || 'N/A'}</p>
            <p><strong>Munición:</strong> {hoveredItem.info.ammo || 0}</p>
            {#if hoveredItem.info.quality}
              <p><strong>Durabilidad:</strong> {hoveredItem.info.quality.toFixed(0)}%</p>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
{/if}

<style>
  .ply-iteminfo-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>

