from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import Http404
from django.core.urlresolvers import reverse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.utils.decorators import decorator_from_middleware

from library.models import Photo, User, Album
from library.helpers import generate_photourl
from api.models import Token
from api.middleware.auth_check import AuthCheckMiddleware

from photostream import settings

import simplejson
import hashlib
import time
import datetime
import os

##### Remove later

def createPagina(list, limit, page):
	paginator = Paginator(list, limit)

	try:
		pagina = paginator.page(page)
	except PageNotAnInteger:
		pagina = paginator.page(1)
	except EmptyPage:
		images = paginator.page(paginator.num_pages)

	return pagina

def createJsonData(success = True, errorcode = 0, obj = {}):
	obj['success'] = success

	if success is False:
		def switch_errorcode(x):
			return {
				0: "Not specified error",
				1: "Access denided: You don't have access to this album or it does not exist!",
				2: "Access denided: You don't have access to this photo or it does not exist!",
				3: "Please specify a albumname!"
			}.get(errorcode, 0)    

		error = switch_errorcode(errorcode)
		obj['error'] = error
		obj['errorcode'] = errorcode

	return render_to_response("api/json.html", {"json": simplejson.dumps(obj)})

##### Actual views
@decorator_from_middleware(AuthCheckMiddleware)
def photo(request, id):
	user = request.user
	# DELETE Request - Deletes the photo
	if request.method == "DELETE":
		try:
			Photo.objects.get(owner=user, id=id).delete()	
			return createJsonData()
		except Photo.DoesNotExist:
			raise Http404

	# GET Request - Returns all Data for the photo
	else:
		try:
			photo = Photo.objects.get(owner=user, id=id)

			data = {
				"id": photo.id,
				"name": photo.name,
				"raw_name": photo.raw_name,
				"caption": photo.caption,
				"created": time.mktime(photo.created.timetuple()),
				"processed": photo.processed,
				"extension": photo.extension,
				"flag": int(photo.flag),
				"photourls": {
					"download": generate_photourl(photo),
					"thumb": generate_photourl(photo, size="thumb"),
					"big": generate_photourl(photo, size="big"),
				}
			}

			return createJsonData(obj=data)

		except Photo.DoesNotExist, e:
			return createJsonData(success=False, errorcode=2)

@decorator_from_middleware(AuthCheckMiddleware)
def photos(request):
	user = request.user
	# POST Request - Adds new photo
	if request.method == "POST": 
		# TODO: implement
		assert False

	# GET Request - Returns all Photos
	else:
		requested_photos = Photo.objects.filter(owner=user)[:30]

		photodata = []
		for photo in requested_photos:
			tmp = {
				"id": photo.id,
				"name": photo.name,
				"raw_name": photo.raw_name,
				"caption": photo.caption,
				"created": time.mktime(photo.created.timetuple()),
				"processed": photo.processed,
				"flag": int(photo.flag),
				"extension": photo.extension,
				"photourls": {
					"download": generate_photourl(photo),
					"thumb": generate_photourl(photo, size="thumb"),
					"big": generate_photourl(photo, size="big"),
				}
			}

			photodata.append(tmp)

		json = {
			"photos": photodata,
			"count": len(photodata)
		}

		return createJsonData(obj=json)

@decorator_from_middleware(AuthCheckMiddleware)
def album(request, id):
	user = request.user
	# DELETE Request - Deletes the album
	if request.method == "DELETE":
		try:
			Album.objects.get(owner=user, id=id).delete()	
			return createJsonData()
		except Album.DoesNotExist:
			raise Http404
			
	# GET Request - Returns all infos & photos for the album
	else:
		try:
			requested_album = Album.objects.get(id=id, owner=user)
			requested_photos = Photo.objects.filter(album=requested_album, owner=user)

			# Create photolist with all information that should be visible
			photodata = []
			for photo in requested_photos:
				tmp = {
					"id": photo.id,
					"name": photo.name,
					"raw_name": photo.raw_name,
					"caption": photo.caption,
					"created": time.mktime(photo.created.timetuple()),
					"processed": photo.processed,
					"flag": int(photo.flag),
					"photourls": {
						"download": generate_photourl(photo, albumid=requested_album.id),
						"thumb": generate_photourl(photo, albumid=requested_album.id, size="thumb"),
						"big": generate_photourl(photo, albumid=requested_album.id, size="big"),
					}
				}

				photodata.append(tmp)

			# Same for the album itself. Show all information that should be visible
			albuminfo = {
				"id": requested_album.id,
				"name": requested_album.name,
				"is_public": requested_album.is_public,
				"has_password": requested_album.is_protected,
				"created": time.mktime(requested_album.created.timetuple()),
				"count": len(photodata),
				"photos": photodata
			}
			return createJsonData(obj=albuminfo)

		except Album.DoesNotExist, e:
			return createJsonData(success=False, errorcode=1)

@decorator_from_middleware(AuthCheckMiddleware)
def albums(request):
	user = request.user
	# POST Request - Create new album
	if request.method == "POST": 
		albumname = request.POST.get("name", None)

		if albumname:
			album = Album.objects.create(owner=user, name=albumname)
			albuminfo = {
				"id": album.id,
				"name": album.name,
				"is_public": album.is_public,
				"has_password": album.is_protected,
				"created": time.mktime(album.created.timetuple()),
				"count": Photo.objects.filter(owner=user, album=album).count(),
			}

			# We return here the freshly created album as json
			return createJsonData(obj=albuminfo)
		else:
			return createJsonData(errorcode=3, success=False)

	# GET Request - Get all albums
	else:
		requested_albums = Album.objects.filter(owner=user)

		albums = []
		for requested_album in requested_albums:
			album = {
				"id": requested_album.id,
				"name": requested_album.name,
				"is_public": requested_album.is_public,
				"has_password": requested_album.is_protected,
				"created": time.mktime(requested_album.created.timetuple()),
				"count": Photo.objects.filter(owner=user, album=requested_album).count(),
			}

			albums.append(album)

		json = {
			"albums": albums,
			"count": len(albums)
		}

		return createJsonData(obj=json)


