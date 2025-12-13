--#region Variables

local QBCore = exports['qb-core']:GetCoreObject()
local PlayerData = QBCore.Functions.GetPlayerData()
local inInventory = false
local currentWeapon = nil
local currentOtherInventory = nil
local Drops = {}
local CurrentDrop = nil
local DropsNear = {}
local CurrentVehicle = nil
local CurrentGlovebox = nil
local CurrentStash = nil
local isCrafting = false
local isHotbar = false

--#endregion Variables

--#region Functions

---Checks if you have an item or not
---@param items string | string[] | table<string, number> The items to check, either a string, array of strings or a key-value table of a string and number with the string representing the name of the item and the number representing the amount
---@param amount? number The amount of the item to check for, this will only have effect when items is a string or an array of strings
---@return boolean success Returns true if the player has the item
local function HasItem(items, amount)
    local isTable = type(items) == 'table'
    local isArray = isTable and table.type(items) == 'array' or false
    local totalItems = #items
    local count = 0
    local kvIndex = 2
    if isTable and not isArray then
        totalItems = 0
        for _ in pairs(items) do totalItems += 1 end
        kvIndex = 1
    end
    for _, itemData in pairs(PlayerData.items) do
        if isTable then
            for k, v in pairs(items) do
                local itemKV = { k, v }
                if itemData and itemData.name == itemKV[kvIndex] and ((amount and itemData.amount >= amount) or (not isArray and itemData.amount >= v) or (not amount and isArray)) then
                    count += 1
                end
            end
            if count == totalItems then
                return true
            end
        else -- Single item as string
            if itemData and itemData.name == items and (not amount or (itemData and amount and itemData.amount >= amount)) then
                return true
            end
        end
    end
    return false
end

exports('HasItem', HasItem)

---Gets the closest vending machine object to the client
---@return integer closestVendingMachine
local function GetClosestVending()
    local ped = PlayerPedId()
    local pos = GetEntityCoords(ped)
    local object = nil
    for _, machine in pairs(Config.VendingObjects) do
        local ClosestObject = GetClosestObjectOfType(pos.x, pos.y, pos.z, 0.75, joaat(machine), false, false, false)
        if ClosestObject ~= 0 then
            if object == nil then
                object = ClosestObject
            end
        end
    end
    return object
end

---Opens the vending machine shop
local function OpenVending()
    local ShopItems = {}
    ShopItems.label = 'Vending Machine'
    ShopItems.items = Config.VendingItem
    ShopItems.slots = #Config.VendingItem
    TriggerServerEvent('inventory:server:OpenInventory', 'shop', 'Vendingshop_' .. math.random(1, 99), ShopItems)
end

---Draws 3d text in the world on the given position
---@param x number The x coord of the text to draw
---@param y number The y coord of the text to draw
---@param z number The z coord of the text to draw
---@param text string The text to display
local function DrawText3Ds(x, y, z, text)
    SetTextScale(0.35, 0.35)
    SetTextFont(4)
    SetTextProportional(1)
    SetTextColour(255, 255, 255, 215)
    SetTextEntry('STRING')
    SetTextCentre(true)
    AddTextComponentString(text)
    SetDrawOrigin(x, y, z, 0)
    DrawText(0.0, 0.0)
    local factor = string.len(text) / 370
    DrawRect(0.0, 0.0125, 0.017 + factor, 0.03, 0, 0, 0, 75)
    ClearDrawOrigin()
end

---Load an animation dictionary before playing an animation from it
---@param dict string Animation dictionary to load
local function LoadAnimDict(dict)
    if HasAnimDictLoaded(dict) then return end

    RequestAnimDict(dict)
    while not HasAnimDictLoaded(dict) do
        Wait(10)
    end
end

---Returns a formatted attachments table from item data
---@param itemdata table Data of an item
---@return table attachments
local function FormatWeaponAttachments(itemdata)
    if not itemdata.info or not itemdata.info.attachments or #itemdata.info.attachments == 0 then
        return {}
    end
    local attachments = {}
    local weaponName = itemdata.name:upper()
    local WeaponAttachments = exports['qb-weapons']:getConfigWeaponAttachments(weaponName)
    if not WeaponAttachments then return {} end
    for attachmentType, weapons in pairs(WeaponAttachments) do
        local componentHash = weapons.component
        if componentHash then
            for _, attachmentData in pairs(itemdata.info.attachments) do
                if attachmentData.component == componentHash then
                    local label = QBCore.Shared.Items[attachmentData.item] and QBCore.Shared.Items[attachmentData.item].label or 'Unknown'
                    attachments[#attachments + 1] = {
                        attachment = attachmentType,
                        label = label
                    }
                end
            end
        end
    end
    return attachments
end

---Checks if the vehicle's engine is at the back or not
---@param vehModel integer The model hash of the vehicle
---@return boolean isBackEngine
local function IsBackEngine(vehModel)
    return BackEngineVehicles[vehModel]
end

---Opens the trunk of the closest vehicle
local function OpenTrunk()
    local vehicle = QBCore.Functions.GetClosestVehicle()
    LoadAnimDict('amb@prop_human_bum_bin@idle_b')
    TaskPlayAnim(PlayerPedId(), 'amb@prop_human_bum_bin@idle_b', 'idle_d', 4.0, 4.0, -1, 50, 0, false, false, false)
    if IsBackEngine(GetEntityModel(vehicle)) then
        SetVehicleDoorOpen(vehicle, 4, false, false)
    else
        SetVehicleDoorOpen(vehicle, 5, false, false)
    end
end

