from django.db import models
from django.contrib.auth.models import User

class Album(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(User)
    created = models.DateTimeField(auto_now=True)
    class Meta:
        verbose_name = ('Album')
        verbose_name_plural = ('Albums')
        ordering = ['-created']

    def __unicode__(self):
        return self.name
    

class Photo(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(User)
    photo = models.FileField(upload_to="photos")
    album = models.ManyToManyField(Album, blank=True)
    created = models.DateTimeField(auto_now=True)
    class Meta:
        verbose_name = ('Photo')
        verbose_name_plural = ('Photos')
        ordering = ['-created']

    def __unicode__(self):
        return self.name
