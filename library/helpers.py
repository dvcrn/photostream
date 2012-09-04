from photostream import settings
from django.core.urlresolvers import reverse

def generate_photourl(photo, albumid=0, size=None):
	owner = photo.owner.id
	name = photo.name
	extension = photo.extension

	media_url = settings.MEDIA_URL
	if size is None:
		if albumid == 0:
			path = reverse("library.views.image_download", kwargs={'userid': int(owner), "id": int(photo.id), "extension": photo.extension})
		else:
			path = reverse("library.views.album_image_download", kwargs={'userid': int(owner), 'albumid': int(albumid), "id": int(photo.id), "extension": photo.extension})
	else:
		if albumid == 0:
			path = reverse("library.views.image", kwargs={'userid': int(owner), 'size': size, "id": int(photo.id), "extension": photo.extension})
		else:
			path = reverse("library.views.album_image", kwargs={'userid': int(owner), 'albumid': int(albumid), 'size': size, "id": int(photo.id), "extension": photo.extension})
	
	return "%s%s" % (settings.PHOTOSERVER_URL, path)