# -*- coding: UTF-8 -*-
from django.shortcuts import render_to_response
from library.models import Photo, User, Album
from django.template import RequestContext
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse

def custom_login(request):
	if request.user.is_authenticated():
		return HttpResponseRedirect(reverse("website.views.home"))

	if request.method == "POST":
		try: 
			email = request.POST.get("email", "")
			password = request.POST.get("password", "")

			try: 
				user = User.objects.get(email=email)
				user = authenticate(username=user.username, password=password)

				if user is not None:
					if user.is_active:
						login(request, user)
					else:
						raise UserWarning("This account is not active or propably banned.")
				else:
					raise UserWarning("Wrong username / password combination.")

			except User.DoesNotExist:
				raise UserWarning("This user does not exist.");

		except UserWarning, e:
			message = str(e)
			return render_to_response("account/login.html", {
				"error": message
			}, context_instance=RequestContext(request))	

		return HttpResponseRedirect(reverse("website.views.home"))

	else:
		return render_to_response("account/login.html", {}, context_instance=RequestContext(request))

def custom_logout(request):
	logout(request)
	return HttpResponseRedirect(reverse("website.views.home"))