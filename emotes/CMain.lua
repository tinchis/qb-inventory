local QBCore = exports['qb-core']:GetCoreObject()

-- LOAD HTML TO INVENTORY
RegisterNUICallback("nuiReadyEmotes", function()
    CreateThread(function()
        while not QBCore do Wait(10) end
        QBCore.Functions.TriggerCallback("qb-inv:getEmotesHtml", function(html)
            SendNUIMessage({
                action = "emotesHTML",
                html = html
            })
        end)
    end)
end)

local insert = table.insert

---Load table functions
Load = {}

---Loads dictionary
---@param dict string
Load.Dict = function(dict)
    local timeout = false
    SetTimeout(5000, function() timeout = true end)

    repeat
        RequestAnimDict(dict)
        Wait(50)
    until HasAnimDictLoaded(dict) or timeout
end

---Loads model/prop
---@param model string
Load.Model = function(model)
    local timeout = false
    SetTimeout(5000, function() timeout = true end)

    local hashModel = GetHashKey(model)
    repeat
        RequestModel(hashModel)
        Wait(50)
    until HasModelLoaded(hashModel) or timeout
end

---Loads animset/walk
---@param walk string
Load.Walk = function(walk)
    local timeout = false
    SetTimeout(5000, function() timeout = true end)

    repeat
        RequestAnimSet(walk)
        Wait(50)
    until HasAnimSetLoaded(walk) or timeout
end

---Loads particle effects
---@param asset string
Load.Ptfx = function(asset)
    local timeout = false
    SetTimeout(5000, function() timeout = true end)

    repeat
        RequestNamedPtfxAsset(asset)
        Wait(50)
    until HasNamedPtfxAssetLoaded(asset) or timeout
end

---Creates a ptfx at location
---@param ped number
---@param prop number
---@param name string
---@param placement table
---@param rgb table
Load.PtfxCreation = function(ped, prop, name, asset, placement, rgb)
    local ptfxSpawn = ped
    if prop then
        ptfxSpawn = prop
    end
    local newPtfx = StartNetworkedParticleFxLoopedOnEntityBone(name, ptfxSpawn, placement[1] + 0.0, placement[2] + 0.0, placement[3] + 0.0, placement[4] + 0.0, placement[5] + 0.0, placement[6] + 0.0, GetEntityBoneIndexByName(name, "VFX"), placement[7] + 0.0, 0, 0, 0, 1065353216, 1065353216, 1065353216, 0)
    if newPtfx then
        SetParticleFxLoopedColour(newPtfx, rgb[1] + 0.0, rgb[2] + 0.0, rgb[3] + 0.0)
        if ped == PlayerPedId() then
            insert(Cfg.ptfxEntities, newPtfx)
        else
            Cfg.ptfxEntitiesTwo[GetPlayerServerId(NetworkGetEntityOwner(ped))] = newPtfx
        end
        Cfg.ptfxActive = true
    end
    RemoveNamedPtfxAsset(asset)
end

---Removes existing particle effects
Load.PtfxRemoval = function()
    if Cfg.ptfxEntities then
        for _, v in pairs(Cfg.ptfxEntities) do
            StopParticleFxLooped(v, false)
        end
        Cfg.ptfxEntities = {}
    end
end
local ActiveProp = nil
---Creates a prop at location
---@param ped number
---@param prop string
---@param bone number
---@param placement table
Load.PropCreation = function(ped, prop, bone, placement)
    local coords = GetEntityCoords(ped)
    local newProp = CreateObject(GetHashKey(prop), coords.x, coords.y, coords.z + 0.2, true, true, true)
    if newProp then
        AttachEntityToEntity(newProp, ped, GetPedBoneIndex(ped, bone), placement[1] + 0.0, placement[2] + 0.0, placement[3] + 0.0, placement[4] + 0.0, placement[5] + 0.0, placement[6] + 0.0, true, true, false, true, 1, true)
        insert(Cfg.propsEntities, newProp)
        Cfg.propActive = true
        ActiveProp = newProp
    end
    SetModelAsNoLongerNeeded(prop)
