$(window).resize(function() {
	resize();
});

$("#library").bind("contextmenu", function(e) {
    e.preventDefault();
    console.info("Rightclick disabled, sorry!");
});

$("#library .photo").click(function() {
	//$(this).addClass("selected");
});

$("#library .photo").live("dblclick", function() {
	showPhoto($(this));
});

$("#albums .album").dblclick(function(e) {
	e.preventDefault();
});

$("#sidebar .album").click(function(e) {
	e.preventDefault();
	var id = $(this).attr("id");
	var url = $(this).contents().filter("a").attr("ajax");
	loadModule(url, id, "album");
})

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