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

var rename_album = function(id, newname, callback) {
	$.post("/api/rename/album/", { id: id, name: newname },
		function(json) {
	    	var json = $.parseJSON(json);
	    	console.info(json.success);
	    	if (!json.success) {
	    		createPopup("Something very bad happened...");
	    	} else {
	    		callback();
	    	}
		});
}

var delete_album = function(id, callback) {
	$.post("/api/delete/album/", { id: id },
		function(json) {
	    	var json = $.parseJSON(json);
	    	console.info(json.success);
	    	if (!json.success) {
	    		createPopup("Something very bad happened...");
	    	} else {
	    		callback();
	    	}
		});
}

var initLibrary = function() {
	var element = $("#library_photos");

	var id = element.attr("id");
	var url = element.find("a").attr("ajax");

	loadModule(url, id, "library");
	bindAlbumContextMenu();
}