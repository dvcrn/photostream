from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import Http404
from django.core.urlresolvers import reverse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from library.models import Photo, User, Album
from api.models import Token

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

##### Actual views

# Get
def photos_all(request):
	if request.user.is_authenticated():
		user = request.user
		page = request.GET.get("page", 1)

		photos = Photo.objects.filter(owner=user, processed=1, flag=0)
		pagina = createPagina(photos, 50, page)

		photos = pagina.object_list

		html = render_to_response("api/photos.html", {"photos": photos}, context_instance=RequestContext(request)).content
		json = {"success": True, "html": html, "title": "Library"}
	else:
		json = {"success": False, "msg": "Only logged in works at the moment."}

	return render_to_response("api/json.html", {"json": simplejson.dumps(json)})


def photos_recent(request):
	if request.user.is_authenticated():
		user = request.user
		photo = Photo.objects.filter(owner=user, processed=1, flag=0).latest("id")
		date = photo.created

		photos = Photo.objects.filter(owner=user, processed=1, flag=0, created=date)

		html = render_to_response("api/photos.html", {"photos": photos}, context_instance=RequestContext(request)).content
		json = {"success": True, "html": html, "title": "Recently Added"}
	else:
		json = {"success": False, "msg": "Only logged in works at the moment."}

	return render_to_response("api/json.html", {"json": simplejson.dumps(json)})

def photos_delete(request):
	if request.user.is_authenticated():
		if request.method == "GET":
			raise Http404

		photoid = request.POST.get("id", 0)

		user = request.user
		photo = Photo.objects.get(owner=user, id=photoid)
		photo.flag = 1
		photo.save()
		
		json = {"success": True}
	else:
		json = {"success": False, "msg": "Only logged in works at the moment."}

	return render_to_response("api/json.html", {"json": simplejson.dumps(json)})


def album(request, id):
	if request.user.is_authenticated():
		user = request.user
		album = Album.objects.get(id=id, owner=user)
		photos = Photo.objects.filter(album=album, owner=user, processed=1, flag=0)

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
			#albumid = int(request.GET.get("albumid", 0))
			#photoids = request.GET.get("photos", 0)

		try: 
			albumid = request.POST.get("albumid", 0)
			photoids = request.POST.get("photos", 0)

			user = request.user
			album = Album.objects.get(id=albumid, owner=user)
			

			photos = photoids.split(",")

			for photo in photos:
				photo = Photo.objects.get(id=photo, owner=user)
				photo.album.add(album)
				photo.save()

			json = {"success": True}
		except Exception, e:
			#assert False
			json = {"success": False, "msg": str(e)}

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

			html = render_to_response("snippets/album.html", {"id": album.id, "name": album.name}, context_instance=RequestContext(request)).content

			json = {"success": True, "html": html}
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
			album.name = name[0:50]
			album.save()

			public = False
			statusClass = ""
			if album.is_public:
				public = True
				statusClass = "statusicon-public"

			html = render_to_response("snippets/album.html", {"id": album.id, "name": album.name, "public": public, "statusclass": statusClass}, context_instance=RequestContext(request)).content

			json = {"success": True, "html": html}
		except Exception:
			json = {"success": False}

		json = simplejson.dumps(json)
		return render_to_response("api/json.html", {'json': json})

	else:
		raise Exception("Sorry, only logged in works atm")

def delete_album(request):
	if request.user.is_authenticated():
		if request.method == "GET":
			raise Http404

		try:
			user = request.user
			id = request.POST.get("id", 0)

			album = Album.objects.get(id=id, owner=user)
			album.delete()

			json = {"success": True}
		except Exception:
			json = {"success": False}

		json = simplejson.dumps(json)
		return render_to_response("api/json.html", {'json': json})

	else:
		raise Exception("Sorry, only logged in works atm")

def public_album(request):
	if request.user.is_authenticated():
		if request.method == "GET":
			raise Http404

		try:
			user = request.user
			id = request.POST.get("id", 0)

			album = Album.objects.get(id=id, owner=user)

			if album.is_public:
				album.is_public = False
			else:
				album.is_public = True

			album.save()

			json = {"success": True, "public": album.is_public, "url": reverse("library.views.album_public", kwargs={'userid': user.id, 'albumid': album.id })}
		except Exception:
			json = {"success": False}

		json = simplejson.dumps(json)
		return render_to_response("api/json.html", {'json': json})

	else:
		raise Exception("Sorry, only logged in works atm")

def auth(request):
	

	# exceptions auf obersten level behandeln
	try: 
		if request.method != "POST":
			raise UserWarning("Only POST works. Sorry, man!")

		email = request.POST.get("email")
		password = request.POST.get("password")

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
				"expires": int(time.mktime(token_expires.timetuple()))
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


def upload(request):
	try:
		if request.method == 'POST':
			token = request.POST.get("token", None)
			if token is None:
				raise UserWarning("No Usertoken given.")

			try:
				tokenobj = Token.objects.get(token=token)
			except Token.DoesNotExist:
				raise UserWarning("The token >>> %s <<< is invalid." % token)

			if tokenobj.user.is_active:
				myfile = request.FILES['fileupload']
				extension = os.path.splitext(myfile.name)[1]
				extension = extension[1:5]
				photocount = Photo.objects.filter(owner=tokenobj.user).count() + 1

				filename = photocount
				filename_full = "%s.%s" % (filename, extension)

				relative_userpath = 'photos/%s/' % tokenobj.user.id
				absolute_userpath = '%s%s' % (settings.MEDIA_ROOT, relative_userpath)

				relative_filepath = '%s%s' % (relative_userpath, filename_full)
				absolute_filepath = '%s%s' % (absolute_userpath, filename_full)

				if not os.path.exists(absolute_userpath):
					os.makedirs(absolute_userpath)

				destination = open(absolute_filepath, "wb+")
				
				for chunk in myfile.chunks():
					destination.write(chunk)

				destination.close()

				Photo.objects.create(owner=tokenobj.user, name=filename, extension=extension, photo=relative_filepath)

				data = { "success": True }
			else:
				raise UserWarning("Invalid User")


	except UserWarning, e:
		data = {
			"success": False,
			"msg": str(e)
		}

	json = simplejson.dumps(data)
	return render_to_response("api/json.html", {'json': json})


