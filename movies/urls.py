from django.urls import path, include

from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'api/v1/ratings', views.RatingViewSet)

urlpatterns = [
    path('api/v1/movies/', views.MovieListView.as_view(), name='movie-list'),
    path('api/v1/movies/<int:id>', views.MovieDetailsView.as_view(), name='movie-by-id'),
    path('api/v1/movies/<slug:slug>', views.MovieDetailsView.as_view(), name='movie-by-slug'),
    path('api/v1/categories/', views.CategoryListView.as_view(), name='category-list'),
    path('', include(router.urls)),
    path('api/v1/movies/<slug:slug>/average-ratings/', views.AverageRatingView.as_view(), name='movie-average-rating'),
    path('api/v1/favorite-movies/', views.FavoriteMovieViewSet.as_view({'post': 'create', 'delete': 'destroy', 'get': 'list'}), name='favorite-movie'),
]