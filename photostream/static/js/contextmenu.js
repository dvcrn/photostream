
var bindPhotoContextMenu = function() {
    /*
	$("#library .photo").contextMenu({
        menu: 'photo-context-menu',
        childClass: "selected"
    },
    function(action, el, pos) {

        var el = $(el);

        console.info("Action " + action);
        switch(action) 
        {

        }
    });
*/
}

var bindAlbumContextMenu = function() {
	$("#albums .album").contextMenu({
        menu: 'album-context-menu',
        childClass: 'hover'
    },
    function(action, el, pos) {

        var el = $(el);

        //console.info("Action " + action);
        //console.info(el.attr("id"));
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
                    });
                });
                break;
        }
    });
}