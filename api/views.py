from django.shortcuts import render_to_response
from library.models import Photo, User, Album
from django.template import RequestContext
from django.contrib.auth.models import User
from django.http import Http404
from django.core.urlresolvers import reverse

import simplejson

def album_photo_add(request):
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
	return render_to_response("json.html", {'json': json})

def add_album(request):
	if request.method == "GET":
		raise Http404

	try:
		user = request.user
		name = request.POST.get("name")

		album = Album.objects.create(name=name, owner=user);

		json = {"success": True, "url": reverse("library.views.album", kwargs={'id': album.id})}
	except Exception:
		json = {"success": False}

	json = simplejson.dumps(json)
	return render_to_response("json.html", {'json': json})