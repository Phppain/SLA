from django.contrib import admin
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from api.views import *

router = DefaultRouter()
router.register(r'Users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls))
]
