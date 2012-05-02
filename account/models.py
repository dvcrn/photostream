from django.db import models
from django.contrib.auth.models import User

class Upgrade(models.Model):
	TYPE_CHOICES = (
		(0, 'Subscription'),
		(1, 'Promo'),
		(2, 'Test'),
	)

	name = models.CharField(max_length=200)
	type = models.IntegerField(default=0, choices=TYPE_CHOICES)
	limit = models.IntegerField(default=0)
	duration = models.IntegerField(default=30)
	price = models.FloatField(default=0)

	class Meta:
		verbose_name = 'Upgrade'
		verbose_name_plural = 'Upgrades'

	def __unicode__(self):
		return self.name
	
class UserUpgrade(models.Model):
	user = models.ForeignKey(User)
	upgrade = models.ForeignKey(Upgrade)
	created = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = 'UserUpgrade'
		verbose_name_plural = 'UserUpgrades'

	def __unicode__(self):
		return unicode(self.user)
	
