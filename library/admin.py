from django.contrib import admin
from library.models import *

class PhotoAdmin(admin.ModelAdmin):
	list_filter = ('extension', 'processed', 'created', 'flag')
	list_display = ('id', 'name', 'raw_name', 'extension', 'photo', 'owner', 'processed', 'created', 'flag')
	search_fields = ['name', 'description']

	def has_add_permission(self, request):
		return False

class AlbumAdmin(admin.ModelAdmin):
	list_filter = ('created', )
	list_display = ('name', 'is_public', 'is_protected', 'password', 'owner', 'created')
	search_fields = ['name']


admin.site.register(Photo, PhotoAdmin)
admin.site.register(Album, AlbumAdmin)