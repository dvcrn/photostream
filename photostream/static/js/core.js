
var toolbar = $("#toolbar");
var main = $("#main");
var sidebar = $("#sidebar");
var library = $("#library");
var titlebar = $("#main .title")
var store = new Store();
var overlay = $("#library-overlay");

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

// Damit das draggable live ist
(function ($) {
   $.fn.liveDraggable = function (opts) {
      this.live("mouseover", function() {
         if (!$(this).data("init")) {
            $(this).data("init", true).draggable(opts);
         }
      });
      return $();
   };
}(jQuery));

// Same for droppable
(function ($) {
       $.fn.liveDroppable = function (opts) {
          this.live("mouseenter", function() {
             if (!$(this).data("init")) {
                $(this).data("init", true).droppable(opts);
             }
          });
       };
}(jQuery));

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

var changeTitle = function(title) {
	titlebar.html("<h1>"+title+"</h1>");
}

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
			changeTitle(json.title);

			store.section = section;
			store.current = id;

      bindPhotoContextMenu();
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

var selectPhoto = function(photo) {
  var id = photo.attr("id");
  if (store.selection[id] === undefined) {
    store.selection[id] = photo;
    photo.addClass("selected");
    console.info(store.selection);
  }
}

var deselectPhoto = function(photo) {
  var id = photo.attr("id");
  delete store.selection[id]; 
  photo.removeClass("selected");
  console.info(store.selection);
}

var deselectAll = function() {
  store.selection = {};
  $(".selected").removeClass("selected");
}

resize();