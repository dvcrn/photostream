from django.contrib import admin
from website.models import *

class PostAdmin(admin.ModelAdmin):
	list_filter = ('is_published', 'created_on', 'author')
	list_display = ('title', 'author', 'is_published', 'created_on',)
	search_fields = ['title', 'text', 'author']
	prepopulated_fields = {"slug": ("title",)}
	fields = ['title', 'slug', 'text', 'author', 'created_on', 'is_published']

admin.site.register(Blogpost, PostAdmin)