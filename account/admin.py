from django.contrib import admin
from account.models import *

class UpgradeAdmin(admin.ModelAdmin):
	list_filter = ('type', )
	list_display = ('name', 'type', 'limit', 'duration', 'price')
	search_fields = ['name']

class UserUpgradeAdmin(admin.ModelAdmin):
	list_display = ('user', 'upgrade', 'created')
	search_fields = ['user', 'upgrade']

admin.site.register(UserUpgrade, UserUpgradeAdmin)
admin.site.register(Upgrade, UpgradeAdmin)