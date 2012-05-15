var add_album = function(name, callback) {

	$.post("/api/add/album/", { name: name },
		function(json) {
	    	var json = $.parseJSON(json);
	    	if (!json.success) {
	    		alert("Something very bad happened...");
	    	} else {
	    		callback(json);
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
	    		callback(json);
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
	    		callback(json);
	    	}
		});
}

var public_album = function(id, callback) {
	$.post("/api/public/album/", { id: id },
		function(json) {
	    	var json = $.parseJSON(json);
	    	console.info(json.success);
	    	if (!json.success) {
	    		createPopup("Something very bad happened...");
	    	} else {
	    		callback(json);
	    	}
		});
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

initQtip();