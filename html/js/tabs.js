$(document).on("click", ".tab-menu-btn", (e) => {
    $(".itemboxes-container").remove();
    $(".ply-iteminfo-container").fadeOut(100);
    $(".tab").fadeOut(200);
    setTimeout(() => {
        $(".tab-menu-btn").removeClass("tab-selected");  
        $(e.target).addClass("tab-selected");
        $(`#${$(e.target).attr("tab")}-tab`).fadeIn();
        if ($(e.target).attr("tab") !== 'inv') {
            $(".inv-container-left").css({opacity: "0%"})
            // $(".inv-container").css("top", "34vh");
        }else {
            $(".inv-container-left").css({opacity: "100%"})
            if ($(".inv-container-left").is(":hidden")){
                // $(".inv-container").css("top", "34vh");
            }else {
                // $(".inv-container").css("top", "4vh");
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


window.addEventListener("message", ({data}) => {
    if (data.action === "emotesHTML") {
        $("#emotes-tab").html(data.html);
    }
})

window.addEventListener("load", () => {
    $.post("https://qb-inventory/nuiReadyEmotes");
})