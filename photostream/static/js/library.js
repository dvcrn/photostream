var add_album = function(name, callback) {
	ajaxCall("/api/add/album/", { name: name }, true, callback);
}

var rename_album = function(id, newname, callback) {
	ajaxCall("/api/rename/album/", { id: id, name: newname }, true, callback);
}

var delete_album = function(id, callback) {
	ajaxCall("/api/delete/album/", { id: id }, true, callback);
}

var public_album = function(id, callback) {
	ajaxCall("/api/public/album/", { id: id }, false, callback);
}

var delete_photo = function(id, callback) {
	ajaxCall("/api/delete/photos/", { id: id }, true, callback);
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