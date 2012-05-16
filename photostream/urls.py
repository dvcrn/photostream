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

urlpatterns += patterns('website.views',
    url(r'^$', 'home'),
    url(r'^pricing/$', 'pricing'),
    url(r'^blog/$', 'blog'),
    url(r'^notify/$', 'notify'),
)

urlpatterns += patterns('library.views',
	url(r'^app/$', 'library'),
    url(r'^app/album/(?P<id>\d+)/$', 'album'),
    url(r'^app/recent/$', 'recent'),
    url(r'^image/(?P<userid>\d+)/(?P<id>\d+)_(?P<size>\w+).(?P<extension>\w+)$', 'image'),

    url(r'^(?P<userid>\d+)/album/(?P<albumid>\d+)/$', 'album_public'),
)

urlpatterns += patterns('api.views',
    
    url(r'^api/album/(?P<id>\d+)/$', 'album'),

    url(r'^api/add/album/$', 'add_album'),
    url(r'^api/rename/album/$', 'rename_album'),
    url(r'^api/delete/album/$', 'delete_album'),
    url(r'^api/public/album/$', 'public_album'),
    
    url(r'^api/album/add/$', 'album_photo_add'),

    url(r'^api/photos/all/$', 'photos_all'),
    url(r'^api/photos/recent/$', 'photos_recent'),

    url(r'^api/delete/photos/$', 'photos_delete'),

    url(r'^api/auth/$', 'auth'),    
    url(r'^api/upload/$', 'upload'),    
)

urlpatterns += staticfiles_urlpatterns()

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
        }),
   )