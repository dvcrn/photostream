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
thumbdestination = "thumbs"

def process(photoid):
	# connect to mysql
	try:
		print "Processing photo %s" % photoid
		photo = Photo.objects.get(id=photoid)

		userid = photo.owner.id
		relative_filepath = photo.photo
		photoname = photo.name
		extension = photo.extension
		
		# Create filepathes
		absolute_filepath = "%s%s" % (mediapath, relative_filepath)
		relative_userpath = "photos/%s/" % (userid)
		absolute_userpath = "%s%s/" % (mediapath, relative_userpath)

		'''
		print "Creating thumb:"
		print "User: %s" % userid
		print "Relative Userath: %s" % relative_userpath
		print "Absolute Userath: %s" % absolute_userpath

		print "Relative Path: %s" % relative_filepath
		print "Absolute Path: %s" % absolute_filepath

		print "Name: %s" % photoname
		print "Extension: %s" % (extension)
		'''

		image = Image.open(absolute_filepath)
		w = image.size[0]
		h = image.size[1]
		ratio = round((float(w)/float(h)),3)

		# create thumb
		height = round(float(180) / ratio)
		thumb = image.resize((180, int(height)), Image.ANTIALIAS)   

		thumb.save("%s%s_180w.%s" % (absolute_userpath, photoname, extension))

		# create smaller version
		height = round(float(1000) / ratio)
		big = image.resize((1000, int(height)), Image.ANTIALIAS)   		
		big.save("%s%s_1000w.%s" % (absolute_userpath, photoname, extension))

		photo.processed = True
		photo.save()

	except Exception, e:
		print e
		sys.exit(1)

def processAll():
	# connect to mysql
	try:
		print "Processing all photos"
		photos = Photo.objects.filter(processed=False)

		for photo in photos:
			userid = photo.owner.id
			relative_filepath = photo.photo
			photoname = photo.name
			extension = photo.extension

			print "Processing %s" % photoname

			# Filepathes
			absolute_filepath = "%s%s" % (mediapath, relative_filepath)
			relative_userpath = "photos/%s/" % (userid)
			absolute_userpath = "%s%s/" % (mediapath, relative_userpath)


			'''
			print "Creating thumb:"
			print "User: %s" % userid
			print "Relative Userath: %s" % relative_userpath
			print "Absolute Userath: %s" % absolute_userpath

			print "Relative Path: %s" % relative_filepath
			print "Absolute Path: %s" % absolute_filepath

			print "Name: %s" % photoname
			print "Extension: %s" % (extension)
			'''

			image = Image.open(absolute_filepath)
			w = image.size[0]
			h = image.size[1]
			ratio = round((float(w)/float(h)),3)

			# create thumb
			height = round(float(180) / ratio)
			thumb = image.resize((180, int(height)), Image.ANTIALIAS)   

			thumb.save("%s%s_180w.%s" % (absolute_userpath, photoname, extension))

			# create smaller version
			height = round(float(1000) / ratio)
			big = image.resize((1000, int(height)), Image.ANTIALIAS)   		
			big.save("%s%s_1000w.%s" % (absolute_userpath, photoname, extension))

			photo.processed = True
			photo.save()

	except Exception, e:
		print e
		sys.exit(1)


if len(sys.argv) > 1:
	photoid = sys.argv[1]
	if photoid == "all":
		processAll()
	else:
		process(photoid)
else:
	print "photoid"