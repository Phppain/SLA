from django.contrib import admin
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from api.views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'likes', LikeViewSet)
router.register(r'follows', FollowViewSet)
router.register(r'tags', TagViewSet)
router.register(r'posttags', PostTagViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),      # обновление access токена
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),         # проверка токена
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/activate/<uidb64>/<token>/', ActivateAccountView.as_view(), name='activate'),
    path('search/posts/', PostSearchView.as_view()),
]
