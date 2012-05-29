var contextmenu_store = {
    element: "",
    menu: $(".context-menu"),
    callback: function() {},
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

var hideContextmenu = function() {
    contextmenu_store.menu.hide();
    contextmenu_store.callback();   
}

$(".contextmenu-action").click(function() {
    hideContextmenu();
});

$("#context-album-makepublic").click(function() {
    toggle_public(contextmenu_store.element, function() {
        // Done
    });
});

$("#context-album-url").click(function() {
    var url = contextmenu_store.element.find("a").attr("public");
    var is_public = contextmenu_store.element.attr("public");
    if (is_public == "false") {
        toggle_public(contextmenu_store.element, function() {
            window.open(url);
        });
    }
    else {
        window.open(url);
    }

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
    var is_public = el.attr("public");
    var txt = "";
    if (is_public == "true") {
        txt = "Are you sure you want to make this album private again?";
    } else {
        txt = "This album is about to become public to EVERYONE. Do you want that?";
    }

    createConfirm(txt, function() {
        var id = el.attr("id");
        var statusicon = el.find(".statusicon");
        changeStatusicon(statusicon, "loading");

        public_album(id, function(json) {
            if (json.public)
            {
                changeStatusicon(statusicon, "public");
                el.attr("public", "true");
            }
            else
            {
                changeStatusicon(statusicon, "none");
                el.attr("public", "false");
            }
            
            if (callback !== undefined)
                callback(el);
        });
    });
}