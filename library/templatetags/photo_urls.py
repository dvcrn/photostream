from django import template
from photostream import settings

register = template.Library()

@register.filter(name='thumburl', is_safe=True)
def thumburl(photo):
	owner = photo.owner.id
	name = photo.name
	extension = photo.extension

	media_url = settings.MEDIA_URL

	return "%sphotos/%s/%s_180h%s" % (media_url, owner, name, extension)

@register.filter(name='photourl', is_safe=True)
def photourl(photo):
	owner = photo.owner.id
	name = photo.name
	extension = photo.extension

	media_url = settings.MEDIA_URL

	return "%s%s" % (media_url, photo.photo)