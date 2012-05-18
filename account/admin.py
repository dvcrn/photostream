from django.contrib import admin
from account.models import *

class TypeAdmin(admin.ModelAdmin):
	list_display = ('name', 'duration', 'photolimit', 'albumlimit')

class ExtendedAdmin(admin.ModelAdmin):
	list_filter = ('accounttype', )
	list_display = ('user', 'accounttype', 'upgraded_on')
	search_fields = ['user']

admin.site.register(AccountType, TypeAdmin)
admin.site.register(ExtendedUser, ExtendedAdmin)