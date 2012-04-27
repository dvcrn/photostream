
var bindPhotoContextMenu = function() {

	$("#library .photo").contextMenu({
        menu: 'photo-context-menu',
        startFunction: function(el) {

            if (!el.hasClass("selected"))
                selectPhoto(el, true);
        }
    },
    function(action, el, pos) {

        var el = $(el);

        console.info("Action " + action);
        switch(action) 
        {

        }
    });
}

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

var bindAlbumContextMenu = function() {

	$("#albums .album").contextMenu({
        menu: 'album-context-menu',
        childClass: 'hover'
    },
    function(action, el, pos) {

        var el = $(el);

        switch(action) 
        {
            case "context-album-makepublic":
                toggle_public(el);
                break;

            case "context-album-copyurl":
                var link = el.find("a").attr("public");

                if (link === undefined) 
                {
                    toggle_public(el, function() {
                        var link = el.find("a").attr("public");
                        copyToClipboard(link);
                    });
                }
                else 
                {
                    copyToClipboard(link);
                }

                break;

            case "context-album-delete":
                createConfirm("Are you sure you want to delete this album? There is NO undo!", function() {
                    var id = el.attr("id");
                    var statusicon = el.find(".statusicon");
                    changeStatusicon(statusicon, "loading");

                    if ( store.current == id ) 
                        var reset = true;
                    else
                        var reset = false;


                    delete_album(id, function() {
                        el.remove();

                        if ( reset )
                        {
                            var element = $("#library_photos");
                            var id = element.attr("id");
                            var url = element.find("a").attr("ajax");

                            loadModule(url, id, "library");
                        }

                    });
                });
                break;
        }
    });
}