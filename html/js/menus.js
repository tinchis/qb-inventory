const createdMenus = [];

let isInVehicle = false;
let currentJob = null;
let menuBreadcrumb = [];

function checkMenuJobs(job) {
    createdMenus.forEach(menu => {
        if (document.querySelector(".tab-btn-" + menu.name)) {
            document.querySelector(".tab-btn-" + menu.name).remove();
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
        } else if (isInVehicle || !menu.onlyvehicle) {
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
        $(".tab-menu-btn").css({ width: `${100 / document.querySelector(".tab-menu").children.length}%` })
    }

    updateMenusTab();
}

function updateMenusTab() {
    const menusTab = $("#menus-tab");
    if (menusTab.length === 0) {
        console.log("[DEBUG] menus-tab no encontrado");
        return;
    }

    menusTab.empty();
    menusTab.append(`
        <div class="tab-menu-container">
            <div class="tmenu-title" data-menu-name="menus-main">
                <div class="tmenu-breadcrumb">
                    <span class="tmenu-breadcrumb-item tmenu-breadcrumb-current">Menú</span>
                </div>
            </div>
            <div class="tmenu-options"></div>
        </div>
    `);

    menuBreadcrumb = [];

    console.log("[DEBUG] Actualizando tab menús. Total menús creados:", createdMenus.length, "Job actual:", currentJob, "En vehículo:", isInVehicle);

    let hasMenus = false;

    createdMenus.forEach(menu => {
        let shouldShow = false;

        if (menu.jobs && menu.jobs.length > 0) {
            if (currentJob && menu.jobs.indexOf(currentJob) !== -1) {
                if (menu.onlyvehicle) {
                    shouldShow = isInVehicle;
                } else {
                    shouldShow = true;
                }
            }
        } else {
            if (menu.onlyvehicle) {
                shouldShow = isInVehicle;
            } else {
                shouldShow = true;
            }
        }

        if (shouldShow) {
            hasMenus = true;
            const menuJson = JSON.stringify(menu).replaceAll('"', "'");
            $("#menus-tab .tmenu-options").append(`
                <button class="tmenu-option menus-tab-menu-option" menu-data="${menuJson}">
                    <div class="tmenu-option-icon">
                        <i class="${menu.icon}"></i>
                    </div>
                    <div class="tmenu-option-text-container">
                        <div class="tmenu-option-title">${menu.title}</div>
                    </div>
                    <div class="tmenu-option-arrow">
                        <i class="fa-solid fa-chevron-right"></i>
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
        menuBreadcrumb = [{
            name: menuData.name,
            title: menuData.title,
            parentName: 'menus-main'
        }];
        $(".tab").fadeOut(200);
        setTimeout(() => {
            $(`#${menuData.name}-tab`).fadeIn();
            updateBreadcrumb(menuData.name);
        }, 200);
    });
}

window.addEventListener("message", ({ data }) => {
    switch (data.action) {
        case "registerMenu":
            createdMenus.push(data.data);
            currentJob = data.job;
            checkMenuJobs(data.job);

            createMenu(data.data, false);
            updateMenusTab();

            console.log("[DEBUG] Menú registrado:", data.data.name, "Total menús:", createdMenus.length);

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
            <div class="tmenu-title" data-menu-name="${data.name}">
                <div class="tmenu-breadcrumb"></div>
            </div>
        </div>
    `)

    const newMenu = $(`#${data.name}-tab`);

    updateBreadcrumb(data.name);

    newMenu.append(`
        <div class="tmenu-options"></div>
    `)

    data.options.forEach(opt => {
        opt.menuName = data.name;
        const opjson = JSON.stringify(opt).replaceAll('"', "'")
        $(`#${data.name}-tab .tmenu-options`).append(`
            <button class="tmenu-option ${data.name}-menu-option" opt = "${opjson}"
            ${opt.disable ? 'style="pointer-events: none;"' : ''}>
                <div class="tmenu-option-icon">
                    <i class="${opt.icon}"></i>
                </div>
                <div class="tmenu-option-text-container">
                    <div class="tmenu-option-title">${opt.title}</div>
                    ${opt.description ? `<div class="tmenu-option-description">${opt.description}</div>` : ''}
                </div>
                ${opt.submenu ? '<div class="tmenu-option-arrow"><i class="fa-solid fa-chevron-right"></i></div>' : ''}
            </button>
        `);

        if (opt.submenu) {
            opt.submenu.name = data.name + '-' + opt.submenu.name;
            opt.submenu.parentName = data.name;
            createMenu(opt.submenu, true);
        }
    });

    $(`.${data.name}-menu-option`).click((e) => {
        e.preventDefault();
        e.stopPropagation();
        const $button = $(e.currentTarget);
        if ($button.length === 0) return;
        const optAttr = $button.attr('opt');
        if (!optAttr) return;
        const opcion = JSON.parse(optAttr.replaceAll("'", '"'));
        if (opcion.submenu) {
            const submenuName = data.name + '-' + opcion.submenu.name;
            const existingIndex = menuBreadcrumb.findIndex(b => b.name === submenuName);
            if (existingIndex !== -1) {
                menuBreadcrumb = menuBreadcrumb.slice(0, existingIndex + 1);
            } else {
                menuBreadcrumb.push({
                    name: submenuName,
                    title: opcion.submenu.title || opcion.title,
                    parentName: data.name
                });
            }
            $(".tab").fadeOut(200);
            setTimeout(() => {
                $(`#${submenuName}-tab`).fadeIn();
                updateBreadcrumb(submenuName);
            }, 200);
        } else {
            $.post("https://qb-inventory/submitMenuFunction", JSON.stringify(opcion));
        }
    })
}

function updateBreadcrumb(menuName) {
    const menuTab = $(`#${menuName}-tab`);
    if (menuTab.length === 0) return;

    const breadcrumbContainer = menuTab.find('.tmenu-breadcrumb');
    if (breadcrumbContainer.length === 0) return;

    breadcrumbContainer.empty();

    let breadcrumbHTML = '';
    const mainMenu = menuBreadcrumb.find(b => b.parentName === 'menus-main');

    if (mainMenu) {
        breadcrumbHTML += `<span class="tmenu-breadcrumb-item" data-menu-name="menus-main">Menú</span>`;
        breadcrumbHTML += `<span class="tmenu-breadcrumb-separator">></span>`;
        breadcrumbHTML += `<span class="tmenu-breadcrumb-item ${mainMenu.name === menuName ? 'tmenu-breadcrumb-current' : ''}" ${mainMenu.name !== menuName ? `data-menu-name="${mainMenu.name}"` : ''}>${mainMenu.title}</span>`;

        menuBreadcrumb.forEach((crumb) => {
            if (crumb.parentName !== 'menus-main') {
                breadcrumbHTML += `<span class="tmenu-breadcrumb-separator">></span>`;
                const isCurrent = crumb.name === menuName;
                breadcrumbHTML += `<span class="tmenu-breadcrumb-item ${isCurrent ? 'tmenu-breadcrumb-current' : ''}" ${!isCurrent ? `data-menu-name="${crumb.name}"` : ''}>${crumb.title}</span>`;
            }
        });
    } else {
        const menu = createdMenus.find(m => m.name === menuName);
        if (menu) {
            breadcrumbHTML += `<span class="tmenu-breadcrumb-item tmenu-breadcrumb-current">${menu.title}</span>`;
        }
    }

    breadcrumbContainer.html(breadcrumbHTML);

    breadcrumbContainer.find('.tmenu-breadcrumb-item[data-menu-name]').off('click').on('click', function () {
        const targetMenuName = $(this).attr('data-menu-name');

        if (targetMenuName === 'menus-main') {
            menuBreadcrumb = [];
            $(".tab").fadeOut(200);
            setTimeout(() => {
                $("#menus-tab").fadeIn();
                updateMenusTab();
            }, 200);
            return;
        }

        const targetIndex = menuBreadcrumb.findIndex(b => b.name === targetMenuName);
        if (targetIndex !== -1) {
            menuBreadcrumb = menuBreadcrumb.slice(0, targetIndex + 1);
        }

        $(".tab").fadeOut(200);
        setTimeout(() => {
            $(`#${targetMenuName}-tab`).fadeIn();
            updateBreadcrumb(targetMenuName);
        }, 200);
    });
}

window.addEventListener("load", () => {
    setTimeout(() => {
        const isInBrowser = window.location.protocol === 'file:' || window.location.hostname === '';
        if (createdMenus.length === 0 && isInBrowser) {
            console.log("[DEBUG] No hay menús registrados, simulando menú de debug para pruebas en navegador");
            const debugMenu = {
                name: "debug_menu",
                icon: "fa-solid fa-bug",
                title: "Menú de Debug",
                onlyvehicle: false,
                options: [
                    {
                        icon: 'fa-solid fa-check-circle',
                        title: 'Opción Simple',
                        description: 'Esta es una opción simple sin submenu para probar el diseño',
                        menuName: 'debug_menu'
                    },
                    {
                        icon: 'fa-solid fa-star',
                        title: 'Opción con Descripción Larga',
                        description: 'Esta opción tiene una descripción más larga para ver cómo se ve el diseño cuando el texto es extenso y ocupa más espacio en la interfaz',
                        menuName: 'debug_menu'
                    },
                    {
                        icon: 'fa-solid fa-folder-open',
                        title: 'Abrir Submenu',
                        description: 'Esta opción abre un submenu para probar la navegación entre menús',
                        menuName: 'debug_menu',
                        submenu: {
                            name: 'submenuDebug',
                            title: 'Submenu de Debug',
                            icon: 'fa-solid fa-list',
                            options: [
                                {
                                    title: 'Sub-opción 1',
                                    description: 'Primera opción del submenu de prueba',
                                    icon: 'fa-solid fa-circle'
                                },
                                {
                                    title: 'Sub-opción 2',
                                    description: 'Segunda opción del submenu con descripción',
                                    icon: 'fa-solid fa-square'
                                }
                            ]
                        }
                    },
                    {
                        icon: 'fa-solid fa-ban',
                        title: 'Opción Deshabilitada',
                        description: 'Esta opción está deshabilitada para probar el diseño del estado disabled',
                        disable: true,
                        menuName: 'debug_menu'
                    }
                ]
            };

            createdMenus.push(debugMenu);
            createMenu(debugMenu, false);
            updateMenusTab();
        }
    }, 1000);
})