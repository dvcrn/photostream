
var toolbar = $("#toolbar");
var main = $("#main");
var sidebar = $("#sidebar");
var library = $("#library");
var titlebar = $("#main .title")
var store = new Store();
var overlay = $("#library-overlay");

var key_shift = false;
var key_alt = false;
var key_strg = false;

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

// Resizing and calculating height for library, etc.
var getLibraryHeight = function() {
	return window.innerHeight - toolbar.height() - titlebar.height() - 10;
}

var getLibraryWidth = function() {
	return window.innerWidth - sidebar.width();	
}

var getGlobalHeight = function() {
	return window.innerHeight - toolbar.height();
}

var resize = function() {
	library.css("height", getLibraryHeight() + "px");	
	sidebar.css("height", getGlobalHeight() + "px");	

  overlay.css("height", (window.innerHeight - toolbar.height()) + "px"); 
  overlay.css("width", getLibraryWidth() + "px"); 
}

var showOverlay = function() {
  overlay.show();
}

var hideOverlay = function() {
  overlay.hide();
}

var createPopup = function(msg) {
	alert(msg);
}

var createConfirm = function(msg, callback) {
  if (confirm(msg)) {
    callback();
  }
}

var changeLibrarytitle = function(title) {
	titlebar.html("<h1>"+title+"</h1>");
}

// Important one. For changing albums for example
var loadModule = function(url, id, section) {
  $("#sidebar .current").removeClass("current");
  $("#"+id).addClass("current");
  showOverlay();
  deselectAll();

	$.get(url, function(json){
		var json = $.parseJSON(json);

		if (json.success) {
      hideOverlay();

			library.html(json.html);
			changeLibrarytitle(json.title);
      changeTitle(json.title);

			store.section = section;
			store.current = id;

      bindDragDrop();
      bindInfscroll();
		} else {
			createPopup(json.msg);
		}
	});
}

// Selection part....
var selectPhoto = function(photo, deselect_others) {
  if (deselect_others === undefined) {
    deselect_others = false;
  }

  if (deselect_others) {
    deselectAll();
  }


  var id = photo.attr("id");
  if (store.selection[id] === undefined) {
    store.selection[id] = photo;
    photo.addClass("selected");
    //console.info(store.selection);
  }
}

var deselectPhoto = function(photo) {
  var id = photo.attr("id");
  delete store.selection[id]; 
  photo.removeClass("selected");
}

var getSelectedPhotos = function() {
  return store.selection;
}

var deselectAll = function() {
  store.selection = {};
  $(".selected").removeClass("selected");
}
// End selection

var changeTitle = function(title) {
  document.title = "Photolicious :: " + title;
}

var changeStatusicon = function(element, icontype) {
  if (element.hasClass("statusicon")) {
    icon = element;
  }
  else {
    icon = element.find(".statusicon");
  }

  icon.removeClass("statusicon-public");
  icon.removeClass("statusicon-loading");
  icon.removeClass("statusicon-tick");

  switch(icontype) 
  {
    case "public":
      var iconclass = "statusicon-public";
      break;

    case "loading":
      var iconclass = "statusicon-loading";
      break;

    case "tick":
      var iconclass = "statusicon-tick";
      break;

    case "none":
      var iconclass = "";
      break;
  }

  icon.addClass(iconclass);

  initQtip();
}

var copyToClipboard = function(text) {
    window.prompt ("Copy to clipboard. Press Ctrl+C or rightclick and copy", text);     
}

var ajaxCall = function(url, params, async, callback) {
  if (async === undefined) {
    async = true;
  }

  if (callback === undefined) {
    callback = function() {}
  }

  $.ajax({
    url: url,
    async: async,
    dataType: "json",
    type: "POST",
    data: params,
    success: function(json) {
      if (!json.success) {
        // TODO: Fehlerhandler hier
        createPopup("Something very bad happened...");
      } else {
        callback(json);
      }
    }
    });
}

resize();

$("a[rel^='prettyPhoto']").prettyPhoto({
  overlay_gallery: false,
  social_tools: false, 
}); 