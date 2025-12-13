<script>
    import { onMount } from "svelte";

    let boxes = [];

    onMount(() => {
        window.addEventListener("itembox", handleItemBox);
        return () => window.removeEventListener("itembox", handleItemBox);
    });

    function handleItemBox(e) {
        const { item, type, amount } = e.detail;
        let typeText = "Usado";
        if (type === "add") typeText = "Recibido";
        else if (type === "remove") typeText = "Eliminado";

        const box = {
            id: Date.now(),
            image: item.image,
            label: item.label,
            type: typeText,
        };

        boxes = [box, ...boxes];

        setTimeout(() => {
            boxes = boxes.filter((b) => b.id !== box.id);
        }, 3000);
    }
</script>

<div class="itemboxes-container">
    {#each boxes as box (box.id)}
        <div class="itembox-action">
            <img src="./images/{box.image}" alt={box.label} />
            <div class="itembox-col">
                <div class="itembox-title">{box.label}</div>
                <div class="itembox-desc">{box.type}</div>
            </div>
        </div>
    {/each}
</div>
