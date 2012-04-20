$(window).resize(function() {
	resize();
});

$("#library").bind("contextmenu", function(e) {
	e.preventDefault();
});

$("#library").not(".photo").bind("click", function(e) {
	//console.info("Removing all");
	//deselectAll();
});

$("#library .photo").live("dblclick", function() {
	//showPhoto($(this));
});

$("#library .photo").live("click", function() {
	deselectAll();
	selectPhoto($(this));
});

$("#sidebar").bind("contextmenu", function(e) {
	e.preventDefault();
});

var rebindAlbumDoubleclick = function() {
	$("#albums .album").unbind("dblclick");

	$("#albums .album").bind("dblclick", function(e) {
		// Function for renaming an album
		e.preventDefault();

		$(this).unbind("dblclick");

		var title = $(this).children().filter("a").html();
		var aid = $(this).attr("id");
		var oldhtml = $(this).html() + "";

		var id = new Date().getTime();

		$(this).html('<img class="icon" src="/static/img/album-icon.png"> <input class="stextbox" id="'+id+'" type="text" name="" value="" placeholder="">');
		$("#"+id).focus().val(title);
		$("#"+id).blur(function(e) {
			$(this).parent().html(oldhtml);

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
					_this.parent().html($(oldhtml).html(newtitle));
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

			promise.done(function() {
				var json = promise.data;

	    		_this.parent().parent().attr("id", json.id);
	    		_this.parent().attr("href", json.url);
	    		_this.parent().attr("ajax", json.ajax);	    		
	    		_this.parent().html(name);

				bindDroppable();
				bindAlbumContextMenu();
			});

			add_album(promise, name);
		}
	});

	$(".stextbox").blur(function(e) {
		$(this).parent().parent().remove();
	});
});