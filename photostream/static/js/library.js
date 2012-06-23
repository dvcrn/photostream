var add_album = function(name, callback) {
	ajaxCall("/api/add/album/", { name: name }, true, callback);
}

var rename_album = function(id, newname, callback) {
	ajaxCall("/api/rename/album/", { id: id, name: newname }, true, callback);
}

var delete_album = function(id, callback) {
	ajaxCall("/api/delete/album/", { id: id }, true, callback);
}

var public_album = function(id, callback) {
	ajaxCall("/api/public/album/", { id: id }, false, callback);
}

var delete_photo = function(id, callback) {
	ajaxCall("/api/delete/photos/", { id: id }, true, callback);
}

var initLibrary = function() {
	var element = $("#library_photos");

	var id = element.attr("id");
	var url = element.find("a").attr("ajax");

	loadModule(url, id, "library");
}

var initQtip = function() {
	return;
	$(".statusicon").qtip({
		content: {
			attr: 'alt'
		},
		style: {
			classes: 'ui-tooltip-youtube'
		},
		position: {
			my: 'bottom center',
			at: 'top center', 
		}
	});
}

var openGallery = function(image) {
	var api_images = [];
	var api_captions = [];
	var api_description = [];

	var current = image.attr("big");
	var i = 0;

	// Create a api photo url list for prettyPhoto
	$(".photo").each(function(index) {
		var url = $(this).attr("big");
		var caption = $(this).attr("caption");
		var downloadurl = $(this).attr("download");
		var description = "<a class='downloadlink' target='_blank' href='"+downloadurl+"'>Download photo</a>";

		api_images.push(url);
		api_captions.push(caption);
		api_description.push(description);

		if (current == url) {
			i = index;
		}
	});

	// Open it
	$.prettyPhoto.open(api_images, api_captions, api_description);
	$.prettyPhoto.changePage(i);
}

var bindInfscroll = function() {
    var opts = {
        offset: '100%'
    };

    var page = 1;

    $('.last-photo').waypoint(function() {
        // Event von bisherigem Wegpunkt entfernen
        $(this).waypoint('destroy');

        page = page + 1;

        // Id muss entfernt werden, damit sie nicht neu gebindet wird
        $(this).removeClass("last-photo");

        // Ajax Request an die API
        //$.get('{{ apiuri }}'+page+'/', function(data) {
        //    $('#wallpaper-listing ol').append(data);
        //    bind_infscroll();
        //});
    	console.info("BOOOOOM");
    }, opts);   
}

initQtip();