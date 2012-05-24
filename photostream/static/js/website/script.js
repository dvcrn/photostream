$(document).ready(function() {
	$("#nav_launchapp").click(function(e) {
		e.preventDefault();
		var url = $(this).attr("href");
		window.open(url, '', 'height=750,width=1100', false);
	});
	$("#nav_launchuploader").click(function(e) {
		e.preventDefault();
		var url = $(this).attr("href");
		window.open(url, '', 'height=400,width=600', false);
	});
});