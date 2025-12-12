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
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
	'server/visual.lua',
}

client_scripts {
	'client/main.lua',
	'client/visual.lua',
}

ui_page {
    'html/ui.html'
}

files {
    'html/ui.html',
    'html/css/main.css',
    'html/js/state.js',
    'html/js/utils.js',
    'html/js/ui-renderer.js',
    'html/js/items.js',
    'html/js/weapons.js',
    'html/js/drag-drop.js',
    'html/js/event-handlers.js',
    'html/js/inventory-core.js',
    'html/js/app.js',
    'html/images/*.png',
    'html/images/*.jpg',
    'html/attachment_images/*.png',
    'html/*.ttf',
    'html/*.otf',
    'html/*.svg',
    'html/*.ogg'
}

escrow_ignore {
    '@qb-core/shared/locale.lua',
    'locales/en.lua',
    'locales/*.lua',
    'config.lua',
	'client/main.lua',
	'client/visual.lua',
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
	'server/visual.lua',
}

dependency 'qb-weapons'