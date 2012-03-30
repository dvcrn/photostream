from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Token(models.Model):
	user = models.ForeignKey(User, unique=True)
	token = models.CharField(max_length=40)
	expires = models.DateTimeField()
	created = models.DateTimeField(auto_now=True)
	class Meta:
		verbose_name = 'Token'
		verbose_name_plural = 'Tokens'

	def __unicode__(self):
		return "Token for %s" % self.user.username
