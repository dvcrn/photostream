// Photo Drag & Drop action
$(".draggable").draggable({
	helper: 'clone',
	appendTo: 'body',
	//scroll: false,
	//liveMode: true
});

$("#albums .album").droppable({
	hoverClass: "current",
	tolerance: "pointer",
	accept: "#library .photo",
	drop: function(event, ui) {
		var photo = $(ui.draggable);
		var pid = photo.prop("id");
		var aid = $(this).prop("id");

		$.post("/api/album/add/", { albumid: aid, photoid: pid },
			function(json) {
		    	var json = $.parseJSON(json);
		    	if (!json.success) {
		    		alert("Something very bad happened...");
		    	}
			});
	}
});


var add_album = function(caller) {
	var name = caller.val();

	$.post("/api/add/album/", { name: name },
		function(json) {
	    	var json = $.parseJSON(json);
	    	if (!json.success) {
	    		alert("Something very bad happened...");
	    	} else {
	    		caller.parent().attr("href", json.url);
	    		caller.parent().html(name);
	    	}
		});
}

