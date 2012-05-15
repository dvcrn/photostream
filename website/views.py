from django.shortcuts import render_to_response

def home(request):
	return render_to_response("website/home.html")

def pricing(request):
	return render_to_response("website/home.html")

def blog(request):
	return render_to_response("website/home.html")

def notify(request):
	return render_to_response("website/home.html")