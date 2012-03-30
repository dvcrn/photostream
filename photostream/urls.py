from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
import settings
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'photostream.views.home', name='home'),
    # url(r'^photostream/', include('photostream.foo.urls')),

    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += patterns('account.views',
    url(r'^login/$', 'custom_login'),
    url(r'^logout/$', 'custom_logout'),
)

urlpatterns += patterns('library.views',
	url(r'^$', 'library'),
    url(r'^album/(?P<id>\d+)/$', 'album'),
    url(r'^recent/$', 'recent'),
    url(r'^test/$', 'test'),
)

urlpatterns += patterns('api.views',
    url(r'^api/album/add/$', 'album_photo_add'),
    url(r'^api/add/album/$', 'add_album'),
    url(r'^api/rename/album/$', 'rename_album'),
    url(r'^api/album/(?P<id>\d+)/$', 'album'),
    url(r'^api/photos/all/$', 'photos_all'),
    url(r'^api/photos/recent/$', 'photos_recent'),

    url(r'^api/auth/$', 'auth'),    
)

urlpatterns += staticfiles_urlpatterns()

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
        }),
   )