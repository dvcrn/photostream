$(document).ready(function() {

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

	// Funktion zum resizen des fensters
	var resize = function() {
		library.css("height", getLibraryHeight() + "px");	
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

		/*
		photo.animate({
			height: getLibraryHeight(),
		}, 500, function() {
			photo.animate({
				width: "100%"	
			}, 500);
		});
		*/
		//photo.css("width", getLibraryWidth() - 30);
	}

	$(window).resize(resize);
	resize();

    $("#library").bind("contextmenu", function(e) {
        e.preventDefault();
        console.info("Rightclick disabled, sorry!");
    });

	$("#library .photo").click(function() {
		//$(this).addClass("selected");
	});

	$("#library .photo").dblclick(function() {
		showPhoto($(this));
	});


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

	$("#albums .album").dblclick(function(e) {
		e.preventDefault();
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

	$("#album_create").click(function() {
		//var name = prompt("Please type in a name for your album!");
		$("#albums").prepend('<li id="album_create" class="album"><a href="#" title=""><input class="stextbox" type="text" name="" value="" placeholder=""></a></li>');
		$(".stextbox").focus();
		$(".stextbox").keydown(function(e) {
			if (e.keyCode == 13) {
				add_album($(this));
			}
		});

		$(".stextbox").blur(function(e) {
			$(this).parent().parent().remove();
		});
	});
});