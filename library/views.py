from django.shortcuts import render_to_response
from library.models import Photo, User, Album
from django.template import RequestContext
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from photostream import settings
import Image

# Create your views here.
def library(request):
	if request.user.is_authenticated():
		user = request.user

		#photos = Photo.objects.filter(owner=user)
		albums = Album.objects.filter(owner=user)

		module = {}
		module['title'] = "Library"
		module['name'] = "library_photos"

		return render_to_response("library.html", {
				#'photos': photos,
				'albums': albums,
				'module': module
			}, context_instance=RequestContext(request))
	else:
		return HttpResponseRedirect(reverse("account.views.custom_login"))

def image(request, size, id, extension):
	if request.user.is_authenticated():
		user = request.user

		def switch_size(x):
			return {
				'full': "full",
				'thumb': "180h"
			}.get(size, "full")    # 9 is default if x not found

		size = switch_size(size)

		photo = Photo.objects.get(owner=user, id=id, extension=extension)
		path = photo.photo

		if size == "full":
			imagepath = "%sphotos/%d/%s.%s" % (settings.MEDIA_ROOT, user.id, photo.name, extension)
		else:
			imagepath = "%sphotos/%d/%s_%s.%s" % (settings.MEDIA_ROOT, user.id, photo.name, size, extension)

		image = Image.open(imagepath)
		response = HttpResponse(mimetype="image/png")
		image.save(response, "PNG")

		return response
	else:
		return HttpResponseRedirect(reverse("account.views.custom_login"))

def recent(request):
	if request.user.is_authenticated():
		user = request.user

		photos = Photo.objects.filter(owner=user)[:30]
		albums = Album.objects.filter(owner=user)

		module = {}
		module['title'] = "Recently Added"
		module['name'] = "library_recent"

		return render_to_response("library.html", {
				'photos': photos,
				'albums': albums,
				'module': module
			}, context_instance=RequestContext(request))
	else:
		return HttpResponseRedirect(reverse("account.views.custom_login"))

def album(request, id):
	if request.user.is_authenticated():

		user = request.user
		album = Album.objects.get(owner=user, id=id)
		
		albums = Album.objects.filter(owner=user)
		photos = Photo.objects.filter(album=album)

		module = {}
		module['title'] = album.name
		module['name'] = album.name

		return render_to_response("library.html", {
				'photos': photos,
				'albums': albums,
				'current_album': album,
				'module': module
			}, context_instance=RequestContext(request))
	else:
		return HttpResponseRedirect(reverse("account.views.custom_login"))


def album_public(request, userid, albumid):
	user = User.objects.get(id=userid)
	album = Album.objects.get(id=albumid, owner=user)

	if album.is_public:
		photos = Photo.objects.filter(album=album)

	return render_to_response("public/album.html", {
			'photos': photos,
			'album': album,
			'user': user
		}, context_instance=RequestContext(request))





