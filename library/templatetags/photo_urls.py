from django import template
from photostream import settings
from django.core.urlresolvers import reverse

register = template.Library()

@register.filter(name='thumburl', is_safe=True)
def thumburl(photo):
	owner = photo.owner.id
	name = photo.name
	extension = photo.extension

	media_url = settings.MEDIA_URL

	path = reverse("library.views.image", kwargs={'size': 'thumb', "id": int(photo.id), "extension": photo.extension})
	return path

@register.filter(name='fullurl', is_safe=True)
def photourl(photo):
	owner = photo.owner.id
	name = photo.name
	extension = photo.extension

	media_url = settings.MEDIA_URL

	path = reverse("library.views.image", kwargs={'size': 'full', "id": int(photo.id), "extension": photo.extension})
	return path

@register.filter(name='bigurl', is_safe=True)
def thumburl(photo):
	owner = photo.owner.id
	name = photo.name
	extension = photo.extension

	media_url = settings.MEDIA_URL

	path = reverse("library.views.image", kwargs={'size': 'big', "id": int(photo.id), "extension": photo.extension})
	return path