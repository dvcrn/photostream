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
import mimetypes

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

		image = open(imagepath, "r")
		mimetype = mimetypes.guess_type(imagepath)[0]
		if not mimetype: mimetype = "application/octet-stream"

		response = HttpResponse(image.read(), mimetype=mimetype)

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
		photoname = os.path.splitext(myfile.name)[0]
		extension = os.path.splitext(myfile.name)[1]
		extension = extension[1:5].lower()
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

		Photo.objects.create(owner=user, raw_name=photoname, name=filename, extension=extension, photo=relative_filepath)

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

	image = open(imagepath, "r")
	mimetype = mimetypes.guess_type(imagepath)[0]
	if not mimetype: mimetype = "application/octet-stream"

	response = HttpResponse(image.read(), mimetype=mimetype)

	return response

def album_public(request, userid, albumid):
	user = User.objects.get(id=userid)
	album = Album.objects.get(id=albumid, owner=user)

	if album.is_public:
		photos = Photo.objects.filter(album=album, processed=1, flag=0)
	else:
		raise Http404

	return render_to_response("public/album.html", {
			'photos': photos,
			'album': album,
			'user': user
		}, context_instance=RequestContext(request))

def image_download(request, userid, size, id, extension):
	if request.user.is_authenticated():
		user = request.user

		photo = Photo.objects.get(owner=user, id=id, extension=extension)
		path = photo.photo

		imagepath = "%sphotos/%d/%s.%s" % (settings.MEDIA_ROOT, user.id, photo.name, extension)

		image = open(imagepath, "r")
		mimetype = mimetypes.guess_type(imagepath)[0]
		if not mimetype: mimetype = "application/octet-stream"

		response = HttpResponse(image.read(), mimetype=mimetype)
		response["Content-Disposition"]= "attachment; filename=%s" % photo.raw_name

		return response
	else:
		return HttpResponseRedirect(reverse("account.views.custom_login"))

def album_image_download(request, albumid, userid, size, id, extension):
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

	image = open(imagepath, "r")
	mimetype = mimetypes.guess_type(imagepath)[0]
	if not mimetype: mimetype = "application/octet-stream"

	response = HttpResponse(image.read(), mimetype=mimetype)
	response["Content-Disposition"]= "attachment; filename=%s" % photo.raw_name

	return response



