from django.conf import settings
from django.core.urlresolvers import reverse

class SWFUploadMiddleware(object):
	def process_request(self, request):
		if (request.method == 'POST') and (request.path == reverse('library.views.upload')) and request.POST.has_key(settings.SESSION_COOKIE_NAME):
			request.COOKIES[settings.SESSION_COOKIE_NAME] = request.POST[settings.SESSION_COOKIE_NAME]