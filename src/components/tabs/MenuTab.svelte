<script>
    export let menu;
    export let parentMenu = null;

    function handleOptionClick(option) {
        if (option.submenu) return;

        fetch("https://qb-inventory/submitMenuFunction", {
            method: "POST",
            body: JSON.stringify(option),
        });
    }
</script>

<div class="tab tab-menu-container" id="{menu.name}-tab">
    <div class="tmenu-title">
        <i class={menu.icon}></i>
        <div>{menu.title}</div>
    </div>

    {#if parentMenu}
        <button
            class="tmenu-option {menu.name}-back-option"
            on:click={() => parentMenu()}
        >
            <i class="fa-solid fa-chevron-left" style="font-size: 2vh"></i>
            <div class="tmenu-option-text-container">
                <div style="font-size:2vh">Atras</div>
            </div>
        </button>
    {/if}

    <div
        class="tmenu-options"
        style={parentMenu ? "height: 43.5vh;" : "height: 50vh;"}
    >
        {#each menu.options as option}
            <button
                class="tmenu-option"
                disabled={option.disable}
                on:click={() => handleOptionClick(option)}
            >
                <i
                    class={option.icon}
                    style="font-size:5vh; pointer-events: none;"
                ></i>
                <div
                    class="tmenu-option-text-container"
                    style="pointer-events: none;"
                >
                    <div style="font-size:2.4vh">{option.title}</div>
                    <div class="tmenu-option-description">
                        {option.description}
                    </div>
                </div>
            </button>
        {/each}
    </div>
</div>
