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

	if (key_shift)
	{
		var current_id = $(this).attr("id");
		var counter = 0;
		var position_end = 0;
		var position_start = 0;
		var last_element = 0;

		for (var tmp in store.selection) {
			last_element = tmp;
		}

		// Get the position of the last item in selection and the clicked image

		$(".photo").each(function(index) {
			var id = $(this).attr("id")

			if (id == current_id) 
			{
				position_end = counter;
			}

			if (id == last_element)
			{
				position_start = counter;
			}
			
			counter = counter + 1;
		});


		// Iterate over all images and select all photos who are between start and end
		var counter = 0;
		$(".photo").each(function(index) {
			var id = $(this).attr("id")

			if (counter >= position_start && counter < position_end)
			{
				selectPhoto($(this));
			}
			
			counter = counter + 1;
		});

	}
	else 
	{
		if (!key_alt) {
			deselectAll();
		}
		else {
			console.info("Muh");
			if ($(this).hasClass("selected")) {
				deselectPhoto($(this));
				return;
			}
		}
	}

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

		var li = $(this);
		var copy = li.clone();

		var title = li.children().filter("a").html();
		var aid = li.attr("id");
		var anchor = li.find("a");

		// Random id for avoiding event overlapping
		var id = new Date().getTime();

		anchor.html('<input class="textbox-borderless" id="'+id+'" type="text" name="" value="" placeholder="">');

		$("#"+id).focus().val(title);
		$("#"+id).blur(function(e) {
			li.replaceWith(copy);

			rebindAlbumDoubleclick();
		});

		$("#"+id).keydown(function(e) {
			if (e.keyCode == 13) {
				var newtitle = $(this).val();

				rename_album(aid, newtitle, function(data) {
					var html = $(data.html);
					li.replaceWith(html);

					var id = html.attr("id");
					var url = html.contents().filter("a").attr("ajax");

					loadModule(url, id, "album");

					rebindAlbumDoubleclick();
				});
			}
		});
	});	
}
rebindAlbumDoubleclick();

$("#sidebar .album").live("click", function(e) {

	if ($(e.target).hasClass("statusicon")) {

		$(".statusicon-active").removeClass("statusicon-active");
		$(".statusicon-edit").removeClass("statusicon-edit");

		var el = $(e.target);
		var classes = el.attr("class");
		el.addClass("statusicon-edit");
		el.addClass("statusicon-active");

		var pos = el.offset()
		var left = pos.left;
		var top = pos.top;

		showContextmenu("album", left + 16, top, $(this), function() {
			$(".statusicon-active").removeClass("statusicon-active");
			$(".statusicon-edit").removeClass("statusicon-edit");
		});
	}
	else
	{
		e.preventDefault();
		var id = $(this).attr("id");
		var url = $(this).contents().filter("a").attr("ajax");

		if (store.section != "album" || store.current != id) 
		{
			loadModule(url, id, "album");
		}
	}

})

$(".context-menu li").click(function(e) {
	if ($(e.target).hasClass("contextmenu-action"))
		return;

	$(this).find("a").click();
});

$("#sidebar a").click(function(e) {
	e.preventDefault();
})

$("#sidebar .library").click(function(e) {
	e.preventDefault();
	var id = $(this).attr("id");
	var url = $(this).contents().filter("a").attr("ajax");
	loadModule(url, id, "library");
})

$("#album_create_box").keydown(function(e) {
	if (e.keyCode == 13) {
		var _this = $(this);
		var name = _this.val();

		add_album(name, function(data) {
			var html = $(data.html);
			$("#album_create_box_wrapper").after(html);
			$("#album_create_box_wrapper").hide();

    		bindDragDrop();
			bindAlbumContextMenu();
		});
	}
});

$("#album_create_box").blur(function(e) {
	$("#album_create_box_wrapper").hide();
});

$("#album_create").click(function() {
	$("#album_create_box").val("");
	$("#album_create_box_wrapper").show();
	$("#album_create_box").focus();
});

$(".userbox").click(function() {
	$(".usermenu").toggle();
	$(this).toggleClass("pressed");
	console.info(window.event);
});

$(document).bind('keyup keydown', function(e){
	key_shift = e.shiftKey;
	key_alt = e.altKey;
});

