from django.urls import path, include

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter

from .views import RegistrationView, LoginView, CommentViewSet, get_comments_for_movie, like_comment, unlike_comment


router = DefaultRouter()
router.register(r'api/v1/comments', CommentViewSet)


urlpatterns = [
    path('api/v1/register/', RegistrationView.as_view(), name='register'),
    path('api/v1/login/', LoginView.as_view(), name='login'),
    path('', include(router.urls)),
    path('api/v1/movie/comments/<str:movie_slug>/', get_comments_for_movie),
    path('api/v1/movie/comments/like-comment/<int:comment_id>/', like_comment),
    path('api/v1/movie/comments/unlike-comment/<int:comment_id>/', unlike_comment),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]