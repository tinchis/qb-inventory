<script>
    import { onMount } from "svelte";

    let visible = false;
    let item = null;
    let position = { bottom: 0, right: 0 };

    onMount(() => {
        window.addEventListener("showItemInfo", handleShow);
        window.addEventListener("hideItemInfo", handleHide);

        return () => {
            window.removeEventListener("showItemInfo", handleShow);
            window.removeEventListener("hideItemInfo", handleHide);
        };
    });

    function handleShow(e) {
        item = e.detail.item;
        visible = true;
    }

    function handleHide() {
        visible = false;
    }

    function generateDescription(itemData) {
        if (itemData.type === "weapon") {
            let ammo = itemData.info?.ammo ?? 0;
            return `
            <p><strong>Número de Serie: </strong><span>${itemData.info.serie}</span></p>
            <p><strong>Cargador: </strong><span>${ammo}</span></p>
            <p>${itemData.description}</p>
        `;
        }
        return `
        <p>${itemData.description}</p>
        <p><strong> Caducidad: </strong><span>${Math.floor(itemData.info?.quality || 100)}</span></p>
    `;
    }
</script>

{#if visible && item}
    <div class="ply-iteminfo-container">
        <div class="iteminfo-content">
            <div class="item-info-title"><p>{item.label}</p></div>
            <div class="item-info-line"></div>
            <div class="item-info-description">
                {@html generateDescription(item)}
            </div>
        </div>
    </div>
{/if}
