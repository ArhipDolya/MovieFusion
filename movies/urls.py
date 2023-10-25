from django.urls import path

from . import views


urlpatterns = [
    path('api/v1/movies/', views.MovieListView.as_view(), name='movie-list'),
    path('api/v1/movie/<int:id>', views.MovieDetailsView.as_view(), name='movie-by-id'),
    path('api/v1/movie/<slug:slug>', views.MovieDetailsView.as_view(), name='movie-by-slug'),
    path('api/v1/categories/', views.CategoryListView.as_view(), name='category-list'),
    path('api/v1/ratings/', views.RatingListView.as_view(), name='rating-list'),
    path('api/v1/favorite-movies/', views.FavoriteMovieViewSet.as_view({'post': 'create', 'delete': 'destroy'}), name='favorite-movie'),
]