---Closes the trunk of the closest vehicle
local function CloseTrunk()
    local vehicle = QBCore.Functions.GetClosestVehicle()
    LoadAnimDict('amb@prop_human_bum_bin@idle_b')
    TaskPlayAnim(PlayerPedId(), 'amb@prop_human_bum_bin@idle_b', 'exit', 4.0, 4.0, -1, 50, 0, false, false, false)
    if IsBackEngine(GetEntityModel(vehicle)) then
        SetVehicleDoorShut(vehicle, 4, false)
    else
        SetVehicleDoorShut(vehicle, 5, false)
    end
end
---Checks weight and size of the vehicle trunk
local function GetTrunkSize(vehicleClass)
    local trunkSize = Config.TrunkSpace[vehicleClass] or Config.TrunkSpace['default']
    return trunkSize[vehicleClass].maxweight, trunkSize[vehicleClass].slots
end
exports('GetTrunkSize', GetTrunkSize)

---Closes the inventory NUI
local function closeInventory()
    SendNUIMessage({
        action = 'close',
    })
end

---Toggles the hotbar of the inventory
---@param toggle boolean If this is true, the hotbar will open
local function ToggleHotbar(toggle)
    local HotbarItems = {
        [1] = PlayerData.items[1],
        [2] = PlayerData.items[2],
        [3] = PlayerData.items[3],
        [4] = PlayerData.items[4],
        [5] = PlayerData.items[5],
        [41] = PlayerData.items[41],
    }

    SendNUIMessage({
        action = 'toggleHotbar',
        open = toggle,
        items = HotbarItems
    })
end

