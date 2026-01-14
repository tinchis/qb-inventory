/* Virtual Scrolling System for Large Inventories */
/* Only renders visible slots + buffer for massive performance boost */

var VirtualScroller = {
    config: {
        itemHeight: 80, // Height of each slot in px
        bufferSize: 5,  // Extra slots to render above/below viewport
        containerSelector: '.player-inventory'
    },

    state: {
        totalSlots: 0,
        visibleSlots: 0,
        scrollTop: 0,
        slots: [],
        container: null,
        viewport: null,
        spacer: null
    },

    init: function (container, totalSlots, slotsData) {
        this.state.container = container;
        this.state.totalSlots = totalSlots;
        this.state.slots = slotsData || [];

        this.createViewport();
        this.calculateVisibleSlots();
        this.attachScrollListener();
        this.render();
    },

    createViewport: function () {
        var $container = $(this.state.container);

        if ($container.find('.virtual-viewport').length === 0) {
            var totalHeight = this.state.totalSlots * this.config.itemHeight;

            $container.css({
                'position': 'relative',
                'overflow-y': 'auto',
                'max-height': '60vh'
            });

            var viewportHtml = '<div class="virtual-viewport" style="position: relative; height: ' + totalHeight + 'px;"></div>';
            $container.html(viewportHtml);

            this.state.viewport = $container.find('.virtual-viewport')[0];
        } else {
            this.state.viewport = $container.find('.virtual-viewport')[0];
        }
    },

    calculateVisibleSlots: function () {
        var containerHeight = $(this.state.container).height();
        this.state.visibleSlots = Math.ceil(containerHeight / this.config.itemHeight) + (this.config.bufferSize * 2);
    },

    attachScrollListener: function () {
        var self = this;
        var lastScrollTime = 0;
        var scrollThrottle = 16; // 60fps

        $(this.state.container).off('scroll.virtual').on('scroll.virtual', function (e) {
            var now = Date.now();
            if (now - lastScrollTime < scrollThrottle) {
                return;
            }
            lastScrollTime = now;

            self.state.scrollTop = this.scrollTop;
            self.render();
        });
    },

    getVisibleRange: function () {
        var scrollTop = this.state.scrollTop;
        var startIndex = Math.floor(scrollTop / this.config.itemHeight) - this.config.bufferSize;
        startIndex = Math.max(0, startIndex);

        var endIndex = startIndex + this.state.visibleSlots;
        endIndex = Math.min(this.state.totalSlots, endIndex);

        return { startIndex: startIndex, endIndex: endIndex };
    },

    render: function () {
        var range = this.getVisibleRange();
        var $viewport = $(this.state.viewport);

        $viewport.empty();

        for (var i = range.startIndex; i < range.endIndex; i++) {
            var slot = this.state.slots[i];
            var slotElement = this.createSlotElement(slot, i);

            $(slotElement).css({
                'position': 'absolute',
                'top': (i * this.config.itemHeight) + 'px',
                'left': '0',
                'right': '0'
            });

            $viewport.append(slotElement);
        }

        observeLazyImages(this.state.viewport);
        DragSystem.enableDraggable('.item-drag');
    },

    createSlotElement: function (slotData, index) {
        var slotNum = slotData.slot || (index + 6);
        var hasItem = slotData.item != null;

        if (!hasItem) {
            if (slotNum == 41) {
                return SlotTemplates.emptySlotWithKey(slotNum, '6');
            } else {
                return SlotTemplates.emptySlot(slotNum);
            }
        }

        var item = slotData.item;
        var ItemLabel = '<div class="item-slot-label"><p>' + item.label + "</p></div>";

        if (item.name && item.name.split("_")[0] == "weapon") {
            if (!Inventory.IsWeaponBlocked(item.name)) {
                ItemLabel = '<div class="item-slot-quality"><div class="item-slot-quality-bar"></div></div><div class="item-slot-label"><p>' + item.label + "</p></div>";
            }
        }

        var keyHtml = '';
        var imgHtml = '<div class="item-slot-img"><img data-src="images/' + item.image + '" alt="' + item.name + '" /></div>';
        var amountHtml = '<div class="item-slot-amount"><p>' + item.amount + "</p></div>";

        if (slotNum < 6) {
            keyHtml = '<div class="item-slot-key"><p>' + slotNum + '</p></div>';
        } else if (slotNum == 41) {
            keyHtml = '<div class="item-slot-key"><p>6</p></div>';
        }

        var slotDiv = document.createElement('div');
        slotDiv.className = 'item-slot item-drag';
        slotDiv.setAttribute('data-slot', slotNum);
        slotDiv.innerHTML = keyHtml + imgHtml + amountHtml + ItemLabel;

        $(slotDiv).data('item', item);

        return slotDiv;
    },

    updateSlot: function (slotIndex, itemData) {
        if (slotIndex >= 0 && slotIndex < this.state.slots.length) {
            this.state.slots[slotIndex].item = itemData;

            var range = this.getVisibleRange();
            if (slotIndex >= range.startIndex && slotIndex < range.endIndex) {
                this.render();
            }
        }
    },

    updateAllSlots: function (slotsData) {
        this.state.slots = slotsData;
        this.render();
    },

    destroy: function () {
        $(this.state.container).off('scroll.virtual');
        if (this.state.viewport) {
            $(this.state.viewport).remove();
        }
    }
};

var PlayerInventoryScroller = Object.create(VirtualScroller);
PlayerInventoryScroller.config = {
    itemHeight: 80,
    bufferSize: 5,
    containerSelector: '.player-inventory'
};

var OtherInventoryScroller = Object.create(VirtualScroller);
OtherInventoryScroller.config = {
    itemHeight: 80,
    bufferSize: 5,
    containerSelector: '.other-inventory'
};
