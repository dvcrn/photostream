
var toolbar = $("#toolbar");
var main = $("#main");
var sidebar = $("#sidebar");
var titlebar = $("#main .title");

var key_shift = false;
var key_alt = false;
var key_strg = false;

var libraryObj = new LibraryObj();
var store = new Store();

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
var getGlobalHeight = function() {
	return window.innerHeight - toolbar.height();
}

var resize = function() {
  libraryObj.setHeight(libraryObj.getHeight());
  libraryObj.setWidth(libraryObj.getWidth());

	sidebar.css("height", getGlobalHeight() + "px");	
}

var createPopup = function(msg) {
	alert(msg);
}

var createConfirm = function(msg, callback) {
  if (confirm(msg)) {
    callback();
  }
}

var testfx = function(id, section, title, photos) {

    $("#sidebar .current").removeClass("current");
    $("#"+id).addClass("current");
    
    libraryObj.clear();
    libraryObj.setTitle(title);
    
    changeTitle(title);

    store.deselectAll();
    store.setSection(section);
    store.setCurrent(id);

    for ( i = 0; i < photos.length; i++) {
      libraryObj.appendContent(photos[i]);
    }

    bindDragDrop();
    libraryObj.hideOverlay();
}

var loadAlbum = function(albumid) {
  ajaxCall("/api/2/album/" + albumid + ".json", {}, false, function(json) {

    libraryObj.showOverlay();
    console.info("Loading album " + json.name);

    var photos = [];
    for (i = 0; i < json.count; i++) {
      var photo = json.photos[i];
      var photo = createPhoto(photo.id, photo.photourls.big, photo.photourls.download, photo.photourls.thumb, photo.caption);
      photos.push(photo);
    }

    testfx(json.id, "album", json.name, photos);
  });
}

var loadPhotos = function() {
  $("#sidebar .current").removeClass("current");
  $("#library_photos").addClass("current");

  libraryObj.showOverlay();
  libraryObj.clear();
  libraryObj.setTitle("Library");

  store.deselectAll();
  store.setSection("library");
  store.setCurrent("library_photos");

  ajaxCall("/api/2/photos.json", {}, false, function(json) {
    for (i = 0; i < json.count; i++) {
      var photo = json.photos[i];
      var photo = createPhoto(photo.id, photo.photourls.big, photo.photourls.download, photo.photourls.thumb, photo.caption);
      libraryObj.appendContent(photo);
    }
  });
  bindDragDrop();
  libraryObj.hideOverlay();
}

var createPhoto = function(id, bigurl, downloadurl, thumburl, caption) {
  var dummy = $("#photodummy").clone();
  dummy.removeAttr("id");
  var photo = dummy.find(".photo");

  photo.attr("id", id);
  photo.attr("big", bigurl);
  photo.attr("download", downloadurl);
  photo.attr("caption", caption);

  var thumb = photo.find(".thumb");
  thumb.attr("id", id);
  thumb.attr("big", bigurl);
  thumb.attr("download", downloadurl);
  thumb.attr("caption", caption);
  thumb.attr("src", thumburl);
  return dummy;
}

// Selection part....
var selectPhoto = function(photo, deselect_others) {
  store.selectPhoto(photo, deselect_others);
}

var deselectPhoto = function(photo) {
  store.deselectPhoto(photo);
}

var getSelectedPhotos = function() {
  return store.getPhotos();
}

var deselectAll = function() {
  store.deselectAll();
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