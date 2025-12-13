<script>
  import { inventoryStore } from '../stores/inventory';

  $: show = $inventoryStore.attachmentScreen;
  $: weapon = $inventoryStore.clickedWeapon;

  function close() {
    inventoryStore.closeAttachmentScreen();
  }
</script>

{#if show && weapon}
<div class="weapon-attachments-container fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200]">
  <div class="weapon-attachments-background bg-secondary border border-border rounded-lg p-8 min-w-[600px]">
    <div class="flex items-center justify-between mb-6">
      <div class="weapon-attachments-container-title text-foreground text-2xl font-bold">
        {weapon.label} | <span class="text-lg text-muted-foreground">9mm</span>
      </div>
      <img src="/attachment_images/{weapon.image}" alt={weapon.name} class="weapon-attachments-container-image w-40 h-auto">
    </div>

    <div class="border-t border-border my-4"></div>

    <div class="weapon-attachments-title text-foreground text-lg font-semibold mb-4">
      Complementos
    </div>

    <div class="weapon-attachments grid grid-cols-4 gap-3 mb-6">
    </div>

    <div class="weapon-attachments-remove min-h-[80px] border-2 border-dashed border-border/50 rounded-md flex items-center justify-center mb-4">
      <span class="text-muted-foreground text-sm">Arrastra aquí para quitar</span>
    </div>

    <button 
      on:click={close}
      class="weapon-attachments-back w-full bg-accent hover:bg-primary text-foreground px-6 py-3 rounded-md transition-colors font-medium">
      <i class="fa-solid fa-right-from-bracket text-primary mr-2"></i>Volver al Inventario
    </button>
  </div>
</div>
{/if}

