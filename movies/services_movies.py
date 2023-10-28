from django.shortcuts import get_object_or_404

from .serializers import FavoriteMovieSerializer

from .models import Movie, FavoriteMovie, Rating


def get_movie_ratings(movie_slug):
    ratings = Rating.objects.filter(movie__slug=movie_slug)
    return ratings


def add_movie_to_favorites(user, movie_slug):
    movie = get_object_or_404(Movie, slug=movie_slug)

    # Check if the movie is already in the user's favorites
    existing_favorite_movie = FavoriteMovie.objects.filter(user=user, movie=movie).first()

    if existing_favorite_movie:
        return False, 'Movie is already in favorites.'

    favorite_movie = FavoriteMovie.objects.create(user=user, movie=movie)

    return True, favorite_movie


def remove_movie_from_favorites(user, movie_slug):
    movie = get_object_or_404(Movie, slug=movie_slug)

    favorite_movie = FavoriteMovie.objects.filter(user=user, movie=movie).first()

    if favorite_movie:
        favorite_movie.delete()
        return True, None

    return False, 'Movie not in favorites'


def get_user_favorite_movie(user):
    favorite_movie = FavoriteMovie.objects.filter(user=user)
    serializer = FavoriteMovieSerializer(favorite_movie, many=True)

    return serializer.data