end

Load.PropDelete = function()
    if ActiveProp then
        DeleteEntity(ActiveProp)
        ActiveProp = nil
    end
end

---Removes props
---@param type string
Load.PropRemoval = function(type)
    if type == 'global' then
        if not Cfg.propActive then
            for _, v in pairs(GetGamePool('CObject')) do
                if IsEntityAttachedToEntity(PlayerPedId(), v) then
                    SetEntityAsMissionEntity(v, true, true)
                    DeleteObject(v)
                end
            end
        end
    else
        if Cfg.propActive then
            for _, v in pairs(Cfg.propsEntities) do
                DeleteObject(v)
            end
            Cfg.propsEntities = {}
            Cfg.propActive = false
        end
    end
end

---Gets the closest ped by raycast
---@return any
Load.GetPlayer = function()
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    local offset = GetOffsetFromEntityInWorldCoords(ped, 0.0, 1.3, 0.0)
    local rayHandle = StartShapeTestCapsule(coords.x, coords.y, coords.z, offset.x, offset.y, offset.z, 3.0, 12, ped, 7)
    local _, hit, _, _, pedResult = GetShapeTestResult(rayHandle)

    if hit and pedResult ~= 0 and IsPedAPlayer(pedResult) then
        if not IsEntityDead(pedResult) then
            return pedResult
        end
    end
    return false
end

---Sends confirmation to player
---@param target number
---@param shared string
Load.Confirmation = function(target, shared)
    QBCore.Functions.HelpNotify('~INPUT_CONTEXT~ Aceptar Solicitud\n\n~INPUT_PELELE~ Rechazar Solicitud')
    local hasResolved = false
    SetTimeout(10000, function()
        if not hasResolved then
            hasResolved = true
            TriggerServerEvent('rEmotes:resolveAnimation', target, shared, false)
        end
    end)

    CreateThread(function()
        while not hasResolved do
            if IsControlJustPressed(0, 38) then
                if not hasResolved then
                    if Cfg.animActive or Cfg.sceneActive then
                        Load.Cancel()
                    end
                    TriggerServerEvent('rEmotes:resolveAnimation', target, shared, true)
                    hasResolved = true
                end
            elseif IsControlJustPressed(0, 182) then
                if not hasResolved then
                    TriggerServerEvent('rEmotes:resolveAnimation', target, shared, false)
                    hasResolved = true
                end
            end
            Wait(5)
        end
    end)
end

---Cancels currently playing animations
Load.Cancel = function()
    if Cfg.animDisableMovement then
        Cfg.animDisableMovement = false
    end
    if Cfg.animDisableLoop then
        Cfg.animDisableLoop = false
    end

    if Cfg.animActive then
        ClearPedTasks(PlayerPedId())
        Cfg.animActive = false
    elseif Cfg.sceneActive then
        if Cfg.sceneForcedEnd then
            ClearPedTasksImmediately(PlayerPedId())
        else
            ClearPedTasks(PlayerPedId())
        end
        Cfg.sceneActive = false
    end

    if Cfg.propActive then
       Load.PropRemoval()
       Cfg.propActive = false
    end
    if Cfg.ptfxActive then
        if Cfg.ptfxOwner then
            TriggerServerEvent('rEmotes:syncRemoval')
            Cfg.ptfxOwner = false
        end
        Load.PtfxRemoval()
        Cfg.ptfxActive = false
    end
end

exports('Load', function()
    return Load
end)

---Holds Playing animation
---@class Play
Play = {}
local crouched = false
local curentWalk

---Checks for sex of ped
---@return string
local function checkSex()
    local pedModel = GetEntityModel(PlayerPedId())
    for i = 1, #Cfg.malePeds do
        if pedModel == GetHashKey(Cfg.malePeds[i]) then
            return 'male'
        end
    end
    return 'female'
end

---Notify a person with default notify
---@param message string
local function notify(message)
    SetNotificationTextEntry('STRING')
    AddTextComponentString(message)
    DrawNotification(0, 1)
