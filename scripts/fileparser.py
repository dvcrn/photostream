#!/usr/bin/env python
# -*- encoding: utf-8 -*-

import syslog
import MySQLdb
import Image
import os
import zipfile
import sys
import shutil

sys.path.append("../photostream/")
import settings as settings

mediapath = settings.MEDIA_ROOT
thumbdestination = "thumbs"

def process(photoid):
	# connect to mysql
	try:
		host = settings.DATABASES['default']['HOST']
		database = settings.DATABASES['default']['NAME']
		user = settings.DATABASES['default']['USER']
		password = settings.DATABASES['default']['PASSWORD']

		db = MySQLdb.connect(host=host,
							 user=user,
							 passwd=password,
							 charset = "utf8",
							 db=database)

		cursor = db.cursor()
		cursor.execute("""SELECT owner_id, photo, name, extension FROM library_photo WHERE id = %s""" % (photoid))
		userid, relative_filepath, photoname, extension = cursor.fetchone()
		
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

		height = round(float(180) / ratio)
		thumb = image.resize((180, int(height)), Image.ANTIALIAS)   

		thumb.save("%s%s_180h.%s" % (absolute_userpath, photoname, extension))

		sql =  "UPDATE library_photo SET processed = 1 WHERE id = %s" % (photoid)
		cursor.execute(sql)
		print sql

	except MySQLdb.Error, e:
		print MySQLdb.Error, e
		sys.exit(1)


if len(sys.argv) > 1:
	photoid = sys.argv[1]
	process(photoid)
else:
	print "photoid"