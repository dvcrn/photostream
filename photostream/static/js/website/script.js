$(document).ready(function() {
	$("#nav_launchapp").click(function(e) {
		e.preventDefault();
		var url = $(this).attr("href");
		window.open(url, '', 'height=750,width=1100', false);
	});
});