<script>
  import { inventoryStore } from '../stores/inventory';
  import ItemSlot from './ItemSlot.svelte';
  import InventoryGrid from './InventoryGrid.svelte';

  $: isOpen = $inventoryStore.isOpen;
  $: itemAmount = $inventoryStore.itemAmount;
  $: playerWeight = $inventoryStore.playerWeight;
  $: playerMaxWeight = $inventoryStore.playerMaxWeight;
  $: slots = $inventoryStore.slots;
  $: otherLabel = $inventoryStore.otherLabel;
  $: otherWeight = $inventoryStore.otherWeight;
  $: otherMaxWeight = $inventoryStore.otherMaxWeight;
  $: showOther = $inventoryStore.otherName !== '';

  function decreaseAmount() {
    inventoryStore.setItemAmount(itemAmount - 1);
  }

  function increaseAmount() {
    inventoryStore.setItemAmount(itemAmount + 1);
  }

  function handleAmountInput(e) {
    const value = parseInt(e.target.value) || 1;
    inventoryStore.setItemAmount(value);
  }

  $: totalItems = Object.keys($inventoryStore.playerItems).length;
  $: itemPercent = (totalItems / slots) * 100;
</script>

{#if isOpen}
<div class="fixed inset-0 flex justify-center items-center p-3" style="animation: fadeIn 0.4s ease-out;">
  <div class="flex flex-row-reverse gap-6 ml-auto mr-auto items-center h-full">
    <div class="w-[500px] flex flex-col gap-4 transition-all duration-200">
      <div class="h-fit min-h-[200px] max-h-[800px] bg-[#090909]/90 shadow-[0_0_30px_rgba(0,0,0,0.7)] backdrop-blur-sm border border-[#5e5e5e7c] rounded-[10px] px-3 py-6 flex flex-col gap-3"
        style="background-image: url('/svgs/grid-pattern.svg'); background-position: center;">
        
        <div class="bannerGuide w-full px-3 py-2 rounded-[10px] border border-[#29776f]"
          style="background-image: url('/svgs/grid-pattern.svg'); background-size: cover; background-position: center; background-color: #0C5952">
          <div class="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 flex-shrink-0">
              <path d="M12.9336 3.70403C12.6724 3.63191 12.3931 3.66892 12.1597 3.80659L4.26165 8.39199L3.42352 6.85571L1.66778 7.81357L3.00111 10.2575C3.13098 10.4954 3.35178 10.6704 3.61298 10.7425C3.87418 10.8146 4.15351 10.7776 4.38698 10.6399L12.2848 6.0546L13.0443 7.44693C13.2834 7.29593 13.5266 7.1482 13.774 7.00468C14.1076 6.81127 14.4439 6.62852 14.7812 6.45469L13.5455 4.18912C13.4156 3.9512 13.1948 3.77613 12.9336 3.70403Z" fill="white"/>
              <path d="M14.7787 6.45436L16.8243 10.2045L17.4815 9.81015C17.712 9.6718 17.9887 9.63215 18.2488 9.70013C18.509 9.76812 18.7308 9.93803 18.8642 10.1715L21.5309 14.8382C21.8008 15.3104 21.6436 15.9119 21.1771 16.1918L17.8438 18.1918C17.6132 18.3302 17.3366 18.3698 17.0764 18.3018C16.8163 18.2338 16.5944 18.0639 16.4611 17.8304L13.7944 13.1638C13.5244 12.6915 13.6816 12.09 14.1482 11.8101L15.1079 11.2343L13.0418 7.4466C12.3799 7.8646 11.749 8.30775 11.1428 8.75659C8.61163 10.6308 7.61777 13.9694 8.86777 16.6596C9.5831 18.199 10.3522 19.786 11.2499 21.3475C12.1475 22.909 13.1316 24.3715 14.1014 25.7632C15.7983 28.1986 19.1797 29.0042 22.0639 27.7388C23.0033 27.3267 23.9568 26.8694 24.8895 26.3286C25.8223 25.7878 26.6932 25.1872 27.5183 24.5763C30.0493 22.7022 31.0435 19.3635 29.7934 16.6732C29.078 15.1339 28.3089 13.5468 27.4113 11.9854C26.5136 10.4239 25.5296 8.96148 24.5598 7.56968C22.8629 5.13429 19.4813 4.32875 16.5972 5.59401C15.9938 5.85877 15.3846 6.14217 14.7787 6.45436Z" fill="white"/>
              <path d="M17.6345 12.0508L19.3086 14.9805L17.6906 15.9513L16.0165 13.0216L17.6345 12.0508Z" fill="white"/>
            </svg>
            <div class="flex flex-col gap-1">
              <p class="text-white uppercase text-xs">Para dar items a otro usuario</p>
              <p class="text-[#90C9C4] text-xs">pulsa la ruedita del ratón sobre el objeto.</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between w-full">
          <div class="flex items-center min-w-[140px] w-fit h-9 rounded-md border border-input bg-transparent shadow-sm px-2 focus-within:ring-1 focus-within:ring-[#0F7168] transition-all">
            <button on:click={decreaseAmount} class="flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity px-1">
              <svg width="10" height="1" viewBox="0 0 10 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5 0.5H8.66667" stroke="#737373" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <input type="number" bind:value={itemAmount} on:input={handleAmountInput} min="1" max="10000000"
              class="w-[90px] h-full bg-transparent px-2 py-1 text-sm text-center text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="0">
            <button on:click={increaseAmount} class="flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity px-1">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5 4.875H8.66667" stroke="#737373" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.58203 0.5V9.25" stroke="#737373" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div class="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 4.66699C7.9665 4.66699 8.75 3.88349 8.75 2.91699C8.75 1.95049 7.9665 1.16699 7 1.16699C6.0335 1.16699 5.25 1.95049 5.25 2.91699C5.25 3.88349 6.0335 4.66699 7 4.66699Z" stroke="#737373" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.79126 4.66699C3.53883 4.66961 3.29405 4.75404 3.09368 4.9076C2.89331 5.06117 2.74816 5.27558 2.68001 5.51866L1.2246 10.792C1.1805 10.9627 1.17565 11.1411 1.21041 11.3139C1.24518 11.4867 1.31865 11.6494 1.42531 11.7898C1.53197 11.9301 1.66905 12.0445 1.82625 12.1242C1.98345 12.204 2.15668 12.2471 2.33293 12.2503H11.6663C11.8463 12.2503 12.0239 12.2085 12.1852 12.1284C12.3464 12.0482 12.4869 11.9318 12.5957 11.7883C12.7044 11.6448 12.7785 11.4781 12.812 11.3012C12.8456 11.1243 12.8378 10.942 12.7892 10.7687L11.3163 5.54199C11.252 5.29315 11.1074 5.07248 10.9049 4.91426C10.7024 4.75604 10.4533 4.66911 10.1963 4.66699H3.79126Z" stroke="#737373" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="bg-[#262626] w-[70px] h-1 rounded-full overflow-hidden">
              <div class="h-full bg-[#A1A1A1] transition-all duration-300 rounded-full" style="width: {itemPercent}%"></div>
            </div>
            <p class="text-[#A1A1A1] text-xs">{totalItems}/{slots}</p>
          </div>
        </div>

        <InventoryGrid inventory="player" />

        <div class="flex items-center gap-2 bg-[#0D0D0D] px-3 py-2.5 rounded-lg border border-[#2D2D2D]/70">
          <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3709 14C14.2706 14 15 13.2494 15 12.3236C15 12.0717 14.9449 11.8235 14.8392 11.5972L14.7908 11.5019L8.99554 0.900243C8.69156 0.344213 8.11995 0 7.5 0C6.91877 0 6.38002 0.302565 6.06445 0.798574L6.0045 0.900243L0.209163 11.5019C0.0720419 11.7527 1.39535e-05 12.0358 0 12.3236C0 13.2494 0.729391 14 1.62904 14H13.3709ZM7.5 8.79487C7.11467 8.79487 6.80233 8.47345 6.80233 8.07692V4.84615C6.80233 4.44964 7.11467 4.12821 7.5 4.12821C7.88533 4.12821 8.19768 4.44964 8.19768 4.84615V8.07692C8.19768 8.47345 7.88533 8.79487 7.5 8.79487ZM7.5 11.3147C7.11467 11.3147 6.80233 10.9933 6.80233 10.5968V10.5897C6.80233 10.1932 7.11467 9.8718 7.5 9.8718C7.88533 9.8718 8.19768 10.1932 8.19768 10.5897V10.5968C8.19768 10.9933 7.88533 11.3147 7.5 11.3147Z" fill="#0F7067"/>
          </svg>
          <p class="flex items-center gap-1.5 text-[#8C8C8C] text-xs">
            presiona <span class="text-xs bg-[#1F1F1F] border border-[#2F2F2F] rounded-md px-1.5 py-0.5">clic derecho</span> para <span class="text-[#0F7067]">dropear un item</span>
          </p>
        </div>
      </div>
    </div>

    {#if showOther}
    <div class="w-[500px] flex flex-col gap-4 transition-all duration-200" style="animation: fadeInDelayed 0.6s ease-out;">
      <div class="h-fit min-h-[200px] max-h-[800px] bg-[#090909]/90 shadow-[0_0_30px_rgba(0,0,0,0.7)] backdrop-blur-sm border border-[#5e5e5e7c] rounded-[10px] px-3 py-6 flex flex-col gap-3"
        style="background-image: url('/svgs/grid-pattern.svg'); background-position: center;">
        <div class="flex items-center justify-between">
          <div class="text-white font-semibold text-[#626262]">{otherLabel}</div>
          <span class="text-[#A1A1A1] text-xs">
            Weight: {(otherWeight / 1000).toFixed(2)} / {(otherMaxWeight / 1000).toFixed(2)}
          </span>
        </div>
        
        <InventoryGrid inventory="other" />
      </div>
    </div>
    {/if}
  </div>
</div>
{/if}

