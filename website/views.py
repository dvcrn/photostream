from django.shortcuts import render_to_response
from django.template import RequestContext

def home(request):
	return render_to_response("website/home.html", {}, context_instance=RequestContext(request))

def pricing(request):
	return render_to_response("website/home.html")

def blog(request):
	return render_to_response("website/home.html")

def notify(request):
	return render_to_response("website/home.html")