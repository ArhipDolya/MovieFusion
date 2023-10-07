from django.urls import path, include

from . import views


urlpatterns = [
    path('movies/', views.MovieListView.as_view(), name='movie-list'),
    path('movie/<int:id>', views.MovieDetailsView.as_view(), name='movie'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('ratings/', views.RatingListView.as_view(), name='rating-list'),
]