end

---Plays an animation
---@param dance table
---@param particle table
---@param prop table
---@param p table Promise
Play.Animation = function(dance, particle, prop, p)
    if dance then
        if Cfg.animActive then
            Load.Cancel()
        end
        Load.Dict(dance.dict)
        if prop then
            Play.Prop(prop)
        end

        if particle then
            local nearbyPlayers = {}
            local players = GetActivePlayers()
            if #players > 1 then
                for i = 1, #players do
                    nearbyPlayers[i] = GetPlayerServerId(players[i])
                end
                Cfg.ptfxOwner = true
                TriggerServerEvent('rEmotes:syncParticles', particle, nearbyPlayers)
            else
                Play.Ptfx(PlayerPedId(), particle)
            end
        end

        local loop = 0
        local move = 1
        if Cfg.animLoop and not Cfg.animDisableLoop then
            loop = -1
        else
            if dance.duration then
                SetTimeout(dance.duration, function() Load.Cancel() end)
            else
                SetTimeout(0, function() Load.Cancel() end)
            end
        end
        if Cfg.animMovement and not Cfg.animDisableMovement then
            move = 51
        end
        TaskPlayAnim(PlayerPedId(), dance.dict, dance.anim, 1.5, 1.5, loop, move, 0, false, false, false)
        RemoveAnimDict(dance.dict)
        Cfg.animActive = true
        if p then
            p:resolve({passed = true})
        end
        return
    end
    p:reject({passed = false})
end

---Plays a scene
---@param scene table
---@param p table Promise
Play.Scene = function(scene, p)
    if scene then
        local sex = checkSex()
        if scene.sex == 'position' then
            local coords = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 0 - 0.5, -0.5);
            TaskStartScenarioAtPosition(PlayerPedId(), scene.scene, coords.x, coords.y, coords.z, GetEntityHeading(PlayerPedId()), 0, 1, false)
        else
            TaskStartScenarioInPlace(PlayerPedId(), scene.scene, 0, true)
        end
        Cfg.sceneActive = true
        p:resolve({passed = true})
        return   
    end
    p:reject({passed = false})
end

---Changes the facial expression
---@param expression table
---@param p table Promise
Play.Expression = function(expression, p)
    if expression then
        SetFacialIdleAnimOverride(PlayerPedId(), expression.expressions, 0)
        p:resolve({passed = true})
        return
    end
    p:reject({passed = false})
end

---Changes the walking anim of a ped
---@param walks table
---@param p table Promise
Play.Walk = function(walks, p)
    if walks then
        Load.Walk(walks.style)
        SetPedMovementClipset(PlayerPedId(), walks.style, 0.3)
        RemoveAnimSet(walks.style)
        curentWalk = walks.style
        SetResourceKvp('savedWalk', walks.style)
        p:resolve({passed = true})
        return
    end
    p:reject({passed = false})
end

---Creates a prop(s)
---@param props table
Play.Prop = function(props)
    if props then
        if props.prop then
            Load.Model(props.prop)
            Load.PropCreation(PlayerPedId(), props.prop, props.propBone, props.propPlacement)
        end
        if props.propTwo then
            Load.Model(props.propTwo)
            Load.PropCreation(PlayerPedId(), props.propTwo, props.propTwoBone, props.propTwoPlacement)
        end
    end
end

---Creates a particle effect
---@param ped number
---@param particles table
Play.Ptfx = function(ped, particles)
    if particles then
        Load.Ptfx(particles.asset)
        UseParticleFxAssetNextCall(particles.asset)
        local attachedProp
        for _, v in pairs(GetGamePool('CObject')) do
            if IsEntityAttachedToEntity(ped, v) then
                attachedProp = v
                break
            end
        end
        if not attachedProp and not Cfg.ptfxEntitiesTwo[NetworkGetEntityOwner(ped)] and not Cfg.ptfxOwner and ped == PlayerPedId() then
            attachedProp = Cfg.propsEntities[1] or Cfg.propsEntities[2]
        end
        Load.PtfxCreation(ped, attachedProp or nil, particles.name, particles.asset, particles.placement, particles.rgb)
    end
