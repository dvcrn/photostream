from django.shortcuts import render_to_response
from library.models import Photo, User, Album
from django.template import RequestContext
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse


# Create your views here.
def library(request):
	if request.user.is_authenticated():
		user = request.user

		photos = Photo.objects.filter(owner=user)
		albums = Album.objects.filter(owner=user)

		module = {}
		module['title'] = "Library"
		module['name'] = "library_photos"

		return render_to_response("library.html", {
				'photos': photos,
				'albums': albums,
				'module': module
			}, context_instance=RequestContext(request))
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

def test(request):
	#curl -X POST -F fileupload=@bildchen.png 127.0.0.1:8000/test/ > muh.html
	if request.method == 'POST':
		myfile = request.FILES['fileupload']
		destination = open('/Users/David/Developer/photostream/photostream/media/tmp/%s' % myfile.name, "wb+")
		for chunk in myfile.chunks():
			destination.write(chunk)

		destination.close()

	assert False