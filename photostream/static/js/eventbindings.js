$(window).resize(function() {
	resize();
});

$("#library").bind("contextmenu", function(e) {
    e.preventDefault();
    console.info("Rightclick disabled, sorry!");
});

$("#library .photo").click(function() {
	//$(this).addClass("selected");
});

$("#library .photo").live("dblclick", function() {
	showPhoto($(this));
});

$("#albums .album").dblclick(function(e) {
	// Function for renaming an album
	e.preventDefault();
	console.info("DBL CLICK");
	console.info($(this));

	var title = $(this).children().html();
	var aid = $(this).attr("id");
	var oldhtml = $(this).html();

	$(this).html('<input class="stextbox" type="text" name="" value="" placeholder="">');
	$(".stextbox").focus().val(title);
	$(".stextbox").blur(function(e) {
		$(this).parent().html(oldhtml);
	});

	$(".stextbox").keydown(function(e) {
		if (e.keyCode == 13) {
			var _this = $(this);
			// This part is tricky.
			// When pressing enter, send an AJAX request to backend. If rename_album returns true, put in the old content, just with different html
			// This is possible because we don't change anything but the name

			var newtitle = _this.val();
			var promise = $.Deferred();
			
			promise.done(function() {
				_this.parent().html($(oldhtml).html(newtitle));
			});

			rename_album(promise, aid, newtitle);
		}
	});

	console.info(title);
});

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
	//var name = prompt("Please type in a name for your album!");
	$("#albums").prepend('<li id="album_create" class="album"><a href="#" title=""><input class="stextbox" type="text" name="" value="" placeholder=""></a></li>');
	$(".stextbox").focus();
	$(".stextbox").keydown(function(e) {
		if (e.keyCode == 13) {
			add_album($(this));
		}
	});

	$(".stextbox").blur(function(e) {
		$(this).parent().parent().remove();
	});
});