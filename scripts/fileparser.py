#!/usr/bin/env python
# -*- encoding: utf-8 -*-

import syslog
import MySQLdb
import Image
import os
import zipfile
import sys
import shutil

sys.path.append("/Users/David/Developer/photostream/photostream/")
import settings as settings

mediapath = settings.MEDIA_ROOT
thumbdestination = "thumbs"

def process(photoid):
	# connect to mysql
	try:
		db = MySQLdb.connect(host="localhost",
							 user="root",
							 passwd="",
							 charset = "utf8",
							 db="photostream")
		cursor = db.cursor()
		cursor.execute("""SELECT photo, name FROM library_photo WHERE id = %s""" % (photoid))
		photopath, photoname = cursor.fetchone()

		fullpath = "%s%s" % (mediapath, photopath)

		#print "Creating thumb:"
		#print "Path: %s" % photopath
		#print "Name: %s" % photoname
		#print "Fullpath: %s" % (fullpath)


		image = Image.open(fullpath)
		w = image.size[0]
		h = image.size[1]
		ratio = round((float(w)/float(h)),3)

		height = round(float(180) / ratio)
		thumb = image.resize((180, int(height)), Image.ANTIALIAS)   

		thumb.save("%s%s/%s" % (mediapath, thumbdestination, photoname))

		cursor.execute("""UPDATE library_photo SET processed = 1 WHERE id = %s""" % (photoid))

	except MySQLdb.Error, e:
		print MySQLdb.Error, e
		sys.exit(1)


if len(sys.argv) > 1:
	photoid = sys.argv[1]
	process(photoid)
else:
	print "photoid"