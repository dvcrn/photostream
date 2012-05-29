from django import template
from photostream import settings
from django.core.urlresolvers import reverse
from photostream import settings

register = template.Library()

@register.filter(name='thumburl', is_safe=True)
def thumburl(photo, albumid=0):
	owner = photo.owner.id
	name = photo.name
	extension = photo.extension

	media_url = settings.MEDIA_URL

	if albumid == 0:
		path = reverse("library.views.image", kwargs={'userid': int(owner), 'size': 'thumb', "id": int(photo.id), "extension": photo.extension})
	else:
		path = reverse("library.views.album_image", kwargs={'userid': int(owner), 'albumid': int(albumid), 'size': 'thumb', "id": int(photo.id), "extension": photo.extension})
	
	return "%s%s" % (settings.PHOTOSERVER_URL, path)

@register.filter(name='fullurl', is_safe=True)
def photourl(photo, albumid=0):
	owner = photo.owner.id
	name = photo.name
	extension = photo.extension

	media_url = settings.MEDIA_URL

	if albumid == 0:
		path = reverse("library.views.image", kwargs={'userid': int(owner), 'size': 'full', "id": int(photo.id), "extension": photo.extension})
	else:
		path = reverse("library.views.album_image", kwargs={'userid': int(owner), 'albumid': int(albumid), 'size': 'full', "id": int(photo.id), "extension": photo.extension})
	
	return "%s%s" % (settings.PHOTOSERVER_URL, path)

@register.filter(name='bigurl', is_safe=True)
def thumburl(photo, albumid=0):
	owner = photo.owner.id
	name = photo.name
	extension = photo.extension

	media_url = settings.MEDIA_URL

	if albumid == 0:
		path = reverse("library.views.image", kwargs={'userid': int(owner), 'size': 'big', "id": int(photo.id), "extension": photo.extension})
	else:
		path = reverse("library.views.album_image", kwargs={'userid': int(owner), 'albumid': int(albumid), 'size': 'big', "id": int(photo.id), "extension": photo.extension})
	
	return "%s%s" % (settings.PHOTOSERVER_URL, path)