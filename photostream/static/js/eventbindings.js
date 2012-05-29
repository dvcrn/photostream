$(window).resize(function() {
	resize();
});

// Avoid rightclicking. (For a contextmenu maybe later.)
$("#library").bind("contextmenu", function(e) {
	e.preventDefault();
});

$("#sidebar").bind("contextmenu", function(e) {
	e.preventDefault();
});

$(".options a").live("click", function(ev) {
	var element = $(this);
	var photo = $(this).parent().parent();

	if (element.hasClass("option-delete")) {
		createConfirm("Do you want do delete this?", function() {
			delete_photo(photo.attr("id"), function() {
				photo.remove();
			});
		});
	}
	else if (element.hasClass("option-gallery")) {
		openGallery(photo);
	}
	else if (element.hasClass("option-edit")) {

	}
});

// Basic click action for photos
$("#library .photo").live("click", function(ev) {
	if (!$(ev.target).hasClass("thumb"))
		return;

	// If shift is pressed...
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

		// If End is lower than start -> Flip them. (Means selection from down to top)
		if (position_start > position_end) {
			t_start = position_start;
			t_end = position_end;
			position_end = t_start;
			position_start = t_end;
		}


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
		// If alt or strg is pressed while clicking a photo, select it.
		// If not, deselectall and then select it
		if (key_alt || key_strg) {
			console.info("Muh");
			if ($(this).hasClass("selected")) {
				deselectPhoto($(this));
				return;
			}
		}
		else {
			deselectAll();
		}
	}

	selectPhoto($(this));

});

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

// Doubleclick opens prettyPhoto
$("#library .photo").live("dblclick", function() {
	openGallery($(this));
});

// When no photo is clicked, only the library, deselect them all
$("#library").live("click", function(ev) {
	if (ev.target.id == "library") {
		deselectAll();
	}
});

$("#sidebar").live("click", function(ev) {

});

// This is for renaming albums. Moved to a function for easier rebinding
var rebindAlbumDoubleclick = function() {
	// Rebind doubleclick to avoid double bindings
	$("#albums .album").unbind("dblclick");

	$("#albums .album").bind("dblclick", function(e) {

		e.preventDefault();

		// Unbding doubleclick because of strange behaviours
		$(this).unbind("dblclick");

		// Cloning the element for easier resetting on blur
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
			// Replace the whole textbox thing with the copy we did before
			li.replaceWith(copy);
			rebindAlbumDoubleclick();
		});

		$("#"+id).keydown(function(e) {
			// On enter press...
			if (e.keyCode == 13) {
				var newtitle = $(this).val();

				rename_album(aid, newtitle, function(data) {
					var html = $(data.html);
					console.info(html);
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

// Basic clicking for albums
$("#sidebar .album").live("click", function(e) {

	// If the user clicked directly the statusicon...
	if ($(e.target).hasClass("statusicon")) {

		$(".statusicon-active").removeClass("statusicon-active");
		$(".statusicon-edit").removeClass("statusicon-edit");

		var el = $(e.target);
		var classes = el.attr("class");
		el.addClass("statusicon-edit");
		el.addClass("statusicon-active");

		// ... get the current position of the element and show a contextmenu
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


$("#sidebar .library").click(function(e) {
	e.preventDefault();
	var id = $(this).attr("id");
	var url = $(this).contents().filter("a").attr("ajax");
	loadModule(url, id, "library");
})

// A little trick
// If the user didn't directly click the contextmenu anchor, click it for him.
$(".context-menu li").click(function(e) {
	if ($(e.target).hasClass("contextmenu-action"))
		return;

	$(this).find("a").click();
});

// Avoid links from opening new tabs
$("#sidebar a").click(function(e) {
	e.preventDefault();
})

// Monitoring the textbox for new albums
$("#album_create_box").keydown(function(e) {
	if (e.keyCode == 13) {
		var _this = $(this);
		var name = _this.val();

		add_album(name, function(data) {
			var html = $(data.html);
			$("#album_create_box_wrapper").after(html);
			$("#album_create_box_wrapper").hide();

    		bindDragDrop();
		});
	}
});

// Hide the textbox on focus loose
$("#album_create_box").blur(function(e) {
	$("#album_create_box_wrapper").hide();
});

// Show and focus the album create box 
$("#album_create").click(function() {
	$("#album_create_box").val("");
	$("#album_create_box_wrapper").show();
	$("#album_create_box").focus();
});

// Show contextmenu when clicking the own username (down right)
$(".userbox").click(function() {
	$(".usermenu").toggle();
	$(this).toggleClass("pressed");
	console.info(window.event);
});

// Monitoring key presses for later use (e.g. shift clicks).
$(document).bind('keyup keydown', function(e){
	key_shift = e.shiftKey;
	key_alt = e.altKey;
	key_strg = e.ctrlKey;
});

$(document).bind('click', function(ev) {
	var target = $(ev.target);
	if (!target.hasClass("statusicon") && !target.hasClass("context-menu")) {
		hideContextmenu();
	}
});