end

---Tries to send event to server for animation
---@param shared table
---@param p table
Play.Shared = function(shared, p)
    if shared then
        local closePed = Load.GetPlayer()
        if closePed then
            local targetId = NetworkGetEntityOwner(closePed)
            Play.Notification('info', 'Solicitud enviada a ' .. GetPlayerName(targetId))
            TriggerServerEvent('rEmotes:awaitConfirmation', GetPlayerServerId(targetId), shared)
            p:resolve({passed = true, shared = true})
        end
    end
    p:resolve({passed = false, nearby = true})
end

---Creates a notifications
---@param type string
---@param message string
Play.Notification = function(type, message)
    QBCore.Functions.Notify(message, "info")
end

---Plays shared animation if accepted
---@param shared table
---@param targetId number
---@param owner any
RegisterNetEvent('rEmotes:requestShared', function(shared, targetId, owner)
    if type(shared) == "table" and targetId then
        if Cfg.animActive or Cfg.sceneActive then
            Load.Cancel()
        end
        Wait(350)

        local targetPlayer = Load.GetPlayer()
        if targetPlayer then
            SetTimeout(shared[4] or 3000, function() Cfg.sharedActive = false end)
            Cfg.sharedActive = true
            local ped = PlayerPedId()
            if not owner then
                local targetHeading = GetEntityHeading(targetPlayer)
                local targetCoords = GetOffsetFromEntityInWorldCoords(targetPlayer, 0.0, shared[3] + 0.0, 0.0)

                SetEntityHeading(ped, targetHeading - 180.1)
                SetEntityCoordsNoOffset(ped, targetCoords.x, targetCoords.y, targetCoords.z, 0)
            end

            Load.Dict(shared[1])
            TaskPlayAnim(PlayerPedId(), shared[1], shared[2], 2.0, 2.0, shared[4] or 3000, 1, 0, false, false, false)
            RemoveAnimDict(shared[1])
        end
    end
end)

---Loads shared confirmation for target
---@param target number
---@param shared table
RegisterNetEvent('rEmotes:awaitConfirmation', function(target, shared)
    if not Cfg.sharedActive then
        Load.Confirmation(target, shared)
    else
        TriggerServerEvent('rEmotes:resolveAnimation', target, shared, false)
    end
end)

---Just notification function but for
---server to send to target
---@param type string
---@param message string
RegisterNetEvent('rEmotes:notify', function(type, message)
    Play.Notification(type, message)
end)

exports('Play', function()
    return Play
end)

RegisterNetEvent('rEmotes:syncPlayerParticles', function(syncPlayer, particle)
    local mainPed = GetPlayerPed(GetPlayerFromServerId(syncPlayer))
    if mainPed > 0 and type(particle) == "table" then
        Play.Ptfx(mainPed, particle)
    end
end)

RegisterCommand('LScrouch', function()
    local ped = PlayerPedId()
    if not IsPauseMenuActive() and not IsEntityDead(ped) and not IsPedInAnyVehicle(ped, true) then
      DisableControlAction(0, 36, true)
        if crouched == true then 
            if curentWalk then 
                ResetPedMovementClipset(ped, 0)
                RequestAnimSet(curentWalk)
                while not HasAnimSetLoaded(curentWalk) do
                    Wait(100)
                end
                SetPedMovementClipset(ped, curentWalk, 0.2)
            else
                ResetPedMovementClipset(ped, 0.25)
            end
            crouched = false 
        elseif crouched == false then
            local dist = "move_ped_crouched"

            RequestAnimSet(dist)
            while not HasAnimSetLoaded(dist) do 
                Wait(100)
            end 

            SetPedMovementClipset(ped, dist, 0.25)
            RemoveAnimSet(dist)
            crouched = true 
        end
    end
end)

RegisterKeyMapping('LScrouch', 'Agacharse', 'keyboard', 'LCONTROL')

