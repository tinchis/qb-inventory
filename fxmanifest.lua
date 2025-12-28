fx_version 'cerulean'
game 'gta5'
lua54 'yes'
description 'QB-Inventory'
version '1.2.4'
shared_scripts {
    '@qb-core/shared/locale.lua',
    'locales/en.lua',
    'locales/*.lua',
    'config.lua',
    'emotes/Shared.lua'
}
server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
    'emotes/SMain.lua'
}
client_scripts { 
    'client/main.lua',
    'client/menus.lua',
    'emotes/CMain.lua',
    'clothing/Functions.lua', 		-- Global Functions / Events / Debug and Locale start.
	'clothing/Locale/*.lua', 				-- Locales.
	'clothing/Config.lua',			-- Configuration.
	'clothing/Variations.lua',		-- Variants, this is where you wanan change stuff around most likely.
	'clothing/Clothing.lua'
}
ui_page {
    'html/ui.html'
}
files {
    'html/ui.html',
    'html/css/**',
    'html/js/**',
    'html/images/*.png',
    'html/images/*.jpg',
    'html/ammo_images/*.png',
    'html/attachment_images/*.png',
    'html/imgs/*.svg',
    'html/*.ttf',
    'emotes/anims.json'
}
dependency 'qb-weapons'
