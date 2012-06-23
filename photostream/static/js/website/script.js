$(document).ready(function() {
	$("#nav_launchapp").click(function(e) {
		e.preventDefault();
		var url = $(this).attr("href");
		window.open(url, '', 'height=900,width=1245,resizable=no', false);
	});
	$("#nav_launchuploader").click(function(e) {
		e.preventDefault();
		var url = $(this).attr("href");
		window.open(url, '', 'height=400,width=600', false);
	});
});