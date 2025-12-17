$(document).on("click", ".tab-menu-btn", (e) => {
    $(".itemboxes-container").remove();
    $(".ply-iteminfo-container").fadeOut(100);
    $(".tab").fadeOut(200);
    const $button = $(e.currentTarget);
    setTimeout(() => {
        $(".tab-menu-btn").removeClass("tab-selected").css("background-color", "#111111");
        $button.addClass("tab-selected").css("background-color", "#1C1C1C");
        const tabName = $button.attr("tab");
        if (tabName === 'clothes') {
            $(`#${tabName}-tab`).css('display', 'grid').fadeIn();
        } else if (tabName === 'emotes') {
            $(`#${tabName}-tab`).css('display', 'flex').fadeIn();
        } else {
            $(`#${tabName}-tab`).fadeIn();
        }
        if (tabName === 'menus' && typeof updateMenusTab === 'function') {
            updateMenusTab();
        }
        if (tabName !== 'inv') {
            $(".inv-container-left").css({ opacity: "0%" })
            if (tabName === 'clothes' || tabName === 'emotes' || tabName === 'menus') {
                $("#item-amount").parent().hide();
            }
            if (tabName === 'menus') {
                $("#drop-item-message").hide();
            } else {
                $("#drop-item-message").show();
            }
        } else {
            $(".inv-container-left").css({ opacity: "100%" })
            $("#item-amount").parent().show();
            $(".flex.items-center.gap-1.px-3").show();
            if ($(".inv-container-left").is(":hidden")) {
            } else {
            }
        }
    }, 200);
});

// $(document).on("click", ".tab-menu-btn", (e) => {
//     $(".tab").fadeOut(200);
//     setTimeout(() => {
//         $(".tab-menu-btn").removeClass("tab-selected");  
//         $(e.target).addClass("tab-selected");
//         if ($(e.target).attr("tab") !== 'inv') {
//             // if ($(".inv-container-left").is(":visible")) {
//                 $(".inv-container-left").css({ opacity: "0%" });
//                 $(".inv-container").css("top", "34vh");
//             // } 
//         } else {
//             // if ($(".inv-container-left").is(":visible")) {
//                 $(".inv-container-left").css({ opacity: "100%" });
//                 $(".inv-container").css("top", "4vh");
//             // }
//         }
//     }, 200);
// });


window.addEventListener("message", ({ data }) => {
    if (data.action === "emotesHTML") {
        $("#emotes-tab").html(data.html);
    }
})

window.addEventListener("load", () => {
    $(".tab").hide();
    $("#inv-tab").show();
    $(".tab-menu-btn").removeClass("tab-selected").css("background-color", "#111111");
    $("#tab-inv-btn").addClass("tab-selected").css("background-color", "#1C1C1C");
    $(".inv-container-left").css({ opacity: "100%" });
    $("#item-amount").parent().show();
    $("#drop-item-message").show();

    $.post("https://qb-inventory/nuiReadyEmotes");
})