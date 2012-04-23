
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



    /*
     *  Area Drag function. Creates an selection and removed it on drop
     */

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

    /*
     *  "Drop" the selection on photos to add them to selection
     */

    $("#library .photo")
        .drop("start",function(ev, dd){
            if ($(dd.proxy).hasClass("selection")) 
            {
                deselectAll();
                $( this ).addClass("selection-hover");
            }
        })

        .drop(function( ev, dd ){
            if ($(dd.proxy).hasClass("selection")) 
            {
                selectPhoto($(this));
            }
        })
        .drop("end",function(){
            $( this ).removeClass("selection-hover");
        });

    $.drop({ multi: true });

    /*
     *  Drag Function for photos
     */

    $("#library .photo")
        .drag("start",function( ev, dd ){
            $(".selected").addClass("selection-action");
            //console.info($(".selected"));
            // Append the photosummary to document.body
            return $("#photodrag").show().appendTo( document.body );
        })
        .drag(function( ev, dd ){
            // On move, set the position to mouse position. (To follow the mouse)
            $( dd.proxy ).css({
                top: dd.offsetY,
                left: dd.offsetX
            });
        })
        .drag("end",function( ev, dd ){
            // On End, fade the element out
            $(".selected").removeClass("selection-action");
            $( dd.proxy ).fadeOut(100, function() {
                // $( dd.proxy ).remove();
            });
        });
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