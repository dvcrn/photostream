// Photo Drag & Drop action
$(".draggable").liveDraggable({
	helper: 'clone',
	appendTo: 'body',
	zIndex: 5
	//scroll: false,
	//liveMode: true
});

var bindDroppable = function() {
	$("#albums .album").droppable({
		hoverClass: "hover",
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
}
bindDroppable();


var add_album = function(promise, name) {

	$.post("/api/add/album/", { name: name },
		function(json) {
	    	var json = $.parseJSON(json);
	    	if (!json.success) {
	    		alert("Something very bad happened...");
	    		promise.reject();
	    	} else {
	    		promise.data = json;
	    		promise.resolve();
	    	}
		});
}

var rename_album = function(promise, id, newname) {
	$.post("/api/rename/album/", { id: id, name: newname },
		function(json) {
	    	var json = $.parseJSON(json);
	    	console.info(json.success);
	    	if (!json.success) {
	    		alert("Something very bad happened...");
	    		promise.reject();
	    	} else {
	    		promise.resolve();
	    	}
		});
}

var initLibrary = function() {
	var element = $("#library_photos");

	var id = element.attr("id");
	var url = element.find("a").attr("ajax");

	loadModule(url, id, "library");
}