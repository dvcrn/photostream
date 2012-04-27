
var bindDragDrop = function() {

    /*
     *  "Drop" the selection on photos to add them to selection
     */

    //console.info(multidrop);
    $("#library .photo").unbind("drop");
    $("#library .photo").unbind("drag");
    $("#albums .album").unbind("drop");
    $(library).unbind("drag");

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


    /*
     *  Drag Function for photos
     */


    $("#library .photo")
        .drag("start",function( ev, dd ){
        
            $.drop({ 
                multi: false,
                mode: true,
            });

            // When a user tries to drag a photo which isn't selected, select it and deselect all others.
            if (!$(this).hasClass("selected")) 
            {
                selectPhoto($(this), true);
            }

            $(".selected").addClass("selection-action");
            $("#photodrag #selectcount h3").html($(".selected").length);

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


    $("#library .photo")
        .drag("start",function( ev, dd ){
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
            $( dd.proxy ).fadeOut(100, function() {
                $( dd.proxy ).hide();
            });
        });


    /*
     *  Area Drag function. Creates an selection and removed it on drop
     */


    $( library )
    .drag("start",function( ev, dd ){

        $.drop({ 
            multi: true,
            mode: "overlap",
        });

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
     *  Drop for albums
     */ 

    $("#albums .album")
    .drop("start", function(ev, dd) {
        if ($(dd.proxy).hasClass("photodrag"))
        {
            //console.info(ev);
            $("#albums .album").removeClass("hover");
            $(this).addClass("hover");
        } 
    })
    .drop(function(ev, dd) {
        if ($(dd.proxy).hasClass("photodrag"))
        {
            //console.info("ev");
            //console.info($(this).attr("id"));
            //console.info("DROP! WUBWUBWUB");
            //console.info($(this));
            var selection = getSelectedPhotos();
            var ids = [];
            var aid = $(this).attr("id");
            var album = $(this);

            var img = album.find(".statusicon");
            var oldicon = img.attr("src");
            img.attr("src", "/static/img/ajaxload-small.gif");

            for (var pid in selection) {
                ids.push(pid);
            }

            var postString = ids.join(",");
            //console.info(postString);
            //console.info(aid);

            $.post("/api/album/add/", { albumid: aid, photos: postString },
                function(json) {
                    var json = $.parseJSON(json);
                    if (!json.success) {
                        console.info(json.msg);
                    }
                    else {
                        img.attr("src", "/static/img/tick.png");
                        setTimeout(function() {
                            img.animate({
                                opacity: '0'
                            }, 500, function() {
                                img.attr("src", oldicon);
                                img.animate({
                                    opacity: "1"
                                });
                            });
                        }, 1000);
                        
                    }
            });

        }
    })
    .drop("end", function() {
        $(this).removeClass("hover");
    });
}