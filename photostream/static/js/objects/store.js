var Store = function() {

	this.section = "";
	this.current = "";
	this.selection = "";
	this.url = "";

	this.setSection = function(section) {
		this.section = section;
	}

	this.getSection = function() {
		return this.section;
	}

	this.setCurrent = function(current) {
		this.current = current;
	}

	this.getCurrent = function() {
		return this.current;
	}

	this.setSelection = function(selection) {
		this.selection = selection;
	}

	this.getSelection = function() {
		return this.selection;
	}

	this.setUrl = function(url) {
		this.url = url;
	}

	this.getUrl = function() {
		return this.url;
	}


	this.getPhotos = function() {
		return this.selection;
	}

	this.deselectPhoto = function(photo) {
		var id = photo.attr("id");
		delete this.selection[id]; 
		photo.removeClass("selected");
	}

	this.selectPhoto = function(photo, deselect_others) {
		if (deselect_others === undefined) {
			deselect_others = false;
		}

		if (deselect_others) {
			this.deselectAll();
		}


		var id = photo.attr("id");
		if (this.selection[id] === undefined) {
			this.selection[id] = photo;
			photo.addClass("selected");
			//console.info(store.selection);
		}
	}

	this.deselectAll = function() {
		this.selection = {};
		$(".selected").removeClass("selected");
	}
}