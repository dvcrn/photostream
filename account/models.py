from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from datetime import datetime

class AccountType(models.Model):

	name = models.CharField(max_length=50)
	duration = models.IntegerField()
	photolimit = models.IntegerField(default=0)
	albumlimit = models.IntegerField(default=0)

	class Meta:
		verbose_name = 'AccountType'
		verbose_name_plural = 'AccountTypes'

	def __unicode__(self):
		return self.name
	

class ExtendedUser(models.Model):
	# Hook with djangos user
	user = models.OneToOneField(User)

	# Add some more fields
	accounttype = models.ForeignKey(AccountType, default=0)
	upgraded_on = models.DateField(default=datetime.now())

	class Meta:
		verbose_name = 'User Account'
		verbose_name_plural = 'User Accounts'

	def __unicode__(self):
		return self.user.username

def create_extended_user(sender, instance, created, **kwargs):
	if created:
		ExtendedUser.objects.create(instance=instance)