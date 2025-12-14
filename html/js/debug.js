(function () {
    if (typeof window.GetParentResourceName !== 'undefined') {
        return;
    }

    window.GetParentResourceName = () => 'qb-inventory';

    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
        if (url && typeof url === 'string' && url.includes('https://qb-inventory/')) {
            return Promise.resolve({
                json: () => Promise.resolve({}),
                ok: true,
                status: 200
            });
        }
        return originalFetch.apply(this, arguments);
    };

    if (typeof $ !== 'undefined' && $.post) {
        const originalPost = $.post;
        $.post = function (url, data, success, dataType) {
            if (url && typeof url === 'string' && url.includes('https://qb-inventory/')) {
                if (typeof success === 'function') {
                    success({});
                }
                return Promise.resolve({});
            }
            return originalPost.apply(this, arguments);
        };
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            if (typeof window.Inventory === 'undefined') {
                return;
            }

            const mockData = {
                action: 'open',
                slots: 30,
                maxWeight: 120000,
                inventory: [
                    {
                        name: 'water_bottle',
                        amount: 5,
                        label: 'Botella de Agua',
                        weight: 200,
                        type: 'item',
                        unique: false,
                        usable: true,
                        image: 'water_bottle.png',
                        slot: 1
                    },
                    {
                        name: 'bread',
                        amount: 3,
                        label: 'Pan',
                        weight: 150,
                        type: 'item',
                        unique: false,
                        usable: true,
                        image: 'bread.png',
                        slot: 2
                    },
                    {
                        name: 'phone',
                        amount: 1,
                        label: 'Teléfono',
                        weight: 100,
                        type: 'item',
                        unique: true,
                        usable: true,
                        image: 'phone.png',
                        slot: 3
                    }
                ],
                other: null
            };

            window.dispatchEvent(new MessageEvent('message', {
                data: mockData
            }));
        }, 1000);
    });

    console.log('%c[DEBUG MODE] Modo debug activado - El inventario funciona en el navegador', 'color: #00ff00; font-weight: bold;');
})();