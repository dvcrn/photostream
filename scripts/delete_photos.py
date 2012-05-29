#!/usr/bin/env python
# -*- encoding: utf-8 -*-

import syslog
import MySQLdb
import Image
import os
import zipfile
import sys
import shutil

sys.path.append("/Users/David/Developer/photostream")
#sys.path.append("/var/www/photostream/")
import photostream.settings as settings
from library.models import Photo

mediapath = settings.MEDIA_ROOT

photos = Photo.objects.filter(flag=1)
for photo in photos:
	print "Deleting photo %s" % photo.id

	userid = photo.owner.id
	relative_filepath = photo.photo
	photoname = photo.name
	extension = photo.extension
	
	# Create filepathes
	absolute_filepath = "%s%s" % (mediapath, relative_filepath)
	relative_userpath = "photos/%s/" % (userid)
	absolute_userpath = "%s%s" % (mediapath, relative_userpath)

	img1 = "%s%s.%s" % (absolute_userpath, photo.name, photo.extension)
	img2 = "%s%s_180w.%s" % (absolute_userpath, photo.name, photo.extension)
	img3 = "%s%s_1000w.%s" % (absolute_userpath, photo.name, photo.extension)

	os.system("rm %s" % img1)
	os.system("rm %s" % img2)
	os.system("rm %s" % img3)

	photo.delete()