RegisterNetEvent('rEmotes:syncRemoval', function(syncPlayer)
    local targetParticles = Cfg.ptfxEntitiesTwo[tonumber(syncPlayer)]
    if targetParticles then
        StopParticleFxLooped(targetParticles, false)
        Cfg.ptfxEntitiesTwo[syncPlayer] = nil
    end
end)


function OnEmotePlay(EmoteName)

    InVehicle = IsPedInAnyVehicle(PlayerPedId(), true)
    if not true and InVehicle == 1 then
      return
    end
  
    if not DoesEntityExist(PlayerPedId()) then
      return false
    end
  
    if false then
      if IsPedArmed(PlayerPedId(), 7) then
        SetCurrentPedWeapon(PlayerPedId(), GetHashKey('WEAPON_UNARMED'), true)
      end
    end
  
    ChosenDict,ChosenAnimation,ename = table.unpack(EmoteName)
    AnimationDuration = -1
  
    if PlayerHasProp then
      DestroyAllProps()
    end
  
    if ChosenDict == "Expression" then
      SetFacialIdleAnimOverride(PlayerPedId(), ChosenAnimation, 0)
      return
    end
  
    if ChosenDict == "MaleScenario" or "Scenario" then 
      if ChosenDict == "MaleScenario" then if InVehicle then return end
        if PlayerGender == "male" then
          ClearPedTasks(PlayerPedId())
          TaskStartScenarioInPlace(PlayerPedId(), ChosenAnimation, 0, true)

          IsInAnimation = true
        else
          EmoteChatMessage(Config.Languages[lang]['maleonly'])
        end return
      elseif ChosenDict == "ScenarioObject" then if InVehicle then return end
        BehindPlayer = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 0 - 0.5, -0.5);
        ClearPedTasks(PlayerPedId())
        TaskStartScenarioAtPosition(PlayerPedId(), ChosenAnimation, BehindPlayer['x'], BehindPlayer['y'], BehindPlayer['z'], GetEntityHeading(PlayerPedId()), 0, 1, false)

        IsInAnimation = true
        return
      elseif ChosenDict == "ScenarioSeat" then if InVehicle then return end
        BehindPlayer = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 0.0, 0.5);
        ClearPedTasks(PlayerPedId())
        TaskStartScenarioAtPosition(PlayerPedId(), ChosenAnimation, BehindPlayer['x'], BehindPlayer['y'], BehindPlayer['z'] - 1.5, GetEntityHeading(PlayerPedId()), 0, 1, 1)
        IsInAnimation = true
        return
      elseif ChosenDict == "Scenario" then if InVehicle then return end
        ClearPedTasks(PlayerPedId())
        TaskStartScenarioInPlace(PlayerPedId(), ChosenAnimation, 0, true)

        IsInAnimation = true
      return end 
    end
    
    while ( not HasAnimDictLoaded(ChosenDict) ) do
		RequestAnimDict(ChosenDict)
		Wait( 0 )
	end

  
    if EmoteName.AnimationOptions then
      if EmoteName.AnimationOptions.EmoteLoop then
        MovementType = 1
      if EmoteName.AnimationOptions.EmoteMoving then
        MovementType = 51
    end
  
    elseif EmoteName.AnimationOptions.EmoteMoving then
      MovementType = 51
    elseif EmoteName.AnimationOptions.EmoteMoving == false then
      MovementType = 0
    elseif EmoteName.AnimationOptions.EmoteStuck then
      MovementType = 50
    end
  
    else
      MovementType = 0
    end
  
    if InVehicle == 1 then
      MovementType = 51
    end
  
    if EmoteName.AnimationOptions then
      if EmoteName.AnimationOptions.EmoteDuration == nil then 
        EmoteName.AnimationOptions.EmoteDuration = -1
        AttachWait = 0
      else
        AnimationDuration = EmoteName.AnimationOptions.EmoteDuration
        AttachWait = EmoteName.AnimationOptions.EmoteDuration
      end
  
      if EmoteName.AnimationOptions.PtfxAsset then
        PtfxAsset = EmoteName.AnimationOptions.PtfxAsset
        PtfxName = EmoteName.AnimationOptions.PtfxName
        if EmoteName.AnimationOptions.PtfxNoProp then
          PtfxNoProp = EmoteName.AnimationOptions.PtfxNoProp
        else
          PtfxNoProp = false
        end
        Ptfx1, Ptfx2, Ptfx3, Ptfx4, Ptfx5, Ptfx6, PtfxScale = table.unpack(EmoteName.AnimationOptions.PtfxPlacement)
        PtfxInfo = EmoteName.AnimationOptions.PtfxInfo
        PtfxWait = EmoteName.AnimationOptions.PtfxWait
        PtfxNotif = false
        PtfxPrompt = true
        PtfxThis(PtfxAsset)
      else
        PtfxPrompt = false
      end
    end
  
    TaskPlayAnim(PlayerPedId(), ChosenDict, ChosenAnimation, 2.0, 2.0, AnimationDuration, MovementType, 0, false, false, false)
    RemoveAnimDict(ChosenDict)
    IsInAnimation = true
    MostRecentDict = ChosenDict
    MostRecentAnimation = ChosenAnimation
  
    if EmoteName.AnimationOptions then
      if EmoteName.AnimationOptions.Prop then
          PropName = EmoteName.AnimationOptions.Prop
          PropBone = EmoteName.AnimationOptions.PropBone
          PropPl1, PropPl2, PropPl3, PropPl4, PropPl5, PropPl6 = table.unpack(EmoteName.AnimationOptions.PropPlacement)
          if EmoteName.AnimationOptions.SecondProp then
            SecondPropName = EmoteName.AnimationOptions.SecondProp
            SecondPropBone = EmoteName.AnimationOptions.SecondPropBone
            SecondPropPl1, SecondPropPl2, SecondPropPl3, SecondPropPl4, SecondPropPl5, SecondPropPl6 = table.unpack(EmoteName.AnimationOptions.SecondPropPlacement)
            SecondPropEmote = true
          else
            SecondPropEmote = false
          end
          Wait(AttachWait)
          AddPropToPlayer(PropName, PropBone, PropPl1, PropPl2, PropPl3, PropPl4, PropPl5, PropPl6)
          if SecondPropEmote then
            AddPropToPlayer(SecondPropName, SecondPropBone, SecondPropPl1, SecondPropPl2, SecondPropPl3, SecondPropPl4, SecondPropPl5, SecondPropPl6)
          end
      end
    end
    return true
  end


