import os
import glob
import MySQLdb

db = MySQLdb.connect(host="localhost", user="root", passwd="", charset = "utf8", db="photostream")
cursor = db.cursor()

path = 'wallpaper/'
listing = os.listdir(path)
for infile in listing:
    if (infile.startswith('.')):
    	continue

    print """INSERT INTO library_photo (name, owner_id, photo, created) VALUES ('%s', '%s', '%s', '%s');""" % (infile, 1, infile, "2012-03-15 11:05:17")
    #cursor.execute("""INSERT INTO library_photo (name, owner_id, photo, created) VALUES ('%s', '%s', '%s', '%s')""" % (infile, 1, infile, "2012-03-15 11:05:17"))