<script>
    import { inventoryStore } from "../stores/inventoryStore";

    $: menus = $inventoryStore.menus;
    $: activeTab = $inventoryStore.activeTab;
    $: currentJob = $inventoryStore.currentJob;
    $: isInVehicle = $inventoryStore.isInVehicle;

    function selectTab(tab) {
        inventoryStore.update((s) => ({ ...s, activeTab: tab }));
    }

    function shouldShowMenu(menu) {
        if (!menu.jobs && !menu.onlyvehicle) return true;
        if (menu.onlyvehicle && !isInVehicle) return false;
        if (menu.jobs && !menu.jobs.includes(currentJob)) return false;
        return true;
    }
</script>

<div class="tab-menu">
    <button
        class="tab-menu-btn"
        class:tab-selected={activeTab === "inv"}
        on:click={() => selectTab("inv")}
    >
        <i class="fas fa-backpack" style="pointer-events: none;"></i>
    </button>
    <button
        class="tab-menu-btn"
        class:tab-selected={activeTab === "emotes"}
        on:click={() => selectTab("emotes")}
    >
        <i class="fas fa-music" style="pointer-events: none;"></i>
    </button>
    <button
        class="tab-menu-btn"
        class:tab-selected={activeTab === "clothes"}
        on:click={() => selectTab("clothes")}
    >
        <i class="fas fa-tshirt" style="pointer-events: none;"></i>
    </button>

    {#each menus as menu}
        {#if shouldShowMenu(menu)}
            <button
                class="tab-menu-btn tab-btn-{menu.name}"
                class:tab-selected={activeTab === menu.name}
                on:click={() => selectTab(menu.name)}
            >
                <i class="fas {menu.icon}" style="pointer-events: none;"></i>
            </button>
        {/if}
    {/each}
</div>
