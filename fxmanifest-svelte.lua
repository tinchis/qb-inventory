fx_version 'cerulean'
game 'gta5'
lua54 'yes'
description 'QB-Inventory'
version '1.3.0-svelte'

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

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/assets/*.js',
    'html/assets/*.css',
    'html/images/*.png',
    'html/images/*.jpg',
    'html/images/*.PNG',
    'html/attachment_images/*.png',
    'html/svgs/*.svg',
    'html/*.ttf',
    'html/*.otf',
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

