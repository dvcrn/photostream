var contextmenu_store = {
    element: "",
    menu: "",
}

var showContextmenu = function(type, left, top, element, callback) {
    var menu;
    switch (type)
    {
        case "album":
            menu = $("#album-context-menu");
            break;
        case "photo":
            menu = $("#photo-context-menu");
            break;
    }

    menu.css("left", left);
    menu.css("top", top);
    contextmenu_store.element = element;
    contextmenu_store.menu = menu;
    contextmenu_store.callback = callback;
    menu.show();
}

$(".contextmenu-action").click(function() {
    contextmenu_store.menu.hide();
    contextmenu_store.callback();
});

$("#context-album-makepublic").click(function() {

});

$("#context-album-copyurl").click(function() {

});

$("#context-album-delete").click(function() {

});