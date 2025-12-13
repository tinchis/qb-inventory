local QBCore = exports['qb-core']:GetCoreObject()

local nuiLoaded = false

RegisterNUICallback("nuiReadyEmotes", function()
    nuiLoaded = true

    -- CreateThread(function()
    --     local lastVehicle = 0
    --     local ms = 3000
    --     local vehicle
    --     while true do
    --         vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
    --         if vehicle ~= lastVehicle then
    --             lastVehicle = vehicle
    --             SendNUIMessage({
    --                 action = "updateVehicle",
    --                 isIn = vehicle ~= 0,
    --                 job = QBCore.Functions.GetPlayerData().job.name
    --             })
    --         end
    --         Wait(ms)
    --     end
    -- end)
end)

RegisterNetEvent('QBCore:Player:SetPlayerData', function(val)
    SendNUIMessage({
        action = "updateJob",
        job = val.job.name
    })
end)

/*
    data = {
        name = '', -- tiene que ser unico | se hace el append por orden de llegada cualquier otro metodo es ineficiente (el orden del algoritmo aumenta polinomicamente)
        icon = '',
        title = '',
        jobs = {'police'}, -- lista de trabajos que pueden acceder | opcional
        onlyvehicle = boolean, -- opcional
        options = { -- lista con las opciones
            {
                title = '',
                description = '',
                icon = '',
                closeinv = boolean, -- opcional
                disable = boolean, -- opcional
                handler = function, -- pasa como argumento a esa funcion el elemento seleccionado | se le pueden añadir mas campos al elemento ej. name o value
                submenu = {
                    name = '', -- tiene que ser unico
                    icon = '',
                    title = '',
                    options = {
                        {
                            title = '', 
                            description = '', 
                            icon = '', 
                            closeinv = boolean, -- opcional
                            disable = boolean, -- opcional
                            handler = function, -- pasa como argumento a esa funcion el elemento seleccionado | se le pueden añadir mas campos al elemento ej. name o value
                            submenu = {} -- opcional
                        }
                    }
                }
            }
        },
    }
*/
function createOption(data)

    while not nuiLoaded or not QBCore.Functions.GetPlayerData().job do Wait(10) end
    
    registerHandlerFunctions(data, '')

    SendNUIMessage({
        action = "registerMenu",
        data = data,
        job = QBCore.Functions.GetPlayerData().job.name
    })
end

local functionHandler = {}

function registerHandlerFunctions(menu, acum)
    for k,v in pairs(menu.options) do
        if v.handler then
            functionHandler[acum..menu.name.."-"..(v.title:gsub(" ", "-"))] = v.handler
            menu.options[k].handler = nil
        end
    end

    for k,v in pairs(menu.options) do
        if v.submenu then
            registerHandlerFunctions(v.submenu, acum..menu.name..'-')
        end
    end
end

RegisterNUICallback("submitMenuFunction",function(elem, cb)
    if elem.closeinv then
        ExecuteCommand("closeinv")
    end
    
    if functionHandler[elem.menuName.."-"..(elem.title:gsub(" ", "-"))] then
        functionHandler[elem.menuName.."-"..(elem.title:gsub(" ", "-"))](elem)
    end
end)

exports("createOption", createOption)

-- EJEMPLO CREAR MENU
-- createOption({
--     name = "prueba",
--     icon = "fa-solid fa-trash",
--     title = "Menu de prueba",
--     --jobs = {'ambulance'},
--     onlyvehicle = false,
--     options = {
--         {
--             icon = 'fa-solid fa-trash', title = 'Hola', description = 'Descripcion',
--             handler = function(element)
--                 print("Hola")
--             end
--         },
--         {
--             icon = 'fa-solid fa-trash', title = 'Abrir Submenu', description = 'Abrir submenu de pruebas',
--             submenu = {
--                 name = 'submenuPruebas',
--                 title = 'Titulo del submenu',
--                 icon = 'fa-solid fa-car',
--                 options = {
--                     {
--                         title = 'Hola mundo',
--                         description = 'Hola mundo',
--                         icon = 'fa-solid fa-circle',
--                         handler = function(element)
--                             print("Hola Mundo")
--                         end
--                     }
--                 }
--             }
--         },
--     }
-- })