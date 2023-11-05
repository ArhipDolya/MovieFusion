from django.db.models import QuerySet
from rest_framework import viewsets, status
from rest_framework.exceptions import NotFound
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import Serializer
from rest_framework.views import APIView

from .exceptions import MovieNotFoundException
from .models import Movie, Category, Rating, FavoriteMovie
from .serializers import MovieSerializer, CategorySerializer, RatingSerializer, FavoriteMovieSerializer
from .services_movies import get_movie_ratings, add_movie_to_favorites, remove_movie_from_favorites, \
    get_user_favorite_movie, RatingService

from typing import Any, Dict, Type
from loguru import logger


logger.add('debug.log', format="{time} {level} {message}", level="DEBUG", rotation="10 MB", compression="zip")


class MovieListView(ListAPIView):
    """
    List and retrieve movies.
    """

    queryset = Movie.objects.all()
    serializer_class: Type[Serializer] = MovieSerializer


class CategoryListView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class: Type[Serializer] = CategorySerializer

    def list(self, request, *args: Any, **kwargs: Any) -> Response:
        logger.info("Request for list of movie categories")
        response = super().list(request, *args, **kwargs)
        logger.info("Response for list of movie categories")
        return response


class RatingViewSet(viewsets.ModelViewSet):
    """Manage movie ratings.

    Allows users to create or update ratings for movies.

    """

    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

    def create(self, request, *args: Any, **kwargs: Any) -> Response:
        user = request.user
        movie_slug = request.data.get('movie')
        rating = request.data.get('rating')

        rating_service = RatingService()

        try:
            serializer_data: Dict[str, Any] = rating_service.create_or_update_rating(user, movie_slug, rating)

            logger.info(f"Rating created by user {user} for movie {movie_slug}")

            return Response(serializer_data, status=status.HTTP_201_CREATED)
        except MovieNotFoundException as exception:
            logger.error(f"Movie not found: {exception}")
            return Response({'detail': str(exception)}, status=status.HTTP_400_BAD_REQUEST)


class MovieDetailsView(RetrieveAPIView):
    """
    Retrieve movie details.

    This view allows you to retrieve detailed information about a specific movie based on its slug.

    Returns detailed information about a specific movie, including its title, description, categories, and ratings.
    """

    queryset: QuerySet[Movie] = Movie.objects.all()
    serializer_class = MovieSerializer
    lookup_field = 'slug'

    def get_serializer_context(self) -> Dict[str, Any]:
        context: Dict[str, Any] = super().get_serializer_context()
        movie_slug = self.kwargs.get('slug')
        context['ratings'] = get_movie_ratings(movie_slug)
        return context


class FavoriteMovieViewSet(viewsets.ModelViewSet):
    """
    Manage favorite movies.

    This viewset allows users to add, remove, and get their favorite movies.

    # Add Movie to Favorites
    Adds a movie to the user's list of favorite movies. Requires the 'movie_slug' in the request data.

    # Remove Movie from Favorites
    Removes a movie from the user's list of favorite movies. Requires the 'movie_slug' in the request data.

    # List Favorite Movies
    Lists all movies that the user has marked as favorites.
    """

    queryset = FavoriteMovie.objects.all()
    serializer_class = FavoriteMovieSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        movie_slug = request.data.get('movie_slug')
        success, result = add_movie_to_favorites(user=request.user, movie_slug=movie_slug)

        if success:
            favorite_movie = FavoriteMovieSerializer(result).data
            logger.info(f"Movie '{movie_slug}' added to favorites for user '{request.user}'")
            return Response(favorite_movie, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"Failed to add movie '{movie_slug}' to favorites for user '{request.user}': {result}")
            return Response({'detail': result}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        movie_slug = request.data.get('movie_slug')
        success, result = remove_movie_from_favorites(user=request.user, movie_slug=movie_slug)

        if success:
            logger.info(f"Movie '{movie_slug}' removed from favorites for user '{request.user}'")
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            logger.error(f"Failed to remove movie '{movie_slug}' from favorites for user '{request.user}': {result}")
            return NotFound(result)

    def list(self, request, *args, **kwargs):
        favorite_movies = get_user_favorite_movie(user=request.user)
        logger.info(f"Retrieved favorite movies for user '{request.user}'")
        return Response(favorite_movies)


class AverageRatingView(APIView):
    def get(self, request, slug: str) -> Response:
        try:
            movie = Movie.objects.get(slug=slug)
            average_rating: float = movie.calculating_average_rating()
            logger.info(f"Retrieved average rating for movie '{slug}': {average_rating}")
            return Response({"average_rating": average_rating})
        except Movie.DoesNotExist:
            logger.warning(f"Movie with slug '{slug}' not found.")
            return Response({"average_rating": 0})
