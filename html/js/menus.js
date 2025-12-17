const createdMenus = [];

let isInVehicle = false;
let currentJob = null;

function checkMenuJobs(job) {
    createdMenus.forEach(menu => {
        if (document.querySelector(".tab-btn-"+menu.name)) {
            document.querySelector(".tab-btn-"+menu.name).remove();
        }
        if (menu.jobs) {
            if (menu.jobs.indexOf(job) !== -1 && (isInVehicle || !menu.onlyvehicle)) {
                if ($(".tab-menu").length > 0) {
                    $(".tab-menu").append(`
                        <button class="tab-menu-btn tab-btn-${menu.name}" tab="${menu.name}">
                            <i class="fas ${menu.icon}" style="pointer-events: none;"></i>
                        </button>`
                    );
                }
            }
        }else if (isInVehicle || !menu.onlyvehicle){
            if ($(".tab-menu").length > 0) {
                $(".tab-menu").append(`
                    <button class="tab-menu-btn tab-btn-${menu.name}" tab="${menu.name}">
                        <i class="fas ${menu.icon}" style="pointer-events: none;"></i>
                    </button>`
                );
            }
        }
    });

    if ($(".tab-menu").length > 0 && document.querySelector(".tab-menu").children.length > 0) {
        $(".tab-menu-btn").css({width: `${100/document.querySelector(".tab-menu").children.length}%`})
    }
    
    updateMenusTab();
}

function updateMenusTab() {
    const menusTab = $("#menus-tab");
    if (menusTab.length === 0) return;
    
    menusTab.empty();
    menusTab.append(`
        <div class="tab-menu-container" style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; font-family: 'IBM Plex Mono', monospace;">
            <div class="tmenu-title" style="color: white; font-family: 'IBM Plex Mono', monospace; font-size: 2.5vh; width: 100%; padding: 1vh; display: flex; flex-direction: row; align-items: center; gap: 1vh;">
                <i class="fas fa-bars"></i>
                <div>Menú</div>
            </div>
            <div class="tmenu-options" style="display: flex; flex-direction: column; align-items: center; gap: 1vh; width: 100%; padding: 1vh; overflow-y: auto; height: 50vh;"></div>
        </div>
    `);
    
    let hasMenus = false;
    
    createdMenus.forEach(menu => {
        let shouldShow = false;
        
        if (menu.jobs) {
            if (currentJob && menu.jobs.indexOf(currentJob) !== -1 && (isInVehicle || !menu.onlyvehicle)) {
                shouldShow = true;
            }
        } else {
            if (!menu.onlyvehicle || (menu.onlyvehicle && isInVehicle)) {
                shouldShow = true;
            }
        }
        
        if (shouldShow) {
            hasMenus = true;
            const menuJson = JSON.stringify(menu).replaceAll('"', "'");
            $("#menus-tab .tmenu-options").append(`
                <button class="tmenu-option menus-tab-menu-option" menu-data="${menuJson}" style="width: 100%; outline: 0; border-radius: .4vh; color: rgba(255, 255, 255, 0.575); background-color: rgba(68, 68, 68, 0.566); border: .3vh solid rgba(68, 68, 68, 0.566); cursor: pointer; transition: 0.2s; padding: .5vh; display: flex; flex-direction: row; align-items: center; gap: 1vh;">
                    <i class="${menu.icon}" style="font-size:5vh; pointer-events: none;"></i>
                    <div class="tmenu-option-text-container" style="display: flex; flex-direction: column; align-items: start; font-family: 'IBM Plex Mono', monospace; font-size: 2vh; width: 100%; color: rgba(255, 255, 255, 0.575); pointer-events: none;">
                        <div style="font-size:2.4vh">${menu.title}</div>
                    </div>
                </button>
            `);
        }
    });
    
    if (!hasMenus) {
        $("#menus-tab .tmenu-options").append(`
            <div style="color: rgba(255, 255, 255, 0.575); font-family: 'IBM Plex Mono', monospace; font-size: 2vh; text-align: center; padding: 2vh;">
                No hay menús disponibles
            </div>
        `);
    }
    
    $(".menus-tab-menu-option").off('click').on('click', (e) => {
        const menuData = JSON.parse($(e.currentTarget).attr('menu-data').replaceAll("'", '"'));
        $(".tab").fadeOut(200);
        setTimeout(() => {
            $(`#${menuData.name}-tab`).fadeIn();
        }, 200);
    });
}

window.addEventListener("message", ({ data }) => {
    switch(data.action) {
        case "registerMenu":
            createdMenus.push(data.data);
            currentJob = data.job;
            checkMenuJobs(data.job);

            createMenu(data.data, false);
            updateMenusTab();

            break;
        case "updateJob":
            currentJob = data.job;
            checkMenuJobs(data.job);
            break
        case "updateVehicle":
            isInVehicle = data.isIn
            checkMenuJobs(data.job);
            break;
    }
})

function createMenu(data, submenu) {
    $(".inv-container").append(`
        <div class="tab tab-menu-container" id = "${data.name}-tab">
            <div class="tmenu-title">
                <i class="${data.icon}"></i>
                <div>${data.title}</div>
            </div>
        </div>
    `)

    const newMenu = $(`#${data.name}-tab`);

    if (submenu) {
        newMenu.append(`
            <button class="tmenu-option ${data.name}-back-option" opt = "back" style="margin:1vh; width:calc(100% - 2vh) !important;">
                <i class="fa-solid fa-chevron-left" style="font-size: 2vh"></i>
                <div class="tmenu-option-text-container">
                    <div style="font-size:2vh">Atras</div>
                </div>
            </button>
        `)
        // $.post("https://qb-inventory/disablecontrols", JSON.stringify({}))
        
        $(`.${data.name}-back-option`).click(() => {
            $(".tab").fadeOut(200);
            setTimeout(() => {
                $(`#${data.parentName}-tab`).fadeIn();
            }, 200);
        });
    }

    newMenu.append(`
        <div class = "tmenu-options" style="${submenu ? 'height: 43.5vh !important;':'height: 50vh !important;' }"></div>
    `)

    data.options.forEach(opt => {
        opt.menuName = data.name;
        const opjson = JSON.stringify(opt).replaceAll('"', "'")
        $(`#${data.name}-tab .tmenu-options`).append(`
            <button class="tmenu-option ${data.name}-menu-option" opt = "${opjson}"
            style="${opt.disable ? 'pointer-events: none;' : ''}">
                <i class="${opt.icon}" style="font-size:5vh; pointer-events: none;"></i>
                <div class="tmenu-option-text-container" style="pointer-events: none;">
                    <div style="font-size:2.4vh">${opt.title}</div>
                    <div class="tmenu-option-description">${opt.description}</div>
                </div>
            </button>
        `);

        if (opt.submenu) {
            opt.submenu.name = data.name+'-'+opt.submenu.name;
            opt.submenu.parentName = data.name;
            createMenu(opt.submenu, true);
        }
    });

    $(`.${data.name}-menu-option`).click((e) => {
        const opcion = JSON.parse($(e.target).attr('opt').replaceAll("'",'"'));
        if (opcion.submenu) {
            $(".tab").fadeOut(200);
            setTimeout(() => {
                $(`#${data.name+'-'+opcion.submenu.name}-tab`).fadeIn();
            }, 200);
        }

        $.post("https://qb-inventory/submitMenuFunction", JSON.stringify(opcion));
    })
}