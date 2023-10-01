from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('authentication.urls')),
    path('accounts/', include('allauth.urls')),
    path('', include('googleauth.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)