RegisterNetEvent("SyncPlayEmote")
AddEventHandler("SyncPlayEmote", function(emote, player)
    EmoteCancel()
    Wait(300)
    if DP.Shared[emote] ~= nil then
      if OnEmotePlay(DP.Shared[emote]) then end return
    elseif DP.Dances[emote] ~= nil then
      if OnEmotePlay(DP.Dances[emote]) then end return
    end
end)

function EmoteCancel()
    TriggerEvent("OnEmoteCancel")
    ClearPedTasks(PlayerPedId())
    IsInAnimation = false
    Load.PropDelete()
end

--#region Functions

---Begins animation depending on data type
---@param data table Animation Data
---@param p string Promise
open = false
local function animType(data, p)
    if data then
        if data.disableMovement then
            Cfg.animDisableMovement = true
        end
        if data.disableLoop then
            Cfg.animDisableLoop = true
        end
        if data.dance then
            Play.Animation(data.dance, data.particle, data.prop, p)
        elseif data.scene then
            Play.Scene(data.scene, p)
        elseif data.expression then
            Play.Expression(data.expression, p)
        elseif data.walk then
            Play.Walk(data.walk, p)
        elseif data.shared then
            Play.Shared(data.shared, p)
        end
    end
end

---Begins cancel key thread
local function enableCancel()
    CreateThread(function()
        while Cfg.animActive or Cfg.sceneActive do
            if IsControlJustPressed(0, 73) then
                Load.Cancel()
                break
            end
            Wait(10)
        end
    end)
