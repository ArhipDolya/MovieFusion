from django.urls import path, include

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter

from .views import RegistrationView, LoginView, CommentViewSet


router = DefaultRouter()
router.register(r'api/v1/comments', CommentViewSet)


urlpatterns = [
    path('api/v1/register/', RegistrationView.as_view(), name='register'),
    path('api/v1/login/', LoginView.as_view(), name='login'),
    path('', include(router.urls)),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]