local function ItemsToItemInfo()
    local items = {}
    for i = 1, #Config.CraftingItems do
        local craftingItem = Config.CraftingItems[i]
        local itemInfo = QBCore.Shared.Items[craftingItem.name:lower()]
        if itemInfo then
            local itemCost = {}
            for material, amount in pairs(craftingItem.costs) do
                local materialInfo = QBCore.Shared.Items[material:lower()]
                if materialInfo then
                    itemCost[#itemCost + 1] = materialInfo.label .. ': ' .. amount .. 'x'
                end
            end
            local itemCostString = table.concat(itemCost, ', ')
            items[i] = {
                name = itemInfo.name,
                amount = tonumber(craftingItem.amount),
                info = { costs = itemCostString },
                label = itemInfo.label,
                description = itemInfo.description or '',
                weight = itemInfo.weight,
                type = itemInfo.type,
                unique = itemInfo.unique,
                useable = itemInfo.useable,
                image = itemInfo.image,
                slot = i,
                costs = craftingItem.costs,
                threshold = craftingItem.threshold,
                points = craftingItem.points,
            }
        end
    end
    Config.CraftingItems = items
end

local function SetupAttachmentItemsInfo()
    local items = {}
    for i = 1, #Config.AttachmentCrafting do
        local attachmentItem = Config.AttachmentCrafting[i]
        local itemInfo = QBCore.Shared.Items[attachmentItem.name:lower()]
        if itemInfo then
            local itemCost = {}
            for material, amount in pairs(attachmentItem.costs) do
                local materialInfo = QBCore.Shared.Items[material:lower()]
                if materialInfo then
                    itemCost[#itemCost + 1] = materialInfo.label .. ': ' .. amount .. 'x'
                end
            end
            local itemCostString = table.concat(itemCost, ', ')
            items[i] = {
                name = itemInfo.name,
                amount = tonumber(attachmentItem.amount),
                info = { costs = itemCostString },
                label = itemInfo.label,
                description = itemInfo.description or '',
                weight = itemInfo.weight,
                type = itemInfo.type,
                unique = itemInfo.unique,
                useable = itemInfo.useable,
                image = itemInfo.image,
                slot = i,
                costs = attachmentItem.costs,
                threshold = attachmentItem.threshold,
                points = attachmentItem.points,
            }
        end
    end
    Config.AttachmentCrafting = items
end

---Runs ItemsToItemInfo() and checks if the client has enough reputation to support the threshold, otherwise the items is not available to craft for the client
---@return table items
local function GetThresholdItems()
    ItemsToItemInfo()
    local items = {}
    for i = 1, #Config.CraftingItems do
        if PlayerData.metadata['craftingrep'] >= Config.CraftingItems[i].threshold then
            items[i] = Config.CraftingItems[i]
        end
    end
    return items
end

---Runs SetupAttachmentItemsInfo() and checks if the client has enough reputation to support the threshold, otherwise the items is not available to craft for the client
---@return table items
local function GetAttachmentThresholdItems()
    SetupAttachmentItemsInfo()
    local items = {}
    for i = 1, #Config.AttachmentCrafting do
        if PlayerData.metadata['attachmentcraftingrep'] >= Config.AttachmentCrafting[i].threshold then
            items[i] = Config.AttachmentCrafting[i]
        end
    end
    return items
end

---Removes drops in the area of the client
---@param index integer The drop id to remove
local function RemoveNearbyDrop(index)
    if not DropsNear[index] then return end

    local dropItem = DropsNear[index].object
    if DoesEntityExist(dropItem) then
        DeleteEntity(dropItem)
    end

    DropsNear[index] = nil

    if not Drops[index] then return end

    Drops[index].object = nil
    Drops[index].isDropShowing = nil
end

---Removes all drops in the area of the client
local function RemoveAllNearbyDrops()
    for k in pairs(DropsNear) do
        RemoveNearbyDrop(k)
    end
end

---Creates a new item drop object on the ground
---@param index integer The drop id to save the object in
local function CreateItemDrop(index)
    local dropItem = CreateObject(Config.ItemDropObject, DropsNear[index].coords.x, DropsNear[index].coords.y, DropsNear[index].coords.z, false, false, false)
    DropsNear[index].object = dropItem
    DropsNear[index].isDropShowing = true
    PlaceObjectOnGroundProperly(dropItem)
    FreezeEntityPosition(dropItem, true)
    if Config.UseTarget then
        exports['qb-target']:AddTargetEntity(dropItem, {
            options = {
                {
                    icon = 'fas fa-backpack',
                    label = Lang:t('menu.o_bag'),
                    action = function()
                        TriggerServerEvent('inventory:server:OpenInventory', 'drop', index)
                    end,
                }
            },
            distance = 2.5,
        })
    end
end

--#endregion Functions

--#region Events

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    LocalPlayer.state:set('inv_busy', false, true)
    PlayerData = QBCore.Functions.GetPlayerData()
    QBCore.Functions.TriggerCallback('inventory:server:GetCurrentDrops', function(theDrops)
        Drops = theDrops
    end)
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    LocalPlayer.state:set('inv_busy', true, true)
    PlayerData = {}
    RemoveAllNearbyDrops()
end)

RegisterNetEvent('QBCore:Client:UpdateObject', function()
    QBCore = exports['qb-core']:GetCoreObject()
end)

RegisterNetEvent('QBCore:Player:SetPlayerData', function(val)
    PlayerData = val
end)

AddEventHandler('onResourceStop', function(name)
    if name ~= GetCurrentResourceName() then return end
    if Config.UseItemDrop then RemoveAllNearbyDrops() end
end)

RegisterNetEvent('qb-inventory:client:closeinv', function()
    closeInventory()
end)

RegisterNetEvent('inventory:client:CheckOpenState', function(type, id, label)
    local name = QBCore.Shared.SplitStr(label, '-')[2]
    if type == 'stash' then
        if name ~= CurrentStash or CurrentStash == nil then
            TriggerServerEvent('inventory:server:SetIsOpenState', false, type, id)
        end
    elseif type == 'trunk' then
        if name ~= CurrentVehicle or CurrentVehicle == nil then
            TriggerServerEvent('inventory:server:SetIsOpenState', false, type, id)
        end
    elseif type == 'glovebox' then
        if name ~= CurrentGlovebox or CurrentGlovebox == nil then
            TriggerServerEvent('inventory:server:SetIsOpenState', false, type, id)
        end
    elseif type == 'drop' then
        if name ~= CurrentDrop or CurrentDrop == nil then
            TriggerServerEvent('inventory:server:SetIsOpenState', false, type, id)
        end
    end
end)

RegisterNetEvent('inventory:client:ItemBox', function(itemData, type, amount)
    SendNUIMessage({
        action = "itemBox",
        item = itemData,
        type = type,
        amount = amount or 1
    })
end)

RegisterNetEvent('inventory:client:requiredItems', function(items, bool)
    local itemTable = {}
    if bool then
        for k in pairs(items) do
            itemTable[#itemTable + 1] = {
                item = items[k].name,
                label = QBCore.Shared.Items[items[k].name]['label'],
                image = items[k].image,
            }
        end
    end

    SendNUIMessage({
        action = 'requiredItem',
        items = itemTable,
        toggle = bool
    })
end)

RegisterNetEvent('inventory:server:RobPlayer', function(TargetId)
    SendNUIMessage({
        action = 'RobMoney',
        TargetId = TargetId,
    })
end)

RegisterNetEvent('inventory:client:OpenInventory', function(PlayerAmmo, inventory, other)
    if not IsEntityDead(PlayerPedId()) then
        ToggleHotbar(false)
        SetNuiFocus(true, true)
        SetNuiFocusKeepInput(true)
        if other then
            currentOtherInventory = other.name
        end
        QBCore.Functions.TriggerCallback('inventory:server:ConvertQuality', function(data)
            inventory = data.inventory
            other = data.other
            SendNUIMessage({
                action = "open",
                inventory = inventory,
                slots = Config.MaxInventorySlots,
                other = other,
                maxweight = Config.MaxInventoryWeight,
                Ammo = PlayerAmmo,
                maxammo = Config.MaximumAmmoValues,
            })
            inInventory = true
            CreateThread(function()
                while inInventory do
                    DisableDisplayControlActions()
                    Wait(1)
                end
            end)
        end,inventory,other)
    end
end)

RegisterNetEvent('inventory:client:UpdatePlayerInventory', function(isError)
    SendNUIMessage({
        action = 'update',
        inventory = PlayerData.items,
        maxweight = Config.MaxInventoryWeight,
        slots = Config.MaxInventorySlots,
        error = isError,
    })
end)

RegisterNetEvent('inventory:client:CraftItems', function(itemName, itemCosts, amount, toSlot, points)
    local ped = PlayerPedId()
    SendNUIMessage({
        action = 'close',
    })
    isCrafting = true
    QBCore.Functions.Progressbar('repair_vehicle', Lang:t('progress.crafting'), (math.random(2000, 5000) * amount), false, true, {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {
        animDict = 'mini@repair',
        anim = 'fixing_a_player',
        flags = 16,
    }, {}, {}, function() -- Done
        StopAnimTask(ped, 'mini@repair', 'fixing_a_player', 1.0)
        TriggerServerEvent('inventory:server:CraftItems', itemName, itemCosts, amount, toSlot, points)
        TriggerEvent('inventory:client:ItemBox', QBCore.Shared.Items[itemName], 'add')
        isCrafting = false
    end, function() -- Cancel
        StopAnimTask(ped, 'mini@repair', 'fixing_a_player', 1.0)
        QBCore.Functions.Notify(Lang:t('notify.failed'), 'error')
        isCrafting = false
    end)
end)

RegisterNetEvent('inventory:client:CraftAttachment', function(itemName, itemCosts, amount, toSlot, points)
    local ped = PlayerPedId()
    SendNUIMessage({
        action = 'close',
    })
    isCrafting = true
    QBCore.Functions.Progressbar('repair_vehicle', Lang:t('progress.crafting'), (math.random(2000, 5000) * amount), false, true, {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {
        animDict = 'mini@repair',
        anim = 'fixing_a_player',
        flags = 16,
    }, {}, {}, function() -- Done
        StopAnimTask(ped, 'mini@repair', 'fixing_a_player', 1.0)
        TriggerServerEvent('inventory:server:CraftAttachment', itemName, itemCosts, amount, toSlot, points)
        TriggerEvent('inventory:client:ItemBox', QBCore.Shared.Items[itemName], 'add')
        isCrafting = false
    end, function() -- Cancel
        StopAnimTask(ped, 'mini@repair', 'fixing_a_player', 1.0)
        QBCore.Functions.Notify(Lang:t('notify.failed'), 'error')
        isCrafting = false
    end)
end)

RegisterNetEvent('inventory:client:PickupSnowballs', function()
    local ped = PlayerPedId()
    LoadAnimDict('anim@mp_snowball')
    TaskPlayAnim(ped, 'anim@mp_snowball', 'pickup_snowball', 3.0, 3.0, -1, 0, 1, 0, 0, 0)
    QBCore.Functions.Progressbar('pickupsnowball', Lang:t('progress.snowballs'), 1500, false, true, {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {}, {}, {}, function() -- Done
        ClearPedTasks(ped)
        TriggerServerEvent('inventory:server:snowball', 'add')
        TriggerEvent('inventory:client:ItemBox', QBCore.Shared.Items['snowball'], 'add')
    end, function() -- Cancel
        ClearPedTasks(ped)
        QBCore.Functions.Notify(Lang:t('notify.canceled'), 'error')
    end)
end)

RegisterNetEvent('inventory:client:UseWeapon', function(weaponData, shootbool)
    local ped = PlayerPedId()
    local weaponName = tostring(weaponData.name)
    local weaponHash = joaat(weaponData.name)
    if currentWeapon == weaponName then
        TriggerEvent('weapons:client:DrawWeapon', nil)
        SetCurrentPedWeapon(ped, `WEAPON_UNARMED`, true)
        RemoveAllPedWeapons(ped, true)
        TriggerEvent('weapons:client:SetCurrentWeapon', nil, shootbool)
        currentWeapon = nil
    elseif weaponName == 'weapon_stickybomb' or weaponName == 'weapon_pipebomb' or weaponName == 'weapon_smokegrenade' or weaponName == 'weapon_flare' or weaponName == 'weapon_proxmine' or weaponName == 'weapon_ball' or weaponName == 'weapon_molotov' or weaponName == 'weapon_grenade' or weaponName == 'weapon_bzgas' then
        TriggerEvent('weapons:client:DrawWeapon', weaponName)
        GiveWeaponToPed(ped, weaponHash, 1, false, false)
        SetPedAmmo(ped, weaponHash, 1)
        SetCurrentPedWeapon(ped, weaponHash, true)
        TriggerEvent('weapons:client:SetCurrentWeapon', weaponData, shootbool)
        currentWeapon = weaponName
    elseif weaponName == 'weapon_snowball' then
        TriggerEvent('weapons:client:DrawWeapon', weaponName)
        GiveWeaponToPed(ped, weaponHash, 10, false, false)
        SetPedAmmo(ped, weaponHash, 10)
        SetCurrentPedWeapon(ped, weaponHash, true)
        TriggerServerEvent('inventory:server:snowball', 'remove')
        TriggerEvent('weapons:client:SetCurrentWeapon', weaponData, shootbool)
        currentWeapon = weaponName
    else
        TriggerEvent('weapons:client:DrawWeapon', weaponName)
        TriggerEvent('weapons:client:SetCurrentWeapon', weaponData, shootbool)
        local ammo = tonumber(weaponData.info.ammo) or 0

        if weaponName == 'weapon_petrolcan' or weaponName == 'weapon_fireextinguisher' then
            ammo = 4000
        end

        GiveWeaponToPed(ped, weaponHash, ammo, false, false)
        SetPedAmmo(ped, weaponHash, ammo)
        SetCurrentPedWeapon(ped, weaponHash, true)

        if weaponData.info.attachments then
            for _, attachment in pairs(weaponData.info.attachments) do
                GiveWeaponComponentToPed(ped, weaponHash, joaat(attachment.component))
            end
        end

        if weaponData.info.tint then
            SetPedWeaponTintIndex(ped, weaponHash, weaponData.info.tint)
        end

        currentWeapon = weaponName
    end
end)

RegisterNetEvent('inventory:client:CheckWeapon', function(weaponName)
    if currentWeapon ~= weaponName:lower() then return end
    local ped = PlayerPedId()
    TriggerEvent('weapons:ResetHolster')
    SetCurrentPedWeapon(ped, `WEAPON_UNARMED`, true)
    RemoveAllPedWeapons(ped, true)
    currentWeapon = nil
end)

-- This needs to be changed to do a raycast so items arent placed in walls
RegisterNetEvent('inventory:client:AddDropItem', function(dropId, player, coords)
    local forward = GetEntityForwardVector(GetPlayerPed(GetPlayerFromServerId(player)))
    local x, y, z = table.unpack(coords + forward * 0.5)
    Drops[dropId] = {
        id = dropId,
        coords = {
            x = x,
            y = y,
            z = z - 0.3,
        },
    }
end)

RegisterNetEvent('inventory:client:RemoveDropItem', function(dropId)
    Drops[dropId] = nil
    if Config.UseItemDrop then
        RemoveNearbyDrop(dropId)
    else
        DropsNear[dropId] = nil
    end
end)

RegisterNetEvent('inventory:client:DropItemAnim', function()
    local ped = PlayerPedId()
    SendNUIMessage({
        action = 'close',
    })
    LoadAnimDict('pickup_object')
    TaskPlayAnim(ped, 'pickup_object', 'pickup_low', 8.0, -8.0, -1, 1, 0, false, false, false)
    Wait(2000)
    ClearPedTasks(ped)
end)

RegisterNetEvent('inventory:client:SetCurrentStash', function(stash)
    CurrentStash = stash
end)

RegisterNetEvent('qb-inventory:client:giveAnim', function()
    if IsPedInAnyVehicle(PlayerPedId(), false) then
        return
    else
        LoadAnimDict('mp_common')
        TaskPlayAnim(PlayerPedId(), 'mp_common', 'givetake1_b', 8.0, 1.0, -1, 16, 0, 0, 0, 0)
    end
end)

RegisterNetEvent('inventory:client:craftTarget', function()
    local crafting = {}
    crafting.label = Lang:t('label.craft')
    crafting.items = GetThresholdItems()
    TriggerServerEvent('inventory:server:OpenInventory', 'crafting', math.random(1, 99), crafting)
end)

--#endregion Events

--#region Commands

RegisterCommand('closeinv', function()
    closeInventory()
end, false)

RegisterCommand('JulirooOpenInventory', function()
    local IsInPaintball = exports['biyei_arenas']:inGameStatus()
    if IsInPaintball then
        QBCore.Functions.Notify("No se pudo completar esta acción", 'error')
        return
    end
    if IsNuiFocused() then return end
    if not isCrafting and not inInventory then
        if not PlayerData.metadata['isdead'] and not PlayerData.metadata['inlaststand'] and not PlayerData.metadata['ishandcuffed'] and not IsPauseMenuActive() then
            local ped = PlayerPedId()
            local curVeh = nil
            local VendingMachine = nil
            if not Config.UseTarget then VendingMachine = GetClosestVending() end

            if IsPedInAnyVehicle(ped, false) then -- Is Player In Vehicle
                local vehicle = GetVehiclePedIsIn(ped, false)
                CurrentGlovebox = QBCore.Functions.GetPlate(vehicle)
                curVeh = vehicle
                CurrentVehicle = nil
            else
                local vehicle = QBCore.Functions.GetClosestVehicle()
                if vehicle ~= 0 and vehicle ~= nil then
                    local pos = GetEntityCoords(ped)
                    local dimensionMin, dimensionMax = GetModelDimensions(GetEntityModel(vehicle))
                    local trunkpos = GetOffsetFromEntityInWorldCoords(vehicle, 0.0, (dimensionMin.y), 0.0)
                    if (IsBackEngine(GetEntityModel(vehicle))) then
                        trunkpos = GetOffsetFromEntityInWorldCoords(vehicle, 0.0, (dimensionMax.y), 0.0)
                    end
                    if #(pos - trunkpos) < 1.5 and not IsPedInAnyVehicle(ped) then
                        if GetVehicleDoorLockStatus(vehicle) < 2 then
                            CurrentVehicle = QBCore.Functions.GetPlate(vehicle)
                            curVeh = vehicle
                            CurrentGlovebox = nil
                        else
                            QBCore.Functions.Notify("Acción bloqueada", 'error')
                            return
                        end
                    else
                        CurrentVehicle = nil
                    end
                else
                    CurrentVehicle = nil
                end
            end

            if CurrentVehicle then -- Trunk
                local vehicleClass = GetVehicleClass(curVeh)
                local trunkConfig = Config.TrunkSpace[vehicleClass] or Config.TrunkSpace['default']
                if not trunkConfig then return print('Cannot get the vehicle trunk config') end
                local slots = trunkConfig.slots
                local maxweight = trunkConfig.maxWeight
                if not slots or not maxweight then return print('Cannot get the vehicle slots and maxweight') end

                local other = {
                    maxweight = maxweight,
                    slots = slots,
                }

                TriggerServerEvent('inventory:server:OpenInventory', 'trunk', CurrentVehicle, other)
                OpenTrunk()
            elseif CurrentGlovebox then
                TriggerServerEvent('inventory:server:OpenInventory', 'glovebox', CurrentGlovebox)
            elseif CurrentDrop ~= 0 then
                TriggerServerEvent('inventory:server:OpenInventory', 'drop', CurrentDrop)
            else
                TriggerServerEvent('inventory:server:OpenInventory')
            end
        end
    end
end, false)

RegisterKeyMapping('JulirooOpenInventory', Lang:t('inf_mapping.opn_inv'), 'keyboard', 'F2')

RegisterCommand('Juliroohotbar', function()
    isHotbar = not isHotbar
    if not PlayerData.metadata['isdead'] and not PlayerData.metadata['inlaststand'] and not PlayerData.metadata['ishandcuffed'] and not IsPauseMenuActive() then
        ToggleHotbar(isHotbar)
    end
end, false)

RegisterKeyMapping('Juliroohotbar', Lang:t('inf_mapping.tog_slots'), 'keyboard', 'TAB')

for i = 1, 6 do
    RegisterCommand('Julirooslot' .. i, function()
        if not inInventory and not PlayerData.metadata['isdead'] and not PlayerData.metadata['inlaststand'] and not PlayerData.metadata['ishandcuffed'] and not IsPauseMenuActive() and not LocalPlayer.state.inv_busy then
            if i == 6 then
                i = Config.MaxInventorySlots
            end
            TriggerServerEvent('inventory:server:UseItemSlot', i)
            closeInventory()
        end
    end, false)
    RegisterKeyMapping('Julirooslot' .. i, Lang:t('inf_mapping.use_item') .. i, 'keyboard', i)
end

--#endregion Commands

--#region NUI

RegisterNUICallback('RobMoney', function(data, cb)
    TriggerServerEvent('police:server:RobPlayer', data.TargetId)
    cb('ok')
end)

RegisterNUICallback('Notify', function(data, cb)
    QBCore.Functions.Notify(data.message, data.type)
    cb('ok')
end)

RegisterNUICallback('GetWeaponData', function(cData, cb)
    local data = {
        WeaponData = QBCore.Shared.Items[cData.weapon],
        AttachmentData = FormatWeaponAttachments(cData.ItemData)
    }
    cb(data)
end)

RegisterNUICallback('RemoveAttachment', function(data, cb)
    closeInventory()
    local ped = PlayerPedId()
    local WeaponData = data.WeaponData
    currentWeapon = WeaponData.name
    TriggerEvent("inventory:client:UseWeapon", WeaponData, false)
    local allAttachments = exports['qb-weapons']:getConfigWeaponAttachments(WeaponData.name:upper())
    local Attachment = allAttachments[data.AttachmentData.attachment]

    QBCore.Functions.TriggerCallback('weapons:server:RemoveAttachment', function(NewAttachments)
        if NewAttachments ~= false then
            local Attachies = {}
            RemoveWeaponComponentFromPed(ped, joaat(WeaponData.name), joaat(Attachment))

            for _, v in pairs(NewAttachments) do
                for attachmentType, weapons in pairs(allAttachments) do
                    local componentHash = weapons.component
                    if componentHash and v.component == componentHash then
                        local label = QBCore.Shared.Items[weapons.item] and QBCore.Shared.Items[weapons.item].label or 'Unknown'
                        Attachies[#Attachies + 1] = {
                            attachment = attachmentType,
                            label = label,
                        }
                    end
                end
            end
            local DJATA = {
                Attachments = Attachies,
                WeaponData = WeaponData,
            }
            cb(DJATA)
        else
            RemoveWeaponComponentFromPed(ped, joaat(WeaponData.name), joaat(Attachment))
            cb({})
        end
    end, data.AttachmentData, WeaponData)
end)

RegisterNUICallback('getCombineItem', function(data, cb)
    cb(QBCore.Shared.Items[data.item])
end)

RegisterNUICallback('CloseInventory', function(_, cb)
    if currentOtherInventory == 'none-inv' then
        CurrentDrop = nil
        CurrentVehicle = nil
        CurrentGlovebox = nil
        CurrentStash = nil
        SetNuiFocus(false, false)
        SetNuiFocusKeepInput(false)
        inInventory = false
        ClearPedTasks(PlayerPedId())
        return
    end
    if CurrentVehicle ~= nil then
        CloseTrunk()
        TriggerServerEvent('inventory:server:SaveInventory', 'trunk', CurrentVehicle)
        CurrentVehicle = nil
    elseif CurrentGlovebox ~= nil then
        TriggerServerEvent('inventory:server:SaveInventory', 'glovebox', CurrentGlovebox)
        CurrentGlovebox = nil
    elseif CurrentStash ~= nil then
        TriggerServerEvent('inventory:server:SetIsOpenState', false, 'stash', CurrentStash)
        TriggerServerEvent('inventory:server:SaveInventory', 'stash', CurrentStash)
        CurrentStash = nil
    else
        TriggerServerEvent('inventory:server:SaveInventory', 'drop', CurrentDrop)
        CurrentDrop = nil
    end
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    inInventory = false
    cb('ok')
end)

RegisterNUICallback('UseItem', function(data, cb)
    TriggerServerEvent('inventory:server:UseItem', data.inventory, data.item)
    cb('ok')
end)

RegisterNUICallback('combineItem', function(data, cb)
    Wait(150)
    TriggerServerEvent('inventory:server:combineItem', data.reward, data.fromItem, data.toItem)
    cb('ok')
end)

RegisterNUICallback('combineWithAnim', function(data, cb)
    local ped = PlayerPedId()
    local combineData = data.combineData
    local aDict = combineData.anim.dict
    local aLib = combineData.anim.lib
    local animText = combineData.anim.text
    local animTimeout = combineData.anim.timeOut
    QBCore.Functions.Progressbar('combine_anim', animText, animTimeout, false, true, {
        disableMovement = false,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {
        animDict = aDict,
        anim = aLib,
        flags = 16,
    }, {}, {}, function() -- Done
        StopAnimTask(ped, aDict, aLib, 1.0)
        TriggerServerEvent('inventory:server:combineItem', combineData.reward, data.requiredItem, data.usedItem)
    end, function() -- Cancel
        StopAnimTask(ped, aDict, aLib, 1.0)
        QBCore.Functions.Notify(Lang:t('notify.failed'), 'error')
    end)
    cb('ok')
end)

RegisterNUICallback('SetInventoryData', function(data, cb)
    TriggerServerEvent('inventory:server:SetInventoryData', data.fromInventory, data.toInventory, data.fromSlot, data.toSlot, data.fromAmount, data.toAmount)
    cb('ok')
end)

RegisterNUICallback('PlayDropSound', function(_, cb)
    PlaySound(-1, 'CLICK_BACK', 'WEB_NAVIGATION_SOUNDS_PHONE', 0, 0, 1)
    cb('ok')
end)

RegisterNUICallback('PlayDropFail', function(_, cb)
    PlaySound(-1, 'Place_Prop_Fail', 'DLC_Dmod_Prop_Editor_Sounds', 0, 0, 1)
    cb('ok')
end)

RegisterNUICallback('GiveItem', function(data, cb)
    local player, distance = QBCore.Functions.GetClosestPlayer(GetEntityCoords(PlayerPedId()))
    if player ~= -1 and distance < 3 then
        if data.inventory == 'player' then
            local playerId = GetPlayerServerId(player)
            SetCurrentPedWeapon(PlayerPedId(), 'WEAPON_UNARMED', true)
            TriggerServerEvent('inventory:server:GiveItem', playerId, data.item.name, data.amount, data.item.slot)
        else
            QBCore.Functions.Notify(Lang:t('notify.notowned'), 'error')
        end
    else
        QBCore.Functions.Notify(Lang:t('notify.nonb'), 'error')
    end
    cb('ok')
end)

--#endregion NUI

--#region Threads

CreateThread(function()
    while true do
        local sleep = 100
        if DropsNear ~= nil then
            local ped = PlayerPedId()
            local closestDrop = nil
            local closestDistance = nil
            for k, v in pairs(DropsNear) do
                if DropsNear[k] ~= nil then
                    if Config.UseItemDrop then
                        if not v.isDropShowing then
                            CreateItemDrop(k)
                        end
                    else
                        sleep = 0
                        DrawMarker(20, v.coords.x, v.coords.y, v.coords.z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.3, 0.15, 120, 10, 20, 155, false, false, false, 1, false, false, false)
                    end

                    local coords = (v.object ~= nil and GetEntityCoords(v.object)) or vector3(v.coords.x, v.coords.y, v.coords.z)
                    local distance = #(GetEntityCoords(ped) - coords)
                    if distance < 2 and (not closestDistance or distance < closestDistance) then
                        closestDrop = k
                        closestDistance = distance
                    end
                end
            end


            if not closestDrop then
                CurrentDrop = 0
            else
                CurrentDrop = closestDrop
            end
        end
        Wait(sleep)
    end
end)

CreateThread(function()
    while true do
        if Drops ~= nil and next(Drops) ~= nil then
            local pos = GetEntityCoords(PlayerPedId(), true)
            for k, v in pairs(Drops) do
                if Drops[k] ~= nil then
                    local dist = #(pos - vector3(v.coords.x, v.coords.y, v.coords.z))
                    if dist < Config.MaxDropViewDistance then
                        DropsNear[k] = v
                    else
                        if Config.UseItemDrop and DropsNear[k] then
                            RemoveNearbyDrop(k)
                        else
                            DropsNear[k] = nil
                        end
                    end
                end
            end
        else
            DropsNear = {}
        end
        Wait(500)
    end
end)

-- CreateThread(function()
--     if Config.UseTarget then
--         exports['qb-target']:AddTargetModel(Config.VendingObjects, {
--             options = {
--                 {
--                     icon = 'fa-solid fa-cash-register',
--                     label = Lang:t('menu.vending'),
--                     action = function()
--                         OpenVending()
--                     end
--                 },
--             },
--             distance = 2.5
--         })
--     end
-- end)

-- CreateThread(function()
--     if Config.UseTarget then
--         exports['qb-target']:AddTargetModel(Config.CraftingObject, {
--             options = {
--                 {
--                     event = 'inventory:client:craftTarget',
--                     icon = 'fas fa-tools',
--                     label = Lang:t('menu.craft'),
--                 },
--             },
--             distance = 2.5,
--         })
--     else
--         while true do
--             local sleep = 1000
--             if LocalPlayer.state['isLoggedIn'] then
--                 local pos = GetEntityCoords(PlayerPedId())
--                 local craftObject = GetClosestObjectOfType(pos, 2.0, Config.CraftingObject, false, false, false)
--                 if craftObject ~= 0 then
--                     local objectPos = GetEntityCoords(craftObject)
--                     if #(pos - objectPos) < 1.5 then
--                         sleep = 0
--                         DrawText3Ds(objectPos.x, objectPos.y, objectPos.z + 1.0, Lang:t('interaction.craft'))
--                         if IsControlJustReleased(0, 38) then
--                             local crafting = {}
--                             crafting.label = Lang:t('label.craft')
--                             crafting.items = GetThresholdItems()
--                             TriggerServerEvent('inventory:server:OpenInventory', 'crafting', math.random(1, 99), crafting)
--                             sleep = 100
--                         end
--                     end
--                 end
--             end
--             Wait(sleep)
--         end
--     end
-- end)

-- CreateThread(function()
--     while true do
--         local sleep = 1000
--         if LocalPlayer.state['isLoggedIn'] then
--             local pos = GetEntityCoords(PlayerPedId())
--             local distance = #(pos - Config.AttachmentCraftingLocation)
--             if distance < 10 then
--                 if distance < 1.5 then
--                     sleep = 0
--                     DrawText3Ds(Config.AttachmentCraftingLocation.x, Config.AttachmentCraftingLocation.y, Config.AttachmentCraftingLocation.z, Lang:t('interaction.craft'))
--                     if IsControlJustPressed(0, 38) then
--                         local crafting = {}
--                         crafting.label = Lang:t('label.a_craft')
--                         crafting.items = GetAttachmentThresholdItems()
--                         TriggerServerEvent('inventory:server:OpenInventory', 'attachment_crafting', math.random(1, 99), crafting)
--                         sleep = 100
--                     end
--                 end
--             end
--         end
--         Wait(sleep)
--     end
-- end)

--#endregion Threads

function DisableDisplayControlActions()
    -- DisableAllControlActions(0)
    -- DisableAllControlActions(1)
    -- DisableAllControlActions(2)
    
                DisableControlAction(0, 1, true) -- Movimiento Ratón
                DisableControlAction(0, 2, true) -- Movimiento Ratón
                DisableControlAction(0, 3, true) -- Movimiento Ratón
                DisableControlAction(0, 4, true) -- Movimiento Ratón
                DisableControlAction(0, 5, true) -- Movimiento Ratón
                DisableControlAction(0, 6, true) -- Movimiento Ratón
                DisableControlAction(0, 288, true) -- F1
                DisableControlAction(0, 289, true) -- F2
                DisableControlAction(0, 170, true) -- F3
                DisableControlAction(0, 318, true) -- F5
                DisableControlAction(0, 167, true) -- F6
                DisableControlAction(0, 168, true) -- F7
                DisableControlAction(0, 56, true) -- F9
                DisableControlAction(0, 57, true) -- F10
                DisableControlAction(0, 344, true) -- F11
                DisableControlAction(0, 263, true) -- R
                DisableControlAction(0, 140, true) -- R
                DisableControlAction(0, 264, true) -- Q
                DisableControlAction(0, 199, true) -- P
                DisableControlAction(0, 177, true) -- ESC
                DisableControlAction(0, 200, true) -- ESC
                DisableControlAction(0, 202, true) -- ESC
                DisableControlAction(0, 322, true) -- ESC
                DisableControlAction(0, 245, true) -- T
                DisableControlAction(0, 37, true) -- TAB
                DisableControlAction(0, 261, true) -- Rueda Ratón
                DisableControlAction(0, 262, true) -- Rueda Ratón
                DisableControlAction(0, 157, true) -- 1
                DisableControlAction(0, 158, true) -- 2
                DisableControlAction(0, 160, true) -- 3
                DisableControlAction(0, 164, true) -- 4
                DisableControlAction(0, 165, true) -- 5
                DisableControlAction(0, 25, true) -- Click Derecho
                DisableControlAction(0, 68, true) -- Click Derecho
                DisableControlAction(0, 70, true) -- Click Derecho
                DisableControlAction(0, 91, true) -- Click Derecho
                DisableControlAction(0, 225, true) -- Click Derecho
                DisableControlAction(0, 114, true) -- Click Derecho
                DisableControlAction(0, 222, true) -- Click Derecho
                DisableControlAction(0, 238, true) -- Click Derecho
                DisableControlAction(0, 330, true) -- Click Derecho
                DisableControlAction(0, 331, true) -- Click Derecho
                DisableControlAction(0, 24, true) -- Click Izquierdo
                DisableControlAction(0, 69, true) -- Click Izquierdo
                DisableControlAction(0, 92, true) -- Click Izquierdo
                DisableControlAction(0, 106, true) -- Click Izquierdo
                DisableControlAction(0, 122, true) -- Click Izquierdo
                DisableControlAction(0, 135, true) -- Click Izquierdo
                DisableControlAction(0, 142, true) -- Click Izquierdo
                DisableControlAction(0, 223, true) -- Click Izquierdo
                DisableControlAction(0, 229, true) -- Click Izquierdo
                DisableControlAction(0, 237, true) -- Click Izquierdo
                DisableControlAction(0, 257, true) -- Click Izquierdo
                DisableControlAction(0, 329, true) -- Click Izquierdo
                DisableControlAction(0, 346, true) -- Click Izquierdo
    HideHudComponentThisFrame(19)
end

RegisterNUICallback("disablecontrols", function()
    SetNuiFocusKeepInput(false)
end)

RegisterNUICallback("enablecontrols", function()
    SetNuiFocusKeepInput(true)
end)

RegisterNUICallback('updateClothingDta', function(data) 
    ExecuteCommand(data.clothIdData)
    if (data.clothIdData == "reset") then
        ExecuteCommand('fixpj')
    end 
end)

local SavedHair = {}  -- Tabla para guardar el estilo de cabello del jugador

-- Función para alternar entre el cabello actual y 0 (sin cabello)
RegisterCommand("pelo", function(source, args, rawCommand)
    local Ped = PlayerPedId()

    -- Obtener el estilo actual de cabello
    local CurrentDrawable = GetPedDrawableVariation(Ped, 2)  -- 2 es el índice para el cabello
    local CurrentTexture = GetPedTextureVariation(Ped, 2)  -- También se obtiene el tex de cabello

    -- Si ya tenemos un estilo guardado, restaurarlo
    if SavedHair[source] then
        SetPedComponentVariation(Ped, 2, SavedHair[source].Drawable, SavedHair[source].Texture, 0)
        SavedHair[source] = nil  -- Limpiar el estilo guardado
        Notify("Tu estilo de cabello ha sido restaurado.")
    else
        -- Si no tenemos un estilo guardado, guardarlo y cambiar a "0" (sin cabello)
        SavedHair[source] = {Drawable = CurrentDrawable, Texture = CurrentTexture}
        SetPedComponentVariation(Ped, 2, 0, 0, 0)  -- Ponemos el cabello a "0" (sin cabello)
        Notify("Tu estilo de pelo ha sido guardado y cambiado a sin cabello.")
    end
end, false)

-- Función de notificación (utiliza la función de notificación de QB-Core)
function Notify(text)
    TriggerEvent("qb-core:client:notify", text)
end