end

---Finds an emote by command
---@param emoteName table
local function findEmote(emoteName)
    if emoteName then
        local name = emoteName:upper()
        SendNUIMessage({action = 'findEmote', name = name})
    end
end

---Returns the current walking style saved in kvp
---@return string
local function getWalkingStyle(cb)
    local savedWalk = GetResourceKvpString('savedWalk')
    if savedWalk then
        if cb then
            return cb(savedWalk)
        end
        return savedWalk
    end
    if cb then
        return cb(nil)
    end
    return nil
end
--#endregion

--#region NUI callbacks
RegisterNUICallback('changeCfg', function(data, cb)
    if data then
        if data.type == 'movement' then
            Cfg.animMovement = not data.state
        elseif data.type == 'loop' then
            Cfg.animLoop = not data.state
        end
    end
    cb({})
end)

-- RegisterNUICallback("focusin" , function(_, cb)
--     SetNuiFocusKeepInput(false)
--     cb({})
-- end)

-- RegisterNUICallback("focusout" , function(_, cb)
--     SetNuiFocusKeepInput(true)
--     cb({})
-- end)

RegisterNUICallback('cancelAnimation', function(_, cb)
    Load.Cancel()
    cb({})
end)

RegisterNUICallback('removeProps', function(_, cb)
    Load.PropRemoval('global')
    cb({})
end)

RegisterNUICallback('exitPanel', function(_, cb)
    if Cfg.panelStatus then
        controller = false
        open = false
        Cfg.panelStatus = false
        SetNuiFocus(false, false)
        SetNuiFocusKeepInput(false)
        TriggerScreenblurFadeOut(3000)
        SendNUIMessage({action = 'panelStatus', panelStatus = Cfg.panelStatus})
    end
    cb({})
end)

RegisterNUICallback('sendNotification', function(data, cb)
    if data then
        Play.Notification(data.type, data.message)
    end
    cb({})
end)

RegisterNUICallback('fetchStorage', function(data, cb) 
    if data then
        for _, v in pairs(data) do
            if v == 'loop' then
                Cfg.animLoop = true
            elseif v == 'movement' then
                Cfg.animMovement = true
            end
        end
        local savedWalk = GetResourceKvpString('savedWalk')
        if savedWalk then 
            local p = promise.new()
            Wait(1000)
            Play.Walk({style = savedWalk}, p)
            local result = Citizen.Await(p)
        end
    end
    cb({})
end)

RegisterNUICallback('beginAnimation', function(data, cb)
    Load.Cancel()
    local animState = promise.new()
    animType(data, animState)
    local result = Citizen.Await(animState)
    if result.passed then
        if not result.shared then
            enableCancel()
        end
        cb({e = true})
        return
    end
    if result.nearby then cb({e = 'nearby'}) return end
    cb({e = false})
end)
--#endregion

--#region Commands

