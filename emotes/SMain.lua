local QBCore = exports['qb-core']:GetCoreObject()

local currentlyPlaying = {}

--#region Shared anims
RegisterNetEvent('rEmotes:resolveAnimation', function(target, shared, accepted)
    local playerId <const> = source
    if type(shared) ~= "table" and tonumber(playerId) ~= tonumber(target) then
        return false
    end
    if playerId and target then
        if accepted then
            TriggerClientEvent('rEmotes:requestShared', target, shared.first, target, true)
            TriggerClientEvent('rEmotes:requestShared', playerId, shared.second, tonumber(playerId))
        else
            TriggerClientEvent('rEmotes:notify', target, 'info', 'El jugador rechazó tú propuesta')
            TriggerClientEvent('rEmotes:notify', playerId, 'info', 'Propuesta rechazada')
        end
    end
end)

RegisterNetEvent('rEmotes:awaitConfirmation', function(target, shared)
    local playerId <const> = source
    if playerId > 0 then
        if target and type(shared) == "table" then
            TriggerClientEvent('rEmotes:awaitConfirmation', target, playerId, shared)
        end
    end
end)
--#endregion

--#region PTFX Syncing
RegisterNetEvent('rEmotes:syncParticles', function(particles, nearbyPlayers)
    local playerId <const> = source
    if type(particles) ~= "table" or type(nearbyPlayers) ~= "table" then
        error('Table was not successful')
    end
    if playerId > 0 then
        for i = 1, #nearbyPlayers do
            TriggerClientEvent('rEmotes:syncPlayerParticles', nearbyPlayers[i], playerId, particles)
        end
        currentlyPlaying[playerId] = nearbyPlayers
    end
end)

RegisterNetEvent('rEmotes:syncRemoval', function()
    local playerId <const> = source
    if playerId > 0 then
        local nearbyPlayers = currentlyPlaying[playerId]
        if nearbyPlayers then
            for i = 1, #nearbyPlayers do
                TriggerClientEvent('rEmotes:syncRemoval', nearbyPlayers[i], playerId)
            end
            currentlyPlaying[playerId] = nil
        end
    end
end)
--#endregion

QBCore.Functions.CreateCallback("qb-inv:getEmotesHtml", function(source, cb)
    cb(LoadResourceFile(GetCurrentResourceName(), "html/js/emotes/ui.html"))
end)