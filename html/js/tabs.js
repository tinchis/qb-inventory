$(document).on("click", ".tab-menu-btn", (e) => {
    $(".itemboxes-container").remove();
    $(".ply-iteminfo-container").fadeOut(100);
    $(".tab").fadeOut(200);
    const $button = $(e.currentTarget);
    setTimeout(() => {
        $(".tab-menu-btn").removeClass("tab-selected").css("background-color", "#111111");
        $button.addClass("tab-selected").css("background-color", "#1C1C1C");
        const tabName = $button.attr("tab");
        $(`#${tabName}-tab`).fadeIn();
        if (tabName === 'menus' && typeof updateMenusTab === 'function') {
            updateMenusTab();
        }
        if (tabName !== 'inv') {
            $(".inv-container-left").css({ opacity: "0%" })
            if (tabName === 'clothes' || tabName === 'emotes' || tabName === 'menus') {
                $("#item-amount").parent().hide();
            }
        } else {
            $(".inv-container-left").css({ opacity: "100%" })
            $("#item-amount").parent().show();
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
    $.post("https://qb-inventory/nuiReadyEmotes");
})