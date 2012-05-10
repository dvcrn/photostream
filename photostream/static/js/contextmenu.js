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
    toggle_public(contextmenu_store.element, function() {
        // Done
    });
});

$("#context-album-url").click(function() {
    toggle_public(contextmenu_store.element, function(el) {
        var url = el.attr("public");
        window.open(url);
    });
});

$("#context-album-delete").click(function() {
    createConfirm("Are you sure?", function() {
        var id = contextmenu_store.element.attr("id");
        console.info(id);
        delete_album(id, function() {
            contextmenu_store.element.remove();
        });
    });
});


var toggle_public = function(el, callback) 
{
    var id = el.attr("id");
    var statusicon = el.find(".statusicon");
    changeStatusicon(statusicon, "loading");

    public_album(id, function(json) {
        if (json.public)
        {
            changeStatusicon(statusicon, "public");
            el.find("a").attr("public", json.url);
        }
        else
        {
            changeStatusicon(statusicon, "none");
            el.find("a").removeAttr("public");
        }
        
        if (callback !== undefined)
            callback(el);
    });
}