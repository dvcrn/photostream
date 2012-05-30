from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, pre_delete, post_delete
from photostream import settings
from datetime import datetime
import os

class Album(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(User)
    created = models.DateTimeField(default=datetime.now())
    is_public = models.BooleanField(default=False)
    class Meta:
        verbose_name = ('Album')
        verbose_name_plural = ('Albums')
        ordering = ['-created']

    def __unicode__(self):
        return self.name
    

class Photo(models.Model):
    PHOTO_FLAGS = (
        (0, 'Normal'),
        (1, 'Pending Delete'),
    )

    name = models.CharField(max_length=50)
    raw_name = models.CharField(max_length=100)
    caption = models.TextField(max_length=200, blank=True)
    extension = models.CharField(max_length=5)
    owner = models.ForeignKey(User)
    photo = models.FileField(upload_to="photos")
    album = models.ManyToManyField(Album, blank=True)
    created = models.DateTimeField(default=datetime.now())
    processed = models.BooleanField(default=False)
    flag = models.IntegerField(default=0, choices=PHOTO_FLAGS)
    class Meta:
        verbose_name = ('Photo')
        verbose_name_plural = ('Photos')
        ordering = ['-created']

    def __unicode__(self):
        return self.name


def resizePhoto(sender, instance, created, **kwargs):
    #if instance.status is 4:
    if created:
        post_save.disconnect(resizePhoto, sender=Photo)
            
        if instance.processed is False:
            os.system("export DJANGO_SETTINGS_MODULE=photostream.settings")
            cmd = "python %s %d &" % (settings.API_RESIZER, instance.id)
            os.system(cmd)

        post_save.connect(resizePhoto, sender=Photo)

post_save.connect(resizePhoto, sender=Photo)