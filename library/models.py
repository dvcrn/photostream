from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, pre_delete, post_delete
import os

class Album(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(User)
    created = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=False)
    class Meta:
        verbose_name = ('Album')
        verbose_name_plural = ('Albums')
        ordering = ['-created']

    def __unicode__(self):
        return self.name
    

class Photo(models.Model):
    name = models.CharField(max_length=50)
    caption = models.TextField(max_length=200, blank=True)
    extension = models.CharField(max_length=5)
    owner = models.ForeignKey(User)
    photo = models.FileField(upload_to="photos")
    album = models.ManyToManyField(Album, blank=True)
    created = models.DateTimeField(auto_now=True)
    processed = models.BooleanField(default=False)
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
            cmd = "python /home/ubuntu/photostream/scripts/fileparser.py %s &" % (instance.id)
            os.system(cmd)

        post_save.connect(resizePhoto, sender=Photo)

post_save.connect(resizePhoto, sender=Photo)