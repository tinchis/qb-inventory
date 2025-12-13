<script>
  import { onMount } from "svelte";
  import Inventory from "./components/Inventory.svelte";
  import WeaponAttachments from "./components/WeaponAttachments.svelte";
  import ItemInfo from "./components/ItemInfo.svelte";
  import ItemBoxes from "./components/ItemBoxes.svelte";
  import RequiredItems from "./components/RequiredItems.svelte";
  import { inventoryStore } from "./stores/inventory";

  const DEBUG_MODE = false;

  onMount(() => {
    if (DEBUG_MODE) {
      document.body.style.backgroundImage = "url(/images/bgTest.png)";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";

      setTimeout(() => {
        const testData = {
          action: "open",
          inventory: { maxweight: 120000, slots: 50 },
          other: {
            maxweight: 100000,
            slots: 40,
            name: "Cofre del Garaje",
            label: "Cofre del Garaje",
          },
          playeritems: {
            1: {
              name: "water",
              amount: 15,
              info: [],
              label: "Agua",
              description: "Agua mineral",
              weight: 500,
              type: "item",
              unique: false,
              useable: true,
              image: "water.png",
              slot: 1,
            },
            2: {
              name: "bread",
              amount: 8,
              info: [],
              label: "Pan",
              description: "Pan fresco",
              weight: 200,
              type: "item",
              unique: false,
              useable: true,
              image: "bread.png",
              slot: 2,
            },
          },
          otheritems: {},
          weight: 10000,
          maxweight: 120000,
        };
        window.postMessage(testData, "*");
      }, 500);
    }

    const handleMessage = (event) => {
      inventoryStore.handleAction(event.data);
    };

    window.addEventListener("message", handleMessage);

    const handleKeydown = (event) => {
      if ([27, 112, 9].includes(event.keyCode)) {
        inventoryStore.close();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("keydown", handleKeydown);
    };
  });
</script>

<div class="fixed inset-0 overflow-hidden select-none bg-transparent">
  <Inventory />
  <WeaponAttachments />
  <ItemInfo />
  <ItemBoxes />
  <RequiredItems />
</div>
