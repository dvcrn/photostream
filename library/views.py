from django.shortcuts import render_to_response
from library.models import Photo, User, Album
from django.template import RequestContext
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.core.urlresolvers import reverse
from django.conf import settings as settings_default
from photostream import settings
import Image
import simplejson
import os

# Create your views here.
def library(request):
	if request.user.is_authenticated():
		user = request.user

		#photos = Photo.objects.filter(owner=user)
		albums = Album.objects.filter(owner=user)

		module = {}
		module['title'] = "Library"
		module['name'] = "library_photos"

		return render_to_response("app/library.html", {
				#'photos': photos,
				'albums': albums,
				'module': module
			}, context_instance=RequestContext(request))
	else:
		return HttpResponseRedirect(reverse("account.views.custom_login"))

def image(request, userid, size, id, extension):
	if request.user.is_authenticated():
		user = request.user

		def switch_size(x):
			return {
				'full': "full",
				'big': "1000w",
				'thumb': "180w"
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

def uploader(request):
	sessionid = request.session.session_key
	return render_to_response("uploader.html", {
	       'session_cookie_name': settings_default.SESSION_COOKIE_NAME,
	       'session_key': request.session.session_key
		}, context_instance=RequestContext(request))

def upload(request):
	if request.method != "POST":
		raise Http404()

	if not request.user.is_authenticated():
		raise Http404
	
	user = request.user

	for field_name in request.FILES:
		myfile = request.FILES[field_name]
		extension = os.path.splitext(myfile.name)[1]
		extension = extension[1:5]
		photocount = Photo.objects.filter(owner=user).count() + 1

		filename = photocount
		filename_full = "%s.%s" % (filename, extension)

		relative_userpath = 'photos/%s/' % user.id
		absolute_userpath = '%s%s' % (settings.MEDIA_ROOT, relative_userpath)

		relative_filepath = '%s%s' % (relative_userpath, filename_full)
		absolute_filepath = '%s%s' % (absolute_userpath, filename_full)

		if not os.path.exists(absolute_userpath):
			os.makedirs(absolute_userpath)

		destination = open(absolute_filepath, "wb+")
		
		for chunk in myfile.chunks():
			destination.write(chunk)

		destination.close()

		Photo.objects.create(owner=user, name=filename, extension=extension, photo=relative_filepath)

	return HttpResponse("ok", mimetype="text/plain")

def album_image(request, albumid, userid, size, id, extension):
	user = request.user

	def switch_size(x):
		return {
			'full': "full",
			'big': "1000w",
			'thumb': "180w"
		}.get(size, "full")    # 9 is default if x not found

	size = switch_size(size)

	album = Album.objects.get(id=albumid)

	if not album.is_public:
		raise Http404

	photo = Photo.objects.get(owner=userid, id=id, extension=extension, album=album)
	
	path = photo.photo
	if size == "full":
		imagepath = "%sphotos/%d/%s.%s" % (settings.MEDIA_ROOT, int(userid), photo.name, extension)
	else:
		imagepath = "%sphotos/%d/%s_%s.%s" % (settings.MEDIA_ROOT, int(userid), photo.name, size, extension)

	image = Image.open(imagepath)
	response = HttpResponse(mimetype="image/png")
	image.save(response, "PNG")

	return response

def recent(request):
	if request.user.is_authenticated():
		user = request.user

		photos = Photo.objects.filter(owner=user)[:30]
		albums = Album.objects.filter(owner=user)

		module = {}
		module['title'] = "Recently Added"
		module['name'] = "library_recent"

		return render_to_response("app/library.html", {
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
	else:
		raise Http404

	return render_to_response("public/album.html", {
			'photos': photos,
			'album': album,
			'user': user
		}, context_instance=RequestContext(request))