-- local controler = false
-- RegisterCommand('LSmenuanimaciones', function()
--     Cfg.panelStatus = not Cfg.panelStatus
--     if Cfg.panelStatus then
--         SetNuiFocus(true, true)
--         SetNuiFocusKeepInput(true)
--         open = true
--         CreateThread(function()
--             while open do
--                 DisableControlAction(0, 1, true) -- Movimiento Ratón
--                 DisableControlAction(0, 2, true) -- Movimiento Ratón
--                 DisableControlAction(0, 3, true) -- Movimiento Ratón
--                 DisableControlAction(0, 4, true) -- Movimiento Ratón
--                 DisableControlAction(0, 5, true) -- Movimiento Ratón
--                 DisableControlAction(0, 6, true) -- Movimiento Ratón
--                 DisableControlAction(0, 288, true) -- F1
--                 DisableControlAction(0, 289, true) -- F2
--                 DisableControlAction(0, 170, true) -- F3
--                 DisableControlAction(0, 318, true) -- F5
--                 DisableControlAction(0, 167, true) -- F6
--                 DisableControlAction(0, 168, true) -- F7
--                 DisableControlAction(0, 56, true) -- F9
--                 DisableControlAction(0, 57, true) -- F10
--                 DisableControlAction(0, 344, true) -- F11
--                 DisableControlAction(0, 263, true) -- R
--                 DisableControlAction(0, 140, true) -- R
--                 DisableControlAction(0, 264, true) -- Q
--                 DisableControlAction(0, 199, true) -- P
--                 DisableControlAction(0, 177, true) -- ESC
--                 DisableControlAction(0, 200, true) -- ESC
--                 DisableControlAction(0, 202, true) -- ESC
--                 DisableControlAction(0, 322, true) -- ESC
--                 DisableControlAction(0, 245, true) -- T
--                 DisableControlAction(0, 37, true) -- TAB
--                 DisableControlAction(0, 261, true) -- Rueda Ratón
--                 DisableControlAction(0, 262, true) -- Rueda Ratón
--                 DisableControlAction(0, 157, true) -- 1
--                 DisableControlAction(0, 158, true) -- 2
--                 DisableControlAction(0, 160, true) -- 3
--                 DisableControlAction(0, 164, true) -- 4
--                 DisableControlAction(0, 165, true) -- 5
--                 DisableControlAction(0, 25, true) -- Click Derecho
--                 DisableControlAction(0, 68, true) -- Click Derecho
--                 DisableControlAction(0, 70, true) -- Click Derecho
--                 DisableControlAction(0, 91, true) -- Click Derecho
--                 DisableControlAction(0, 225, true) -- Click Derecho
--                 DisableControlAction(0, 114, true) -- Click Derecho
--                 DisableControlAction(0, 222, true) -- Click Derecho
--                 DisableControlAction(0, 238, true) -- Click Derecho
--                 DisableControlAction(0, 330, true) -- Click Derecho
--                 DisableControlAction(0, 331, true) -- Click Derecho
--                 DisableControlAction(0, 24, true) -- Click Izquierdo
--                 DisableControlAction(0, 69, true) -- Click Izquierdo
--                 DisableControlAction(0, 92, true) -- Click Izquierdo
--                 DisableControlAction(0, 106, true) -- Click Izquierdo
--                 DisableControlAction(0, 122, true) -- Click Izquierdo
--                 DisableControlAction(0, 135, true) -- Click Izquierdo
--                 DisableControlAction(0, 142, true) -- Click Izquierdo
--                 DisableControlAction(0, 223, true) -- Click Izquierdo
--                 DisableControlAction(0, 229, true) -- Click Izquierdo
--                 DisableControlAction(0, 237, true) -- Click Izquierdo
--                 DisableControlAction(0, 257, true) -- Click Izquierdo
--                 DisableControlAction(0, 329, true) -- Click Izquierdo
--                 DisableControlAction(0, 346, true) -- Click Izquierdo
--                 Wait(1)
--             end
--             controller = false
--         end)
--         SendNUIMessage({action = 'panelStatus',panelStatus = Cfg.panelStatus})
--     else
--         controller = false
--         open = false
--         SetNuiFocus(false, false)
--         SetNuiFocusKeepInput(false)
--         TriggerScreenblurFadeOut(3000)
--         SendNUIMessage({action = 'panelStatus', panelStatus = Cfg.panelStatus})
--     end
-- end)

RegisterNUICallback('sendControl', function(data, cb)
    if data.status then
        SetNuiFocusKeepInput(false)
    else
        SetNuiFocusKeepInput(true)
    end
    cb({e = false})
end)

RegisterCommand('e', function(_, args)
    if args and string.lower(args[1]) == 'c' then
        return EmoteCancel()
    end
    if args and args[1] then
        return findEmote(args[1])
    end
end)

-- RegisterKeyMapping('LSmenuanimaciones', 'Menú de Animaciones', 'keyboard', 'F3')

--#endregion

AddEventHandler('onResourceStop', function(name)
    if GetCurrentResourceName() == name then
        Load.Cancel()
    end
end)

exports('PlayEmote', findEmote)
exports('GetWalkingStyle', getWalkingStyle)