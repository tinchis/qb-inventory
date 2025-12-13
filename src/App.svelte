<script>
    import { onMount } from "svelte";
    import Inventory from "./components/Inventory.svelte";
    import { inventoryStore, messageHandler } from "./stores/inventoryStore";

    onMount(() => {
        window.addEventListener("message", messageHandler);
        return () => window.removeEventListener("message", messageHandler);
    });

    document.addEventListener("keyup", (event) => {
        if (event.repeat) return;
        if (event.keyCode === 27) inventoryStore.close();
    });

    document.addEventListener("keydown", (event) => {
        if (event.repeat) return;
        if (event.keyCode === 113) inventoryStore.close();
    });
</script>

<Inventory />
