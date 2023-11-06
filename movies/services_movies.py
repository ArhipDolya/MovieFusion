from typing import Tuple, Optional, Union

from django.db.models import Model, QuerySet
from django.shortcuts import get_object_or_404
from django.core.cache import cache

from .serializers import FavoriteMovieSerializer, RatingSerializer

from .models import Movie, FavoriteMovie, Rating
from .exceptions import MovieNotFoundException


def get_movie_ratings(movie_slug: str) -> QuerySet[Rating]:
    cache_key = f'movie_ratings_{movie_slug}'

    cached_ratings = cache.get(cache_key)

    if cached_ratings is not None:
        return cached_ratings

    ratings = Rating.objects.filter(movie__slug=movie_slug).prefetch_related('movie')

    cache.set(cache_key, ratings, 120)
    
    return ratings


def add_movie_to_favorites(user: Model, movie_slug: str) -> Tuple[bool, Union[str, FavoriteMovie]]:
    movie = get_object_or_404(Movie, slug=movie_slug)

    # Check if the movie is already in the user's favorites
    existing_favorite_movie = FavoriteMovie.objects.filter(user=user, movie=movie).first()

    if existing_favorite_movie:
        return False, 'Movie is already in favorites.'

    favorite_movie = FavoriteMovie.objects.create(user=user, movie=movie)

    return True, favorite_movie


def remove_movie_from_favorites(user: Model, movie_slug: str) -> Tuple[bool, Optional[str]]:
    movie = get_object_or_404(Movie, slug=movie_slug)

    favorite_movie = FavoriteMovie.objects.filter(user=user, movie=movie).first()

    if favorite_movie:
        favorite_movie.delete()
        return True, None

    return False, 'Movie not in favorites'


def get_user_favorite_movie(user: Model) -> dict:
    favorite_movie = FavoriteMovie.objects.filter(user=user).prefetch_related('movie')
    serializer = FavoriteMovieSerializer(favorite_movie, many=True)
    favorite_movie_data = serializer.data

    return favorite_movie_data


class RatingService:
    def create_or_update_rating(self, user: Model, movie_slug: str, rating: str) -> dict:
        try:
            movie = Movie.objects.select_related(None).get(slug=movie_slug)
        except Movie.DoesNotExist:
            raise MovieNotFoundException("Movie not found")

        existing_rating = Rating.objects.filter(user=user, movie=movie).first()
        if existing_rating:
            # Update the existing rating
            existing_rating.rating = rating
            existing_rating.save()
            serializer = RatingSerializer(existing_rating)
        else:
            # Create a new rating
            new_rating = Rating.objects.create(user=user, movie=movie, rating=rating)
            serializer = RatingSerializer(new_rating)

        return serializer.data