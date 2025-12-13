const createdMenus = [];

let isInVehicle = false;

function checkMenuJobs(job) {
    createdMenus.forEach(menu => {
        if (document.querySelector(".tab-btn-"+menu.name)) {
            document.querySelector(".tab-btn-"+menu.name).remove();
        }
        if (menu.jobs) {
            if (menu.jobs.indexOf(job) !== -1 && (isInVehicle || !menu.onlyvehicle)) {
                $(".tab-menu").append(`
                    <button class="tab-menu-btn tab-btn-${menu.name}" tab="${menu.name}">
                        <i class="fas ${menu.icon}" style="pointer-events: none;"></i>
                    </button>`
                );
            }
        }else if (isInVehicle || !menu.onlyvehicle){
            $(".tab-menu").append(`
                <button class="tab-menu-btn tab-btn-${menu.name}" tab="${menu.name}">
                    <i class="fas ${menu.icon}" style="pointer-events: none;"></i>
                </button>`
            );
        }
    });

    $(".tab-menu-btn").css({width: `${100/document.querySelector(".tab-menu").children.length}%`})
}

window.addEventListener("message", ({ data }) => {
    switch(data.action) {
        case "registerMenu":
            createdMenus.push(data.data);
            checkMenuJobs(data.job);

            createMenu(data.data, false);

            break;
        case "updateJob":
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