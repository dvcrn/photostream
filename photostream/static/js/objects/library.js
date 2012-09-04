var LibraryObj = function() {
  this.setTitle = function(title) {
    $("#main .title").html("<h1>"+title+"</h1>");
  }

  this.showOverlay = function() {
    $("#library-overlay").show();
  }

  this.hideOverlay = function() {
   $("#library-overlay").hide(); 
  }

  this.clear = function() {
    $("#library").html("");
  }

  this.setContent = function(content) {
   $("#library").html(content); 
  }

  this.prependContent = function(content) {
    $("#library").prepend(content);
  }

  this.appendContent = function(content) {
    $("#library").append(content);
  }

  this.setHeight = function(height) {
  	$("#library").css("height", height + "px");	
  	$("#library-overlay").css("height", height + "px"); 
  }

  this.getHeight = function() {
	 return window.innerHeight - $("#toolbar").height() - $("#main .title").height() - 10;
  }

  this.setWidth = function(width) {
  	$("#library").css("width", width + "px");	
  	$("#library-overlay").css("width", width + "px"); 
  }

  this.getWidth = function() {
  	return window.innerWidth - $("#sidebar").width();
  }
}