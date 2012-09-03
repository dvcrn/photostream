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
				1: "Access denided: You don't have access to this album!",
				2: "180w"
			}.get(errorcode, 0)    

		error = switch_errorcode(errorcode)
		obj['error'] = error
		obj['errorcode'] = errorcode

	return render_to_response("api/json.html", {"json": simplejson.dumps(obj)})

##### Actual views
@decorator_from_middleware(AuthCheckMiddleware)
def album(request, id):
	try:
		user = request.user
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
					"download": generate_photourl(photo, requested_album.id),
					"thumb": generate_photourl(photo, requested_album.id, "thumb"),
					"big": generate_photourl(photo, requested_album.id, "big"),
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