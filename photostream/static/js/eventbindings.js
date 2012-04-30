$(window).resize(function() {
	resize();
});

$("#library").bind("contextmenu", function(e) {
	e.preventDefault();
});

$("#sidebar").bind("contextmenu", function(e) {
	e.preventDefault();
});

$("#library .photo").live("click", function() {
	deselectAll();
	selectPhoto($(this));
});

$("#library .photo").live("dblclick", function() {
	var api_images = [];
	var current = $(this).attr("big");
	var i = 0;


	$(".photo").each(function(index) {
		var url = $(this).attr("big")
		api_images.push(url);

		if (current == url) {
			i = index;
		}
	});

	$.prettyPhoto.open(api_images);
	$.prettyPhoto.changePage(i);
});

$("#library").live("click", function(ev) {
	if (ev.target.id == "library") {
		deselectAll();
	}
});

var rebindAlbumDoubleclick = function() {
	$("#albums .album").unbind("dblclick");

	$("#albums .album").bind("dblclick", function(e) {
		// Function for renaming an album
		e.preventDefault();

		$(this).unbind("dblclick");

		var title = $(this).children().filter("a").html();
		var aid = $(this).attr("id");

		var anchor = $(this).find("a");
		var atext = anchor.html();

		// Random id for avoiding event overlapping
		var id = new Date().getTime();

		anchor.html('<input class="stextbox" id="'+id+'" type="text" name="" value="" placeholder="">');

		$("#"+id).focus().val(title);
		$("#"+id).blur(function(e) {
			$(this).parent().html(atext);

			rebindAlbumDoubleclick();
		});

		$("#"+id).keydown(function(e) {
			if (e.keyCode == 13) {
				var _this = $(this);
				// This part is tricky.
				// When pressing enter, send an AJAX request to backend. If rename_album returns true, put in the old content, just with different html
				// This is possible because we don't change anything but the name

				var newtitle = _this.val();

				rename_album(aid, newtitle, function() {
					console.info("Atext " + atext);
					anchor.html(newtitle);
					changeTitle(newtitle);

					rebindAlbumDoubleclick();
				});
			}
		});
	});	
}
rebindAlbumDoubleclick();

$("#sidebar .album").live("click", function(e) {
	e.preventDefault();
	var id = $(this).attr("id");
	var url = $(this).contents().filter("a").attr("ajax");

	if (store.section != "album" || store.current != id) 
	{
		loadModule(url, id, "album");
	}
})

$("#sidebar a").click(function(e) {
	e.preventDefault();
})

$("#sidebar .library").click(function(e) {
	e.preventDefault();
	var id = $(this).attr("id");
	var url = $(this).contents().filter("a").attr("ajax");
	loadModule(url, id, "library");
})

$("#album_create").click(function() {
	$("#albums").prepend('<li id="album_create" class="album"><img class="icon" src="/static/img/album-icon.png"> <a href="#" title=""><input class="stextbox" type="text" name="" value="" placeholder=""></a></li>');
	$(".stextbox").focus();
	$(".stextbox").keydown(function(e) {
		if (e.keyCode == 13) {
			var _this = $(this);
			var promise = $.Deferred();
			var name = _this.val();

			add_album(name, function(data) {
				var json = data;

	    		_this.parent().parent().attr("id", json.id);
	    		_this.parent().attr("href", json.url);
	    		_this.parent().attr("ajax", json.ajax);	    		
	    		_this.parent().html(name);

	    		bindDragDrop();
				bindAlbumContextMenu();
			});
		}
	});

	$(".stextbox").blur(function(e) {
		$(this).parent().parent().remove();
	});
});