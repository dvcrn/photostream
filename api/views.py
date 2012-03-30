from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import Http404
from django.core.urlresolvers import reverse

from library.models import Photo, User, Album
from api.models import Token

from photostream import settings

import simplejson
import hashlib
import time
import datetime

# Get
def photos_all(request):
	if request.user.is_authenticated():
		user = request.user
		photos = Photo.objects.filter(owner=user)

		html = render_to_response("api/photos.html", {"photos": photos}, context_instance=RequestContext(request)).content
		json = {"success": True, "html": html, "title": "Library"}
	else:
		json = {"success": False, "msg": "Only logged in works at the moment."}

	return render_to_response("api/json.html", {"json": simplejson.dumps(json)})


def photos_recent(request):
	if request.user.is_authenticated():
		user = request.user
		photos = Photo.objects.filter(owner=user)[:30]

		html = render_to_response("api/photos.html", {"photos": photos}, context_instance=RequestContext(request)).content
		json = {"success": True, "html": html, "title": "Recently Added"}
	else:
		json = {"success": False, "msg": "Only logged in works at the moment."}

	return render_to_response("api/json.html", {"json": simplejson.dumps(json)})


def album(request, id):
	if request.user.is_authenticated():
		user = request.user
		album = Album.objects.get(id=id, owner=user)
		photos = Photo.objects.filter(album=album, owner=user)

		html = render_to_response("api/photos.html", {"photos": photos}, context_instance=RequestContext(request)).content

		json = {"success": True, "html": html, "title": album.name}
	else:
		json = {"success": False, "msg": "Only logged in works at the moment."}

	return render_to_response("api/json.html", {"json": simplejson.dumps(json)})

# Post

def album_photo_add(request):
	if request.user.is_authenticated():
		if request.method == "GET":
			raise Http404
			albumid = int(request.GET.get("albumid", 0))
			photoid = int(request.GET.get("photoid", 0))

		try: 
			albumid = request.POST.get("albumid", 0)
			photoid = request.POST.get("photoid", 0)

			user = request.user
			album = Album.objects.get(id=albumid, owner=user)
			photo = Photo.objects.get(id=photoid, owner=user)

			photo.album.add(album)
			photo.save()

			json = {"success": True}
		except Exception:
			json = {"success": False}

		json = simplejson.dumps(json)
		return render_to_response("api/json.html", {'json': json})
	else:
		raise Exception("Sorry, only logged in works atm")

def add_album(request):
	if request.user.is_authenticated():
		if request.method == "GET":
			raise Http404

		try:
			user = request.user
			name = request.POST.get("name")

			album = Album.objects.create(name=name, owner=user);

			json = {"success": True, "url": reverse("library.views.album", kwargs={'id': album.id}), "id": album.id, "ajax": reverse("api.views.album", kwargs={'id': album.id})}
		except Exception:
			json = {"success": False}

		json = simplejson.dumps(json)
		return render_to_response("api/json.html", {'json': json})

	else:
		raise Exception("Sorry, only logged in works atm")

def rename_album(request):
	if request.user.is_authenticated():
		if request.method == "GET":
			raise Http404

		try:
			user = request.user
			name = request.POST.get("name")
			id = request.POST.get("id", 0)

			album = Album.objects.get(id=id)
			album.name = name
			album.save()

			json = {"success": True}
		except Exception:
			json = {"success": False}

		json = simplejson.dumps(json)
		return render_to_response("api/json.html", {'json': json})

	else:
		raise Exception("Sorry, only logged in works atm")

def auth(request):
	email = request.GET.get("email")
	password = request.GET.get("password")

	# exceptions auf obersten level behandeln
	try: 
		try:
			user = User.objects.get(email=email)
			user = authenticate(username=user.username, password=password)

			if user is None:
				raise UserWarning("Wrong username / password combination")

			if not user.is_active:
				raise UserWarning("This account is not active or propably banned.")

			token_time = datetime.datetime.now()
			token_expires = token_time + datetime.timedelta(minutes=60)

			lib = hashlib.sha1()
			lib.update(settings.API_SECRET)
			lib.update(user.username)
			lib.update("%s " % token_time)

			formated_expires = time.strftime("%Y-%m-%d %H:%M", token_expires.timetuple())

			token_entry = Token.objects.get_or_create(user=user)[0]
			token_entry.token = lib.hexdigest()
			token_entry.expires = formated_expires
			token_entry.save()

			data = {
				"success": True,
				"token": lib.hexdigest(),
				"expires": time.mktime(token_expires.timetuple())
			}

		except User.DoesNotExist:
			raise UserWarning("This user does not exist.")

	except UserWarning, e:
		data = {
			"success": False,
			"msg": str(e)
		}

	json = simplejson.dumps(data)
	return render_to_response("api/json.html", {'json': json})





