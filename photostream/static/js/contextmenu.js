
var bindPhotoContextMenu = function() {
	$("#library .photo").contextMenu({
        menu: 'photo-context-menu'
    },
    function(action, el, pos) {

        var el = $(el);

        console.info("Action " + action);
        switch(action) 
        {

        }
    });





    $( library )
    .drag("start",function( ev, dd ){
        return $('<div class="selection" />')
            .css('opacity', .65 )
            .appendTo( document.body );
    })
    .drag(function( ev, dd ){
        $( dd.proxy ).css({
            top: Math.min( ev.pageY, dd.startY ),
            left: Math.min( ev.pageX, dd.startX ),
            height: Math.abs( ev.pageY - dd.startY ),
            width: Math.abs( ev.pageX - dd.startX )
        });
    })
    .drag("end",function( ev, dd ){
        $( dd.proxy ).fadeOut(100, function() {

        $( dd.proxy ).remove();
        });
    });

    $("#library .photo")
        .drop("start",function(){
            $( this ).addClass("test2");
        })
        .drop(function( ev, dd ){
            $( this ).toggleClass("test3");
        })
        .drop("end",function(){
            $( this ).removeClass("test2");
        });
    $.drop({ multi: true });





}

var bindAlbumContextMenu = function() {
	$("#albums .album").contextMenu({
        menu: 'album-context-menu',
        childClass: 'hover'
    },
    function(action, el, pos) {

        var el = $(el);

        console.info("Action " + action);
        console.info(el.attr("id"));
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