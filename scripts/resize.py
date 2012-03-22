import os
import glob
import MySQLdb
import Image

destination = "/Users/David/tmp/wallpaper/thumb/"
source = "/Users/David/tmp/wallpaper/"

path = 'wallpaper/'
listing = os.listdir(path)
for infile in listing:
    if (infile.startswith('.')):
    	continue
    print "Creating thumb for image %s" % infile
    image = Image.open("%s%s" % (source, infile))
    w = image.size[0]
    h = image.size[1]
    ratio = round((float(w)/float(h)),3)

    height = round(float(180) / ratio)
    thumb = image.resize((180, int(height)), Image.ANTIALIAS)   

    name = "thumb_%s" % infile
    thumb.save("%s%s" % (destination, name))