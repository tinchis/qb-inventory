/* Native Drag & Drop System - Replacement for jQuery UI */
/* GPU-accelerated with CSS transforms and debounced events */

var DragSystem = {
    draggingElement: null,
    dragHelper: null,
    dragData: null,
    lastDragTime: 0,
    dragThrottle: 16, // 60fps = 16ms

    init: function () {
        this.setupDragListeners();
        this.createDragHelper();
    },

    createDragHelper: function () {
        if (document.getElementById('drag-helper')) {
            document.getElementById('drag-helper').remove();
        }

        var helper = document.createElement('div');
        helper.id = 'drag-helper';
        helper.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 10000;
            opacity: 0;
            will-change: transform;
            transition: opacity 0.1s;
        `;
        document.body.appendChild(helper);
        this.dragHelper = helper;
    },

    setupDragListeners: function () {
        var self = this;

        document.addEventListener('dragstart', function (e) {
            var target = e.target.closest('.item-drag');
            if (target) {
                self.onDragStart(e, target);
            }
        });

        document.addEventListener('drag', function (e) {
            if (self.draggingElement) {
                self.onDrag(e);
            }
        });

        document.addEventListener('dragend', function (e) {
            if (self.draggingElement) {
                self.onDragEnd(e);
            }
        });

        document.addEventListener('dragover', function (e) {
            e.preventDefault();
        });

        document.addEventListener('drop', function (e) {
            e.preventDefault();
            var target = e.target.closest('.item-slot, #item-use, #item-drop');
            if (target && self.draggingElement) {
                self.onDrop(e, target);
            }
        });

        document.addEventListener('dragenter', function (e) {
            var target = e.target.closest('.item-slot');
            if (target) {
                target.classList.add('item-slot-hoverClass');
            }
        });

        document.addEventListener('dragleave', function (e) {
            var target = e.target.closest('.item-slot');
            if (target && !target.contains(e.relatedTarget)) {
                target.classList.remove('item-slot-hoverClass');
            }
        });
    },

    onDragStart: function (e, element) {
        this.draggingElement = element;
        IsDragging = true;

        var $elem = $(element);
        var itemData = $elem.data("item");
        this.dragData = itemData;

        $elem.find("img").css("filter", "brightness(50%)");

        var rect = element.getBoundingClientRect();
        this.dragHelper.style.width = rect.width + 'px';
        this.dragHelper.style.height = rect.height + 'px';
        this.dragHelper.innerHTML = element.innerHTML;

        var dragAmount = $("#item-amount").val();

        if (dragAmount == 0) {
            if (itemData.price != null) {
                $elem.find(".item-slot-amount p").html("0");
                $(this.dragHelper).find(".item-slot-amount p")
                    .html("(" + itemData.amount + ") $" + itemData.price);
                $(this.dragHelper).find(".item-slot-key").remove();
            } else {
                $elem.find(".item-slot-amount p").html("0");
                $(this.dragHelper).find(".item-slot-amount p").html(itemData.amount);
                $(this.dragHelper).find(".item-slot-key").remove();
            }
        } else if (dragAmount > itemData.amount) {
            if (itemData.price != null) {
                $elem.find(".item-slot-amount p")
                    .html("(" + itemData.amount + ") $" + itemData.price);
            } else {
                $elem.find(".item-slot-amount p").html(itemData.amount);
            }
            InventoryError($elem.parent(), $elem.attr("data-slot"));
        } else if (dragAmount > 0) {
            if (itemData.price != null) {
                $elem.find(".item-slot-amount p")
                    .html("(" + itemData.amount + ") $" + itemData.price);
                $(this.dragHelper).find(".item-slot-amount p")
                    .html("(" + itemData.amount + ") $" + itemData.price);
                $(this.dragHelper).find(".item-slot-key").remove();
            } else {
                $elem.find(".item-slot-amount p").html(itemData.amount - dragAmount);
                $(this.dragHelper).find(".item-slot-amount p").html(dragAmount);
                $(this.dragHelper).find(".item-slot-key").remove();
            }
        } else {
            $(this.dragHelper).find(".item-slot-key").remove();
            $elem.find(".item-slot-amount p").html(itemData.amount);
            InventoryError($elem.parent(), $elem.attr("data-slot"));
        }

        $elem.find(".item-slot-amount p").html(itemData.amount);

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', element.innerHTML);

        if (e.dataTransfer.setDragImage) {
            var img = new Image();
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            e.dataTransfer.setDragImage(img, 0, 0);
        }
    },

    onDrag: function (e) {
        var now = Date.now();
        if (now - this.lastDragTime < this.dragThrottle) {
            return;
        }
        this.lastDragTime = now;

        if (e.clientX === 0 && e.clientY === 0) {
            return;
        }

        this.dragHelper.style.opacity = '1';
        this.dragHelper.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
    },

    onDragEnd: function (e) {
        var self = this;
        setTimeout(function () {
            IsDragging = false;
        }, 300);

        if (this.draggingElement) {
            $(this.draggingElement).css("background", "rgba(255, 255, 255, 0.03)");
            $(this.draggingElement).find("img").css("filter", "brightness(100%)");
        }

        this.dragHelper.style.opacity = '0';
        this.dragHelper.style.transform = '';

        $('.item-slot').removeClass('item-slot-hoverClass');

        this.draggingElement = null;
        this.dragData = null;
    },

    onDrop: function (e, target) {
        var $target = $(target);
        var $draggable = $(this.draggingElement);

        setTimeout(function () {
            IsDragging = false;
        }, 300);

        if (target.id === 'item-use') {
            var fromData = $draggable.data("item");
            var fromInventory = $draggable.parent().attr("data-inventory");
            if (fromData.useable) {
                if (fromData.shouldClose) {
                    Inventory.Close();
                }
                $.post("https://qb-inventory/UseItem", JSON.stringify({
                    inventory: fromInventory,
                    item: fromData,
                }));
            }
            return;
        }

        if (target.id === 'item-drop') {
            var fromData = $draggable.data("item");
            var fromInventory = $draggable.parent().attr("data-inventory");
            var amount = $("#item-amount").val();
            if (amount == 0) {
                amount = fromData.amount;
            }
            $target.css("background", "rgba(35,35,35, 0.7");
            $.post("https://qb-inventory/DropItem", JSON.stringify({
                inventory: fromInventory,
                item: fromData,
                amount: parseInt(amount),
            }));
            return;
        }

        if ($target.hasClass('item-slot')) {
            var fromSlot = $draggable.attr("data-slot");
            var fromInventory = $draggable.parent();
            var toSlot = $target.attr("data-slot");
            var toInventory = $target.parent();
            var toAmount = $("#item-amount").val();

            if (fromSlot == toSlot && fromInventory[0] === toInventory[0]) {
                return;
            }

            if (toAmount >= 0) {
                if (updateweights(fromSlot, toSlot, fromInventory, toInventory, toAmount)) {
                    swap(fromSlot, toSlot, fromInventory, toInventory, toAmount);
                }
            }
        }
    },

    enableDraggable: function (selector) {
        $(selector).attr('draggable', 'true');
    },

    disableDraggable: function (selector) {
        $(selector).attr('draggable', 'false');
    }
};
