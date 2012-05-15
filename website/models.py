from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Blogpost(models.Model):
	title = models.CharField(max_length=200)
	slug = models.SlugField()
	text = models.TextField(max_length=5000)
	author = models.ForeignKey(User)
	is_published = models.BooleanField(default=True)
	created_on = models.DateField()
	class Meta:
		verbose_name = 'Post'
		verbose_name_plural = 'Posts'

	def __unicode__(self):
		return self.title