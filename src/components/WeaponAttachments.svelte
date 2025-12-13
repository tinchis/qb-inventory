<script>
    import { inventoryStore } from "../stores/inventoryStore";

    $: attachmentScreenActive = $inventoryStore.attachmentScreenActive;
    $: clickedItemData = $inventoryStore.clickedItemData;

    let weaponData = null;
    let attachmentData = [];

    function closeAttachments() {
        inventoryStore.update((s) => ({ ...s, attachmentScreenActive: false }));
    }

    function removeAttachment(attachment) {
        fetch("https://qb-inventory/RemoveAttachment", {
            method: "POST",
            body: JSON.stringify({
                AttachmentData: attachment,
                WeaponData: clickedItemData,
            }),
        });
    }
</script>

{#if attachmentScreenActive}
    <div class="weapon-attachments-container">
        <div class="weapon-attachments-container-title">
            {weaponData?.label || "Arma"} |
            <span style="font-size: 2vh;">Desconocida</span>
        </div>
        <div class="weapon-attachments-container-description">
            {weaponData?.description ||
                "No hay información acerca de este arma.."}
        </div>
        <div class="weapon-attachments-container-details">
            <span style="font-weight: bold; letter-spacing: .1vh;"
                >Número de serie</span
            ><br />
            {clickedItemData?.info?.serie || "?????????"}<br /><br />
            <span style="font-weight: bold; letter-spacing: .1vh;"
                >Durabilidad</span
            >
            <div class="weapon-attachments-container-detail-durability">
                <div
                    class="weapon-attachments-container-detail-durability-total"
                    style="width: {clickedItemData?.info?.quality || 100}%;"
                ></div>
            </div>
        </div>
        <img
            src="./attachment_images/weapon_pistol.png"
            class="weapon-attachments-container-image"
            alt="weapon"
        />
        <div class="weapon-attachments-title">
            <span style="font-weight: bold; letter-spacing: .1vh;">
                {attachmentData.length > 0
                    ? "Attachments"
                    : "Este arma no tiene accesorios"}
            </span>
        </div>
        <div class="weapon-attachments">
            {#each attachmentData as attachment, i}
                <div
                    class="item-slot weapon-attachment"
                    on:click={() => removeAttachment(attachment)}
                >
                    <div class="item-slot-label"><p>{attachment.label}</p></div>
                    <div class="item-slot-img">
                        <img
                            src="./images/{attachment.attachment}.png"
                            alt={attachment.label}
                        />
                    </div>
                </div>
            {/each}
        </div>
        <div class="weapon-attachments-remove">
            <i class="fas fa-trash"></i>
        </div>
        <div class="weapon-attachments-back" on:click={closeAttachments}>
            <p>VOLVER</p>
        </div>
    </div>
{/if}
