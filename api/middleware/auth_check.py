from django.shortcuts import render_to_response
import json

class AuthCheckMiddleware(object):
	def process_view(self, request, view_func, view_args, view_kwargs):
		if not request.user.is_authenticated():
			data = {"success": False, "msg": "Please authenticate."}
			return render_to_response("api/json.html", {"json": json.dumps(data)})