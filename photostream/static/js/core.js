
var toolbar = $("#toolbar");
var main = $("#main");
var sidebar = $("#sidebar");
var library = $("#library");
var titlebar = $("#main .title")

// Zum adden des CSRF Tokens an ajax requests
$('html').ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
        // Only send the token to relative URLs i.e. locally.
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

var getLibraryHeight = function() {
	return window.innerHeight - toolbar.height() - titlebar.height() - 10;
}

var getLibraryWidth = function() {
	return window.innerWidth - sidebar.width();	
}

var resize = function() {
	library.css("height", getLibraryHeight() + "px");	
}

var createPopup = function(msg) {
	alert(msg);
}

var changeTitle = function(title) {
	titlebar.html("<h1>"+title+"</h1>");
}

var loadModule = function(url) {
	console.info("Loading Module " + url);
	$.get(url, function(json){
		var json = $.parseJSON(json);
		console.info(json);

		if (json.success) {
			library.html(json.html);
			changeTitle(json.title);
		} else {
			createPopup(json.msg);
		}
	});
}

var showPhoto = function(photo) {
	var url = photo.attr("bigger");
	console.info(url);

	// Replace photo with bigger version
	photo.nextAll().hide();
	photo.prevAll().hide();

	photo.css("height", getLibraryHeight() - 30);
	photo.attr("src", url);
	photo.css("width", "");
}

resize();