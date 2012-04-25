
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
                console.info("Going to make it public");
                break;

            case "context-album-copyurl":
                console.info("Going to copy the url");
                break;

            case "context-album-delete":
                createConfirm("Are you sure you want to delete this album? There is NO undo!", function() {
                    delete_album(el.attr("id"), function() {
                        el.remove();

                        var element = $("#library_photos");

                        var id = element.attr("id");
                        var url = element.find("a").attr("ajax");

                        loadModule(url, id, "library");
                    });
                });
                break;
        }
    });
}