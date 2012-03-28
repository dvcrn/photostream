// Photo Drag & Drop action
$(".draggable").liveDraggable({
	helper: 'clone',
	appendTo: 'body',
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


var add_album = function(caller) {
	var name = caller.val();

	$.post("/api/add/album/", { name: name },
		function(json) {
	    	var json = $.parseJSON(json);
	    	if (!json.success) {
	    		alert("Something very bad happened...");
	    	} else {
	    		caller.parent().parent().attr("id", json.id);
	    		caller.parent().attr("href", json.url);
	    		caller.parent().attr("ajax", json.ajax);	    		
	    		caller.parent().html(name);
	    		bindDroppable();
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